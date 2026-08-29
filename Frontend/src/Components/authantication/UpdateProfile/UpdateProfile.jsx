import React, { useEffect, useState } from "react";
import axios from "../../../Utilities/axios.js";
import { useNavigate } from "react-router-dom";
import "./UpdateProfile.css";
import { addUser } from "../../../store/userSlice.js";
import { useDispatch } from "react-redux";
import { ENDPOINTS } from "../../../constants/api.js";
import Avatar from "../../common/Avatar.jsx";

const UpdateProfile = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [profileImage, setProfileImage] = useState("");
    const [file, setFile] = useState(null);

    const [loading, setLoading] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(true);
    const [formErr, setFormErr] = useState("");

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const currentUsername = localStorage.getItem("name");

                const res = await axios.get(`${ENDPOINTS.USERS.SEARCH}?username=${currentUsername}`);
                if (!res.data?.data) {
                    throw new Error("Unexpected response shape");
                }

                setUsername(res?.data?.data?.username);
                setEmail(res?.data?.data?.email);
                setProfileImage(res?.data?.data?.profileImage);
            } catch (error) {
                console.error(error);
                setFormErr("Failed to load profile.");
            } finally {
                setFetchLoading(false);
            }
        };

        fetchUser();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);
        setFormErr("");

        try {
            const formData = new FormData();

            formData.append("username", username);
            formData.append("email", email);

            if (password) {
                formData.append("password", password);
            }

            if (file) {
                formData.append("file", file);
            }

            const res = await axios.post(
                ENDPOINTS.USERS.UPDATE_PROFILE,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            localStorage.setItem("name", res.data.data.username);

            const updatedUser = res.data.data;

            sessionStorage.setItem("Username", updatedUser.username);
            sessionStorage.setItem("profileImage", updatedUser.profileImage);

            dispatch(
                addUser({
                    id: updatedUser.userId,
                    username: updatedUser.username,
                    profileImage: updatedUser.profileImage,
                })
            );

            navigate("/");

        } catch (error) {
            console.error(error);

            if (error.response) {
                setFormErr(error.response.data.message);
            } else {
                setFormErr("Something went wrong.");
            }
        } finally {
            setLoading(false);
        }
    };

    if (fetchLoading) {
        return (
            <div className="UP-profile-page">
                <div className="UP-profile-loading">
                    Loading your profile...
                </div>
            </div>
        );
    }

    return (
        <div className="UP-profile-page UP-uvp">
            <div className="UP-profile-card">

                <button
                    type="button"
                    className="UP-back-btn"
                    onClick={() => navigate(-1)}
                    aria-label="Go back"
                >
                    <svg
                        viewBox="0 0 24 24"
                        width="18"
                        height="18"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.2"
                    >
                        <path
                            d="M15 18l-6-6 6-6"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </button>

                <aside className="UP-profile-side">
                    <div className="UP-side-dots" />
                    <div className="UP-side-glow" />

                    <span className="UP-side-eyebrow">
                        Logo
                    </span>

                    <div className="UP-avatar-wrap">
                        <Avatar
                            src={profileImage}
                            alt={username}
                            className="UP-avatar-img"
                            size={100}
                        />

                        <label
                            htmlFor="file"
                            className="UP-avatar-edit"
                            title="Change profile picture"
                        >
                            <svg
                                viewBox="0 0 24 24"
                                width="16"
                                height="16"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                            >
                                <path d="M4 8h3l2-2h6l2 2h3v11H4z" />
                                <circle cx="12" cy="13.5" r="3.2" />
                            </svg>
                        </label>

                        <input
                            id="file"
                            type="file"
                            accept="image/*"
                            style={{ display: "none" }}
                            onChange={(e) => setFile(e.target.files[0])}
                        />
                    </div>

                    <h2 className="UP-side-username">
                        {username || "Your name"}
                    </h2>

                    <p className="UP-side-email">
                        {email || "your@email.com"}
                    </p>

                    {file && (
                        <p className="UP-side-hint">
                            New photo selected -- save to apply
                        </p>
                    )}
                </aside>

                <section className="UP-profile-form-panel">

                    <div className="UP-form-header">
                        <span className="UP-form-eyebrow">
                            Account
                        </span>

                        <h1>Update profile</h1>

                        <p>
                            Your changes apply across your account right away.
                        </p>
                    </div>

                    <div className="UP-form-divider" />

                    <form
                        onSubmit={handleSubmit}
                        className="UP-profile-form"
                    >

                        <div className="UP-field">
                            <label htmlFor="username">
                                Username
                            </label>

                            <input
                                id="username"
                                type="text"
                                name="username"
                                placeholder="Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>

                        <div className="UP-field">
                            <label htmlFor="email">
                                Email
                            </label>

                            <input
                                id="email"
                                type="email"
                                name="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>


                        <div className="UP-field">
                            <label htmlFor="password">
                                New password
                            </label>

                            <input
                                id="password"
                                type="password"
                                name="password"
                                placeholder="Leave blank to keep current password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        {formErr && (
                            <p className="UP-form-error">
                                {formErr}
                            </p>
                        )}

                        <button
                            type="submit"
                            className="UP-submit-btn"
                            disabled={loading}
                        >
                            {loading ? "Saving..." : "Save changes"}
                        </button>

                    </form>
                </section>
            </div>
        </div>
    );
};

export default UpdateProfile;
