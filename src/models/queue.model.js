const pool = require('../config/database');

class Queue {
   async findAllPending() {
       const [rows] = await pool.query(
           `select * from jobs where status = "pending" order by created_at asc`
       );
       return rows;
   }
   async findOnePending(){
       const [row] = await pool.query(
           `select * from jobs where status = "pending" order by created_at asc limit 1`
       );
       return row[0]
   }
   async create(type, payload) {
       const [result] = await pool.query(
           `insert into jobs (type, payload) values (?, ?)`, [type, JSON.stringify(payload)]
       );
       return result.insertId;
   }
    async findById(id) {
        const [rows] = await pool.query(
            `SELECT * FROM jobs WHERE id = ?`,
            [id]
        );
        return rows[0] || null;
    }
    async findByStatus(status) {
        const [rows] = await pool.query(
            `SELECT * FROM jobs 
         WHERE status = ? 
         ORDER BY created_at DESC`,
            [status]
        );
        return rows;
    }
    async deleteCompletedJob(limit = 1000) {
        const [deletedJob] = await pool.query(
            `delete from jobs where status = 'completed' limit ?`, [limit]
        );
        return deletedJob.affectedRows;
    }
    async markProcessing(id) {
        await pool.query(
            `UPDATE jobs 
         SET status = 'processing', started_at = NOW() 
         WHERE id = ?`,
            [id]
        );
    }
    async markCompleted(id) {
        await pool.query(
            `UPDATE jobs 
         SET status = 'completed', completed_at = NOW() 
         WHERE id = ?`,
            [id]
        );
    }
    async markFailed(id) {
        await pool.query(
            `UPDATE jobs 
         SET status = 'failed', completed_at = NOW() 
         WHERE id = ?`,
            [id]
        );
    }
}

module.exports = new Queue();
