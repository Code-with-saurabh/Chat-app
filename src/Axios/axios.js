import axios from "axios";

const instance = axios.create({
    // baseURL: "https://chat-app-backend-1.onrender.com",
    baseURL: "http://localhost:5000/api",
    withCredentials: true,
});

export default instance;