import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    activeConversation: null,
    messages: [],
    loadingMessages: false
};

const chatSlice = createSlice({
    name: "chat",
    initialState,
    reducers: {
        setActiveConversation: (state, action) => {
            state.activeConversation = action.payload;
        },
        setMessages: (state, action) => {
            state.messages = action.payload;
        },
        addMessage: (state, action) => {
            state.messages.push(action.payload);
        },
        deleteMessage: (state, action) => {
            const { messageId } = action.payload;
            const msg = state.messages.find(m => m._id === messageId);
            if (msg) {
                msg.isDeleted = true;
                msg.text = "This message was deleted";
            }
        },
        editMessage: (state, action) => {
            const { messageId, text } = action.payload;
            const msg = state.messages.find(m => m._id === messageId);
            if (msg) {
                msg.text = text;
                msg.isEdited = true;
            }
        },
        clearChat: (state) => {
            state.activeConversation = null;
            state.messages = [];
        },
        setLoadingMessages: (state, action) => {
            state.loadingMessages = action.payload;
        },
        updateActiveUserStatus: (state, action) => {
            if (state.activeConversation) {
                const { userId, isOnline, lastSeen } = action.payload;
                const memberIds = (state.activeConversation.members || []).map(
                    m => typeof m === "string" ? m : m._id?.toString() || m.toString()
                );
                if (memberIds.includes(userId)) {
                    state.activeConversation = {
                        ...state.activeConversation,
                        online: isOnline,
                        lastSeen: lastSeen || state.activeConversation.lastSeen
                    };
                }
            }
        }
    }
});

export const {
    setActiveConversation,
    setMessages,
    addMessage,
    deleteMessage,
    editMessage,
    clearChat,
    setLoadingMessages,
    updateActiveUserStatus
} = chatSlice.actions;

export default chatSlice.reducer;
