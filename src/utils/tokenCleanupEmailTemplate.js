const getTokenCleanupEmailTemplate = (data) => {
    const { status, deletedCount, time, error } = data;
    const isSuccess = status === 'SUCCESS';
    
    // Màu sắc: Xanh lá (Success) hoặc Đỏ (Error)
    const headerColor = isSuccess ? '#4CAF50' : '#F44336';
    const title = isSuccess ? 'Token Cleanup Successful' : 'Token Cleanup Failed';

    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Token Cleanup Report</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px;">
            <tr>
                <td align="center">
                    <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                        <!-- Header -->
                        <tr>
                            <td style="background-color: ${headerColor}; padding: 30px; text-align: center;">
                                <h1 style="margin: 0; color: #ffffff; font-size: 24px;">${title}</h1>
                            </td>
                        </tr>
                        
                        <!-- Content -->
                        <tr>
                            <td style="padding: 40px 30px;">
                                <p style="margin: 0 0 20px; color: #333333; font-size: 16px; line-height: 1.5;">
                                    Report time: <strong>${time}</strong>
                                </p>

                                ${isSuccess ? `
                                    <div style="background-color: #e8f5e9; padding: 15px; border-radius: 4px; border-left: 4px solid #4CAF50; margin-bottom: 20px;">
                                        <p style="margin: 0; color: #2e7d32; font-weight: bold;">✅ Token cleanup completed successfully.</p>
                                    </div>
                                    <div style="text-align: center; margin: 30px 0;">
                                        <p style="margin: 0; color: #666666; font-size: 14px;">Total Expired/Revoked Tokens Deleted</p>
                                        <p style="margin: 10px 0 0; color: #4CAF50; font-size: 48px; font-weight: bold;">${deletedCount}</p>
                                    </div>
                                ` : `
                                    <div style="background-color: #ffebee; padding: 15px; border-radius: 4px; border-left: 4px solid #F44336; margin-bottom: 20px;">
                                        <p style="margin: 0; color: #c62828; font-weight: bold;">❌ An error occurred during the cleanup process.</p>
                                    </div>
                                    <p style="margin: 5px 0;"><strong>Error Details:</strong></p>
                                    <pre style="background-color: #f5f5f5; padding: 10px; border-radius: 4px; overflow-x: auto; color: #d32f2f; white-space: pre-wrap;">${error}</pre>
                                `}
                            </td>
                        </tr>

                        <!-- Footer -->
                        <tr>
                            <td style="padding: 20px 30px; background-color: #f9f9f9; text-align: center; border-top: 1px solid #eeeeee;">
                                <p style="margin: 0; color: #666666; font-size: 12px;">
                                    This is an automated system report. No action is required.
                                </p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>
    `;
};

module.exports = getTokenCleanupEmailTemplate;
