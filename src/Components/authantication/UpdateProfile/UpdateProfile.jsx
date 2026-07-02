import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./UpdateProfile.css";

const UpdateProfile = () => {
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [profileImage, setProfileImage] = useState("");
    const [file, setFile] = useState(null);

    const [loading, setLoading] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(true);
    const [formErr, setFormErr] = useState("");

    // Fetch current user details
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const currentUsername = localStorage.getItem("name");

                const res = await axios.get(
                    `/users/search?username=${currentUsername}`
                );

                setUsername(res.data.data.username);
                setEmail(res.data.data.email);
                setProfileImage(res.data.data.profileImage);
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

            const res = await axios.put(
                "/users/update-profile",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                    withCredentials: true,
                }
            );

            localStorage.setItem("name", res.data.data.username);

            alert("Profile updated successfully!");

            navigate("/profile");
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
        return <h2>Loading...</h2>;
    }

    return (
        <div className="Update formcontainer">
            <div className="Update formWrapper">

                <span className="logoup">Logo</span>
                <span className="logoups">Update Profile</span>

                {profileImage && (
                    <img
                        src={profileImage}
                        alt="Profile"
                        style={{
                            width: "120px",
                            height: "120px",
                            borderRadius: "50%",
                            objectFit: "cover",
                            marginBottom: "15px",
                        }}
                    />
                )}

                <form onSubmit={handleSubmit}>

                    <input
                        type="text"
                        name="username"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />

                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    <input
                        type="password"
                        name="password"
                        placeholder="New Password (optional)"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <input
                        id="file"
                        type="file"
                        accept="image/*"
                        style={{ display: "none" }}
                        onChange={(e) => setFile(e.target.files[0])}
                    />

                    <label htmlFor="file">
                        <span>Change Profile Picture</span>
                    </label>

                    <button type="submit" disabled={loading}>
                        {loading ? "Updating..." : "Update Profile"}
                    </button>

                </form>

                {formErr && (
                    <p
                        style={{
                            color: "red",
                            marginTop: "10px",
                            fontSize: "14px",
                        }}
                    >
                        {formErr}
                    </p>
                )}

            </div>
        </div>
    );
};

export default UpdateProfile;