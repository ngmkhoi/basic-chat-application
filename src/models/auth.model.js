const pool = require('../config/database')

const findByEmail = async (email) => {
    const [users] = await pool.query("select id, email, password, full_name, verified_at, created_at, updated_at from users where email = ?", [email]);
    return users[0] || null;
}

const checkEmailExists = async (email) => {
    const [users] = await pool.query("select 1 from users where email = ? limit 1", [email]);
    return users.length > 0;
}

const createUser = async (data) => {
    const [result] = await pool.query("insert into users (email, password, full_name) values (?, ?, ?)", [
        data.email,
        data.password,
        data.full_name,
    ])

    const [users] = await pool.query("select id, email, full_name, verified_at, created_at from users where id = ?", [
        result.insertId,
    ])

    return users[0] || null;
}

const findById = async (userId) => {
    const [users] = await pool.query("select id, email, full_name, verified_at, created_at, updated_at from users where id = ?", [userId]);
    return users[0] || null;
}

module.exports = {
    findByEmail,
    checkEmailExists,
    createUser,
    findById
}