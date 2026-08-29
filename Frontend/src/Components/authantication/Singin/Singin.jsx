import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../../../Utilities/axios.js";
import { ENDPOINTS } from "../../../constants/api.js";
import "./Singin.css";

function Singin() {
	const navigate = useNavigate();

	const [formErr, setFormErr] = useState("");
	const [loading, setLoading] = useState(false);

	const handleForm = async (e) => {
		e.preventDefault();
		setFormErr("");
		setLoading(true);

		const form = e.target;

		const username = form.username.value;
		const email = form.email.value;
		const password = form.password.value;
		const file = form.file.files[0];

		const formData = new FormData();
		formData.append("username", username);
		formData.append("email", email);
		formData.append("password", password);
		formData.append("file", file);

		try {
			const res = await axios.post(
				ENDPOINTS.USERS.REGISTER,
				formData
			);

			if (res.status === 201) {
				localStorage.setItem("name", username);
				navigate("/login");
			}
		} catch (error) {
			if (error.response) {
				setFormErr(error.response.data.message || "Registration failed");
			} else {
				setFormErr("Network error. Please try again.");
			}
			console.error("Registration error:", error);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="Singin formcontainer">
			<div className="Singin formWrapper">
				<span className="logoup">Logo</span>
				<span className="logoups">Sign Up</span>

				<form onSubmit={handleForm}>
					<input name="username" type="text" placeholder="Username" required />
					<input name="email" type="email" placeholder="Email" required />
					<input name="password" type="password" placeholder="Password" required />

					<input
						style={{ display: "none" }}
						name="file"
						type="file"
						id="file"
						accept="image/*"
					/>

					<label htmlFor="file">
						<span>Add an Avatar</span>
					</label>

					<button type="submit" disabled={loading}>
						{loading ? "Registering..." : "Sign Up"}
					</button>
				</form>

				{formErr && (
					<p style={{ color: "red", fontSize: "14px", margin: "8px 0" }}>
						{formErr}
					</p>
				)}

				<p>
					Already have an account? <Link to="/login">Login</Link>
				</p>
			</div>
		</div>
	);
}

export default Singin;
