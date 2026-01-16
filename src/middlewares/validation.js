const { HTTP_STATUS } = require('../config/constants');

const validate = (schema) => {
    return (req, res, next) => {
        const data = req.body;

        // Kiểm tra các field trong schema
        for (let field in schema) {
            const rules = schema[field];
            const value = data[field];

            if(rules.required && (!value || typeof value === "string" && value.trim() === '')) {
                return res.error(HTTP_STATUS.UNPROCESSABLE_ENTITY, `${field} is required`);
            }

            if(value && rules.type && typeof value !== rules.type().constructor.name.toLowerCase()) {
                return res.error(HTTP_STATUS.UNPROCESSABLE_ENTITY, `${field} must be a ${rules.type().constructor.name.toLowerCase()}`);
            }

            if(value && rules.minLength && value.length && value.length < rules.minLength) {
                return res.error(HTTP_STATUS.UNPROCESSABLE_ENTITY, `${field} must be at least ${rules.minLength} characters`);
            }
        }

        // Kiểm tra field dư thừa (không có trong schema)
        for (let field in data) {
            if (!schema[field]) {
                return res.error(HTTP_STATUS.UNPROCESSABLE_ENTITY, `Field '${field}' is not allowed`);
            }
        }

        return next();
    }
}

module.exports = { validate };