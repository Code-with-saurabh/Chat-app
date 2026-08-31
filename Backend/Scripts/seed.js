require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../models/userSchema.models");
const Conversation = require("../models/conversationSchema.models");
const Message = require("../models/messageSchema.models");

const users = [
    { Username: "alice", Email: "alice@example.com", Password: "alice123" },
    { Username: "bob", Email: "bob@example.com", Password: "bob123" },
    { Username: "charlie", Email: "charlie@example.com", Password: "charlie123" },
    { Username: "diana", Email: "diana@example.com", Password: "diana123" },
    { Username: "edward", Email: "edward@example.com", Password: "edward123" },
];

const seed = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB connected for seeding");

        await User.deleteMany({});
        await Conversation.deleteMany({});
        await Message.deleteMany({});
        console.log("Cleared existing data");

        const createdUsers = await User.insertMany(users);
        console.log(`Created ${createdUsers.length} users`);

        const conversations = [
            { members: [createdUsers[0]._id, createdUsers[1]._id] },
            { members: [createdUsers[0]._id, createdUsers[2]._id] },
            { members: [createdUsers[1]._id, createdUsers[3]._id] },
            { members: [createdUsers[2]._id, createdUsers[4]._id] },
            { members: [createdUsers[0]._id, createdUsers[3]._id] },
            { members: [createdUsers[1]._id, createdUsers[2]._id] },
        ];

        const createdConversations = await Conversation.insertMany(conversations);
        console.log(`Created ${createdConversations.length} conversations`);

        const now = Date.now();
        const messages = [
            // Conversation 0: alice <-> bob
            { conversationId: createdConversations[0]._id, sender: createdUsers[0]._id, text: "Hey Bob!", createdAt: new Date(now - 3600000 * 5) },
            { conversationId: createdConversations[0]._id, sender: createdUsers[1]._id, text: "Hi Alice! How are you?", createdAt: new Date(now - 3600000 * 4.5) },
            { conversationId: createdConversations[0]._id, sender: createdUsers[0]._id, text: "I'm good, just working on the chat app.", createdAt: new Date(now - 3600000 * 4) },
            { conversationId: createdConversations[0]._id, sender: createdUsers[1]._id, text: "Nice! Need any help?", createdAt: new Date(now - 3600000 * 3.5) },
            { conversationId: createdConversations[0]._id, sender: createdUsers[0]._id, text: "Yeah, can you review the PR later?", createdAt: new Date(now - 3600000 * 3) },
            { conversationId: createdConversations[0]._id, sender: createdUsers[1]._id, text: "Sure, I'll check it out after lunch.", createdAt: new Date(now - 3600000 * 2.5) },

            // Conversation 1: alice <-> charlie
            { conversationId: createdConversations[1]._id, sender: createdUsers[0]._id, text: "Charlie, did you deploy the latest build?", createdAt: new Date(now - 7200000 * 3) },
            { conversationId: createdConversations[1]._id, sender: createdUsers[2]._id, text: "Yes, it's live on staging.", createdAt: new Date(now - 7200000 * 2.8) },
            { conversationId: createdConversations[1]._id, sender: createdUsers[0]._id, text: "Awesome, I'll test it now.", createdAt: new Date(now - 7200000 * 2.5) },
            { conversationId: createdConversations[1]._id, sender: createdUsers[2]._id, text: "Let me know if anything breaks.", createdAt: new Date(now - 7200000 * 2) },

            // Conversation 2: bob <-> diana
            { conversationId: createdConversations[2]._id, sender: createdUsers[1]._id, text: "Diana, are you coming to the standup?", createdAt: new Date(now - 86400000) },
            { conversationId: createdConversations[2]._id, sender: createdUsers[3]._id, text: "Yes, joining in 5 minutes.", createdAt: new Date(now - 86400000 + 120000) },
            { conversationId: createdConversations[2]._id, sender: createdUsers[1]._id, text: "Cool, we need to discuss the new feature.", createdAt: new Date(now - 86400000 + 240000) },

            // Conversation 3: charlie <-> edward
            { conversationId: createdConversations[3]._id, sender: createdUsers[2]._id, text: "Edward, the API rate limiter is ready.", createdAt: new Date(now - 172800000) },
            { conversationId: createdConversations[3]._id, sender: createdUsers[4]._id, text: "Great, I'll integrate it into the frontend.", createdAt: new Date(now - 172800000 + 600000) },
            { conversationId: createdConversations[3]._id, sender: createdUsers[2]._id, text: "Let me know if the response format works for you.", createdAt: new Date(now - 172800000 + 1200000) },
            { conversationId: createdConversations[3]._id, sender: createdUsers[4]._id, text: "Looks good, thanks!", createdAt: new Date(now - 172800000 + 1800000) },

            // Conversation 4: alice <-> diana
            { conversationId: createdConversations[4]._id, sender: createdUsers[0]._id, text: "Diana, happy birthday! 🎂", createdAt: new Date(now - 259200000) },
            { conversationId: createdConversations[4]._id, sender: createdUsers[3]._id, text: "Thank you so much, Alice! 🥳", createdAt: new Date(now - 259200000 + 300000) },

            // Conversation 5: bob <-> charlie
            { conversationId: createdConversations[5]._id, sender: createdUsers[1]._id, text: "Charlie, can you help with the database migration?", createdAt: new Date(now - 345600000) },
            { conversationId: createdConversations[5]._id, sender: createdUsers[2]._id, text: "Sure, I'll set up a meeting tomorrow.", createdAt: new Date(now - 345600000 + 600000) },
            { conversationId: createdConversations[5]._id, sender: createdUsers[1]._id, text: "Perfect, 10am works for me.", createdAt: new Date(now - 345600000 + 1200000) },
            { conversationId: createdConversations[5]._id, sender: createdUsers[2]._id, text: "See you then!", createdAt: new Date(now - 345600000 + 1800000) },
        ];

        const createdMessages = await Message.insertMany(messages);
        console.log(`Created ${createdMessages.length} messages`);

        // Update lastMessage for each conversation
        for (const conv of createdConversations) {
            const lastMsg = createdMessages
                .filter(m => m.conversationId.toString() === conv._id.toString())
                .sort((a, b) => b.createdAt - a.createdAt)[0];
            if (lastMsg) {
                await Conversation.findByIdAndUpdate(conv._id, { lastMessage: lastMsg._id });
            }
        }
        console.log("Updated lastMessage references");

        console.log("\nSeed completed successfully!");
        console.log("\nUsers created:");
        createdUsers.forEach(u => console.log(`  - ${u.Username} (${u.Email}) / Password: ${u.Password}`));

        process.exit(0);
    } catch (error) {
        console.error("Seeding error:", error);
        process.exit(1);
    }
};

seed();
