import React, { useState } from "react";
import "./Login.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addUser } from "../../../store/userSlice";

function Login() {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const [formErr, setFormErr] = useState("");
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setFormErr("");
		setLoading(true);

		const form = e.target;
		const username = form.username.value;
		const password = form.password.value;

		try {
			const res = await axios.post(
				"http://localhost:5000/api/users/login",
				{ username, password }
			);

			if (res.status === 200) {
				console.log(res);//maybe parse into

				const { profileImage, Username, id, accessToken, refreshToken } = res.data.data;

				// Store in session
				sessionStorage.setItem("profileImage", profileImage);
				sessionStorage.setItem("Username", Username);
				sessionStorage.setItem("id", id);
				sessionStorage.setItem("accessToken", accessToken);
				sessionStorage.setItem("refreshToken", refreshToken);

				// Store in Redux
				dispatch(addUser({ id, username: Username, profileImage }));

				// Redirect to home
				navigate("/");
			}
		} catch (error) {
			if (error.response) {
				if (error.response.status === 401) {
					setFormErr("Wrong password.");
				} else if (error.response.status === 404) {
					setFormErr("Username not found.");
				} else {
					setFormErr(error.response.data.message || "Login failed.");
				}
			} else {
				setFormErr("Network error. Please try again.");
			}

			console.error("Login error:", error);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="Login formcontainer">
			<div className="Login formWrapper">
				<span className="logoup">Logo</span>
				<span className="logoups">Login</span>

				<form onSubmit={handleSubmit}>
					<input
						name="username"
						type="text"
						placeholder="Username"
						required
					/>
					<input
						name="password"
						type="password"
						placeholder="Password"
						required
					/>

					<button type="submit" disabled={loading}>
						{loading ? "Logging in..." : "Login"}
					</button>
				</form>

				{formErr && (
					<p
						className="error-message"
						style={{ color: "red", fontSize: "14px", margin: "8px 0" }}
					>
						{formErr}
					</p>
				)}

				<p>
					Don’t have an account? <Link to="/signup">Sign Up</Link>
				</p>
			</div>
		</div>
	);
}

export default Login;
