require('dotenv').config();
const emailService = require('../services/email.service')
const queueService = require('../services/queue.service')

async function cleanupJobs() {
    const result = await queueService.deleteCompletedJob(1000)
    await emailService.sendDeletedJobNotification("tpfkhoi0411@gmail.com", result)
}

module.exports = cleanupJobs;