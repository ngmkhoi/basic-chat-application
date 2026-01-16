const pool = require('../config/database');
const conversationModel = require('../models/conversations.model');
const messagesModel = require('../models/messages.model');
const { ERROR_MESSAGES } = require('../config/constants');

const conversationService = {
    createConversation: async ({ name, type, participantIds, creatorId }) => {
        let connection;
        try {
            connection = await pool.getConnection();

            const membersSet = new Set([...participantIds, creatorId]);
            const finalMemberIds = Array.from(membersSet);

            if (type === 'direct') {
                if(finalMemberIds.length !== 2){
                    throw new Error(ERROR_MESSAGES.DIRECT_CHAT_TWO_MEMBERS);
                }

                const partnerId = finalMemberIds.find(id => id !== creatorId) || creatorId;

                const existingConvId = await conversationModel.findExistingDirectConversation(
                    connection,
                    creatorId,
                    partnerId
                );

                if (existingConvId) {
                    connection.release();
                    return {
                        conversationId: existingConvId,
                        isExisting: true,
                        message: ERROR_MESSAGES.CONVERSATION_EXISTS
                    };
                }
            }

            await connection.beginTransaction();

            const newConversationId = await conversationModel.create(connection, {
                name,
                type,
                creatorId
            });

            const participantValues = finalMemberIds.map(userId => [newConversationId, userId]);

            await conversationModel.addParticipants(connection, participantValues);

            await connection.commit();

            return {
                conversationId: newConversationId,
                type,
                members: finalMemberIds
            };

        } catch (error) {
            if (connection) await connection.rollback();
            throw error;
        } finally {
            if (connection) connection.release();
        }
    },
    getConversation: async (userId) => {
        const conversations = await conversationModel.getAllConversations(userId);
        return conversations || null;
    },
    addParticipantToGroup: async ({ conversationId, userIdToAdd, requesterId }) => {
        const connection = await pool.getConnection();
        try {
            const conversation = await conversationModel.findById(connection, conversationId);
            if (!conversation) {
                throw new Error(ERROR_MESSAGES.CONVERSATION_NOT_FOUND);
            }

            if (conversation.type !== 'group') {
                throw new Error(ERROR_MESSAGES.CANNOT_ADD_TO_DIRECT);
            }

            const isAlreadyInGroup = await conversationModel.checkExistingParticipant(
                connection,
                conversationId,
                userIdToAdd
            );

            if (isAlreadyInGroup) {
                throw new Error(ERROR_MESSAGES.USER_ALREADY_IN_CONVERSATION);
            }

            await conversationModel.addParticipant(connection, conversationId, userIdToAdd);

            return { message: ERROR_MESSAGES.PARTICIPANT_ADDED };

        } finally {
            connection.release();
        }
    },
    sendMessage: async ({ conversationId, senderId, content }) => {
        const connection = await pool.getConnection();
        try {
            // Check if conversation exists
            const conversation = await conversationModel.findById(connection, conversationId);
            if (!conversation) {
                throw new Error(ERROR_MESSAGES.CONVERSATION_NOT_FOUND);
            }

            // Check if sender is a participant of the conversation
            const isParticipant = await conversationModel.checkExistingParticipant(
                connection,
                conversationId,
                senderId
            );

            if (!isParticipant) {
                throw new Error(ERROR_MESSAGES.NOT_PARTICIPANT);
            }

            // Create the message
            const messageId = await messagesModel.create(connection, {
                conversationId,
                senderId,
                content
            });

            // Get the created message
            const message = await messagesModel.findById(connection, messageId);

            return {
                id: message.id,
                conversation_id: message.conversation_id,
                sender_id: message.sender_id,
                content: message.content,
                created_at: message.created_at
            };

        } finally {
            connection.release();
        }
    },

    getMessages: async ({ conversationId, userId }) => {
        const connection = await pool.getConnection();
        try {
            // Check if conversation exists
            const conversation = await conversationModel.findById(connection, conversationId);
            if (!conversation) {
                throw new Error(ERROR_MESSAGES.CONVERSATION_NOT_FOUND);
            }

            // Check if user is a participant of the conversation
            const isParticipant = await conversationModel.checkExistingParticipant(
                connection,
                conversationId,
                userId
            );

            if (!isParticipant) {
                throw new Error(ERROR_MESSAGES.NOT_PARTICIPANT);
            }

            // Get all messages with sender info
            return await messagesModel.getAllByConversationId(conversationId);

        } finally {
            connection.release();
        }
    }
};

module.exports = conversationService;