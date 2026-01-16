const usersService = require('../services/users.service');
const { HTTP_STATUS } = require('../config/constants');

const usersController = {
    search: async (req, res) => {
        try {
            const { q } = req.query;
            const currentUserId = req.user.id;

            if (!q || q.trim() === '') {
                return res.success([], HTTP_STATUS.OK);
            }

            const users = await usersService.searchByEmail(q, currentUserId);

            res.success(users, HTTP_STATUS.OK);

        } catch (error) {
            res.error(HTTP_STATUS.INTERNAL_SERVER_ERROR, error.message);
        }
    }
};

module.exports = usersController;
