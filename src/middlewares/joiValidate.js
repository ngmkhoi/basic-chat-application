const { HTTP_STATUS } = require('../config/constants');

const joiValidate = (schema) => {
    return (req, res, next) => {
        const { error, value } = schema.validate(req.body, { abortEarly: false });

        if (error) {
            const errors = error.details.map(detail => detail.message);
            return res.error(HTTP_STATUS.UNPROCESSABLE_ENTITY, errors[0]);
        }

        req.body = value;
        next();
    }
}

module.exports = { joiValidate };
