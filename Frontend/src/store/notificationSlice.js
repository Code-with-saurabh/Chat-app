import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  notifications: [],
  unreadCount: 0,
  conversationUnread: {} // 🔥 NEW (conversation wise)
};

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    addNotification: (state, action) => {
      const notification = action.payload;

      state.notifications.unshift(notification);
      state.unreadCount += 1;

      const convId = notification.conversationId;

      state.conversationUnread[convId] =
        (state.conversationUnread[convId] || 0) + 1;
    },

    markConversationRead: (state, action) => {
      const convId = action.payload;

      const unreadForThisConv =
        state.conversationUnread[convId] || 0;

      state.unreadCount -= unreadForThisConv;
      state.conversationUnread[convId] = 0;
    },

    clearNotifications: (state) => {
      state.notifications = [];
      state.unreadCount = 0;
      state.conversationUnread = {};
    }
  }
});

export const {
  addNotification,
  markConversationRead,
  clearNotifications
} = notificationSlice.actions;

export default notificationSlice.reducer;