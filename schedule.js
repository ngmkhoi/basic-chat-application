require("dotenv").config();
require("./src/config/database")

const { CronJob } = require("cron")
const {TIMEZONE} = require("./src/config/constants")
const dailyReport = require("./src/schedules/dailyReport")
const backupDB = require("./src/schedules/backupDB")
const cleanupExpiredTokens = require("./src/schedules/cleanupExpiredTokens.js")
const cleanupCompletedJobs = require("./src/schedules/cleanupCompletedJobs.js")

new CronJob(
    '0 2 * * *',
    dailyReport,
    null,
    true,
    TIMEZONE.Ho_Chi_Minh
)

new CronJob(
    '0 3 * * *',
    backupDB,
    null,
    true,
    TIMEZONE.Ho_Chi_Minh
)

new CronJob(
    '0 1 * * *',
    cleanupExpiredTokens,
    null,
    true,
    TIMEZONE.Ho_Chi_Minh
)

new CronJob(
    '0 0 * * *',
    cleanupCompletedJobs,
    null,
    true,
)


