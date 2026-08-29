import React, { useEffect } from "react";
import "./Navbar.css";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { clearSecondUser } from "../../../store/secondUserSlice";
import { removeUser } from "../../../store/userSlice";
import axios from '../../../Utilities/axios.js';
import { ENDPOINTS } from '../../../constants/api.js';
import Avatar from "../../common/Avatar.jsx";

function Navbar() {
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const profileImage = sessionStorage.getItem("profileImage");
	const usernameSession = sessionStorage.getItem("Username");
	const usernameRedux = useSelector((state) => state.user.username);

	useEffect(() => {
		if (!usernameSession) {
			navigate("/login");
		}
	}, [usernameSession, navigate]);

	const handleLogout = async () => {
		try {
			const refreshToken = sessionStorage.getItem("refreshToken");

			if (refreshToken) {
				await axios.post(ENDPOINTS.AUTH.LOGOUT, { refreshToken });
			}
		} catch (error) {
			console.log("Logout API failed:", error);
		}

		sessionStorage.clear();
		dispatch(removeUser());
		dispatch(clearSecondUser());
		navigate("/login");
	};

	return (
		<div className="Navbar">
			<span className="navLogo">Logo</span>

			<div className="user">
				<div className="section-user-div">
					<Link to="/update-profile" className="profile-link">
						<Avatar src={profileImage} alt={usernameSession || usernameRedux} size={32} />
					</Link>

					<Link to="/update-profile" className="profile-link">
						<span>{usernameSession || usernameRedux}</span>
					</Link>
				</div>
				<button onClick={handleLogout}>
					Logout
				</button>
			</div>
		</div>
	);
}

export default React.memo(Navbar);
