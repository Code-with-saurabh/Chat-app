import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    activeConversation: null,
    messages: [],
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

        clearChat: (state) => {
            state.activeConversation = null;
            state.messages = [];
        }
    }
});

export const {
    setActiveConversation,
    setMessages,
    addMessage,
    clearChat
} = chatSlice.actions;

export default chatSlice.reducer;
