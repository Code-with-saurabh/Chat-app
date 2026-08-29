const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const API_URL = `${API_BASE_URL}/api`;
export const SOCKET_URL = API_BASE_URL;

export const ENDPOINTS = {
  USERS: {
    REGISTER: "/users/register",
    LOGIN: "/users/login",
    SEARCH: "/users/search",
    ALL: "/users/allUsers",
    CONVERSATION: "/users/conversation",
    UPDATE_PROFILE: "/users/update-profile",
  },
  MESSAGES: {
    CONVERSATION: "/messages/conversation",
    BY_CONVERSATION: (id) => `/messages/conversation/${id}`,
    LEGACY: (user1, user2) => `/messages/${user1}/${user2}`,
  },
  AUTH: {
    REFRESH_TOKEN: "/refresh-token",
    LOGOUT: "/logout",
  },
};
