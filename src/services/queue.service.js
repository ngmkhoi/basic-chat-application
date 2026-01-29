const queueModel = require('../models/queue.model');
const refreshTokenModel = require("../models/revokedToken.model");

class QueueService {
    async addJob(type, payload) {
        try {
            console.log(type)
            console.log(payload)
            const jobId = await queueModel.create(type, payload)
            console.log(`Job added with ID: ${jobId}`)
            return jobId
        } catch (error) {
            console.error('Error adding job:', error)
            throw error;
        }
    }

    async getNextjob() {
       return await queueModel.findOnePending();
    }

    async markProcessing(jobId) {
        await queueModel.markProcessing(jobId);
        console.log(`🔄 Job ${jobId} is now processing...`);
    }

    async markCompleted(jobId) {
        await queueModel.markCompleted(jobId);
        console.log(`✅ Job ${jobId} completed successfully`);
    }

    async markFailed(jobId, error) {
        await queueModel.markFailed(jobId);
        console.error(`❌ Job ${jobId} failed:`, error.message);
    }

    async deleteCompletedJob(limit) {
        try {
            const deletedCount = await queueModel.deleteCompletedJob(limit);
            console.log(`There are ${deletedCount} jobs deleted at ${new Date()}`)
            return {
                status: 'SUCCESS',
                deletedCount: deletedCount,
                time: new Date().toLocaleString('vi-VN'),
                error: null
            };
        } catch (error) {
            console.error('Error while deleting jobs:', error)
            return {
                status: 'ERROR',
                deletedCount: 0,
                time: new Date().toLocaleString('vi-VN'),
                error: error.message
            }
        }
    }

    async processJob(job, tasks) {
        const taskHandler = tasks[job.type]
        if (!taskHandler) {
            throw new Error(`No task handler found for job type: ${job.type}`);
        }
        const payload = typeof job.payload === 'string'
            ? JSON.parse(job.payload)
            : job.payload;

        await taskHandler(payload)
    }
}

module.exports = new QueueService();