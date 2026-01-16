const conversationService = require('../services/conversation.service');
const { HTTP_STATUS, ERROR_MESSAGES } = require('../config/constants');

const conversationController = {
    create: async (req, res) => {
        try {
            const creatorId = req.user.id;
            const { name, type, participant_ids } = req.body;

            const result = await conversationService.createConversation({
                name,
                type,
                participantIds: participant_ids || [],
                creatorId
            });

            if (result.isExisting) {
                return res.success(result, HTTP_STATUS.OK)
            }

            res.success(
                result,
                HTTP_STATUS.CREATED
            )
        } catch (error) {
            res.error(HTTP_STATUS.BAD_REQUEST, error.message)
        }
    },
    getUserConversation: async (req, res) => {
        try {
            const currentUserId = req.user.id;
            const result = await conversationService.getConversation(currentUserId);
            res.success(
                result,
                HTTP_STATUS.OK
            )
        } catch (error) {
            res.error(HTTP_STATUS.INTERNAL_SERVER_ERROR, error.message)
        }
    },
    addParticipant: async (req, res) => {
        try {
            const { id } = req.params;
            const { user_id } = req.body;
            const requesterId = req.user.id;

            if (!user_id) {
                return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: ERROR_MESSAGES.USER_ID_REQUIRED });
            }

            const result = await conversationService.addParticipantToGroup({
                conversationId: id,
                userIdToAdd: user_id,
                requesterId
            });

            res.status(HTTP_STATUS.OK).json(result);

        } catch (error) {
            res.status(HTTP_STATUS.BAD_REQUEST).json({ message: error.message });
        }
    },
    
    sendMessage: async (req, res) => {
        try {
            const { id } = req.params;
            const { content } = req.body;
            const senderId = req.user.id;

            if (!content || content.trim() === '') {
                return res.error(HTTP_STATUS.BAD_REQUEST, ERROR_MESSAGES.CONTENT_REQUIRED);
            }

            const result = await conversationService.sendMessage({
                conversationId: id,
                senderId,
                content: content.trim()
            });

            res.success(result, HTTP_STATUS.CREATED);

        } catch (error) {
            res.error(HTTP_STATUS.BAD_REQUEST, error.message);
        }
    },

    getMessages: async (req, res) => {
        try {
            const { id } = req.params;
            const userId = req.user.id;

            const messages = await conversationService.getMessages({
                conversationId: id,
                userId
            });

            res.success(messages, HTTP_STATUS.OK);

        } catch (error) {
            res.error(HTTP_STATUS.BAD_REQUEST, error.message);
        }
    }
};

module.exports = conversationController;