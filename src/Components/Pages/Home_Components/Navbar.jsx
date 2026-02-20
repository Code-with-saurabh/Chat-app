import React, { useEffect } from "react";
import "./Navbar.css";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { clearSecondUser } from "../../../store/secondUserSlice";
import { removeUser } from "../../../store/userSlice";

function Navbar() {
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const profileImage = sessionStorage.getItem("profileImage");
	const usernameSession = sessionStorage.getItem("Username");

	const usernameRedux = useSelector((state) => state.user.username);

	// 🔥 Redirect if not logged in
	useEffect(() => {
		if (!usernameSession) {
			navigate("/login");
		}
	}, [usernameSession, navigate]);

	// const handleLogout = () => {
	// 	// Clear session storage
	// 	sessionStorage.removeItem("Username");
	// 	sessionStorage.removeItem("profileImage");
	// 	sessionStorage.removeItem("id");

	// 	// Clear redux state
	// 	dispatch(removeUser());
	// 	dispatch(removeSecondUser());

	// 	// Redirect to login
	// 	navigate("/login");
	// };
const handleLogout = async () => {
	try {
		const refreshToken = sessionStorage.getItem("refreshToken");

		if (refreshToken) {
			await axios.post("/logout", {
				refreshToken
			});
		}
	} catch (error) {
		console.log("Logout API failed:", error);
	}

	// 🔥 Clear session storage
	sessionStorage.clear();

	// 🔥 Clear redux state
	dispatch(removeUser());
	dispatch(clearSecondUser());

	// 🔥 Redirect to login
	navigate("/login");
};
	return (
		<div className="Navbar">
			<span className="navLogo">Logo</span>

			<div className="user">
				<img
					src={profileImage || "/default-avatar.png"}
					alt="Profile"
				/>

				<span>{usernameSession || usernameRedux}</span>

				<button onClick={handleLogout}>
					Logout
				</button>
			</div>
		</div>
	);
}

export default Navbar;
