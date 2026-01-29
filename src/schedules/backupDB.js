const {spawn} = require('node:child_process');
const fs = require('fs');
require('dotenv').config();
const path = require('path');
const driveService = require('../services/drive.service')
const emailService = require('../services/email.service')

const executeMysqldump = (filePath) => {
    return new Promise((resolve, reject) => {
        const args = [
            '-u', process.env.DB_USER,
            '-h', process.env.DB_HOST,
            '-P', process.env.DB_PORT,
            '--no-tablespaces',
            process.env.DB_NAME
        ];

        // mysqldump cmd: mysqldump -u user -p[password] -P [port] -h [host] [database] > db_backup_[current_date_time].sql
        const mysqldump = spawn('mysqldump', args, {
            env: {
                ...process.env,
                MYSQL_PWD: process.env.DB_PASSWORD
            }
        });

        const writeFileStream = fs.createWriteStream(filePath)
        mysqldump.stdout.pipe(writeFileStream);

        mysqldump.stderr.on('data', (data) => {
            console.error(`Mysqldump error: ${data}`);
        });

        mysqldump.on('close', (code) => {
            if(code !== 0) {
                console.error(`Backup failed with code ${code}`);
                reject(new Error('Backup failed'));
                if(fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                    console.log('Deleted incomplete backup file.')
                    return
                }
                writeFileStream.end()
            }
        });

        writeFileStream.on('finish', () => {
            console.log('Backup file written successfully.');
            resolve(filePath);
        })

        writeFileStream.on('error', (err) => {
            console.error('Error writing backup file:', err);
            reject(err);
        });
    })
}

async function backupDB() {
    let filePath = '';
    const backupDir = path.join(process.cwd(), 'backups');
    const fileName = `simple_chat_db-${new Date().toISOString().split('T')[0]}.sql`;
    const adminEmail = process.env.GOOGLE_APP_USER

    if(!fs.existsSync(backupDir)) {
        fs.mkdirSync(backupDir, {recursive: true});
    }

    try {
        filePath = path.join(backupDir, fileName);
        await executeMysqldump(filePath);
        const response = await driveService.uploadFile(fileName, filePath, 'application/sql');
        await emailService.sendBackupNotification(adminEmail, {
            status: 'SUCCESS',
            fileName: fileName,
            driveFileId: response.id,
            time: new Date().toLocaleString()
        });
        console.log('Backup Job Finished Successfully')
    } catch (error) {
        await emailService.sendBackupNotification(adminEmail, {
            status: 'FAILED',
            fileName: fileName,
            error: error.message,
            time: new Date().toLocaleString()
        });
        console.error('Backup Job Failed', error);
    }
}

module.exports = backupDB;