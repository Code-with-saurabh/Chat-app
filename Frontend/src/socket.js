import { io } from "socket.io-client";
const API = import.meta.env.VITE_API_URL;
export const socket = io(API || "http://localhost:5000", {
    autoConnect: false
});
