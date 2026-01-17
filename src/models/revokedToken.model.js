const pool = require('../config/database');

const revokedTokenModel = {
    createRefreshToken: async (userId, token, expiresAt) => {
        const [rows] = await pool.query(
            `insert into refresh_tokens (user_id, token, expired_at) values (?, ?, ?)`, [userId, token, expiresAt]
        );
        return rows.insertId;
    },
    findByToken: async (token) => {
        const [result] = await pool.query(
            `select * from refresh_tokens where token = ? AND revoked = false AND expired_at > NOW()`, [token]
        );
        return result[0] || null;
    },
    revokeToken: async (token) => {
        const [result] = await pool.query(
            `update refresh_tokens set revoked = true WHERE token = ?`, [token]
        );
        return result.affectedRows > 0;
    },
    revokeAllUserTokens: async (userId) => {
        const [result] = await pool.query(
            `update refresh_tokens set revoked = true WHERE user_id = ?`, [userId]
        );
        return result.affectedRows;
    },
    deleteExpiredToken: async () => {
        const [result] = await pool.query(
            `delete from refresh_tokens where expired_at < NOW() or revoked = true`
        );
        return result.affectedRows;
    }
}

module.exports = revokedTokenModel;