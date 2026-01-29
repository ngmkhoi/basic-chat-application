const fs = require('fs');
const drive = require('../config/googleDrive');

const uploadFile = async (fileName, filePath, mimeType) => {
    try {
        const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;
        if(!folderId) {
            throw new Error('Missing GOOGLE_DRIVE_FOLDER_ID in .env');
        }

        const response = await drive.files.create({
            requestBody: {
                name: fileName,
                parents: [folderId]
            },
            media: {
                mimeType: mimeType,
                body: fs.createReadStream(filePath),
            },
            fields: 'id, name',
            supportsAllDrives: true
        });

        return response.data;
    } catch (error) {
        if (error.response && error.response.data) {
            console.error('Google Drive Error Detail:', JSON.stringify(error.response.data, null, 2));
        } else {
            console.error('Google Drive Upload Error:', error.message);
        }
        throw error;
    }
}

module.exports = {
    uploadFile
}


