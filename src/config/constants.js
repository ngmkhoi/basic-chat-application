/**
 * Application Constants
 * Centralized configuration for all hardcoded values
 */

// ========== SERVER ==========
const SERVER = {
    DEFAULT_PORT: 8080,
    DEFAULT_HOST: '0.0.0.0',
};

// ========== CORS ==========
const CORS = {
    ALLOWED_ORIGINS: ['http://localhost:5173', 'http://localhost:5174'],
    ALLOWED_METHODS: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
};

// ========== DATABASE ==========
const DATABASE = {
    CONNECTION_LIMIT: 10,
    TIMEZONE: 'Z',
    WAIT_FOR_CONNECTIONS: true,
};

// ========== JWT / AUTH ==========
const AUTH = {
    ACCESS_TOKEN_EXPIRY: '1h',
    REFRESH_TOKEN_EXPIRY: '7d',
    VERIFY_TOKEN_EXPIRY: '2h',
    REFRESH_TOKEN_EXPIRY_MS: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
    VERIFY_TOKEN_EXPIRY_MS: 2 * 60 * 60 * 1000, // 2 hours in milliseconds
};

// ========== COOKIE ==========
const COOKIE = {
    REFRESH_TOKEN_NAME: 'refreshToken',
    HTTP_ONLY: true,
    SECURE: false, // Set to true in production with HTTPS
    PATH: '/',
    SAME_SITE: 'strict',
};

// ========== VALIDATION ==========
const VALIDATION = {
    PASSWORD_MIN_LENGTH: 8,
};

// ========== PAGINATION ==========
const PAGINATION = {
    DEFAULT_LIMIT: 10,
    MAX_LIMIT: 100,
    DEFAULT_PAGE: 1,
};

// ========== SEARCH ==========
const SEARCH = {
    USER_SEARCH_LIMIT: 20,
};

// ========== HTTP STATUS CODES ==========
const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    UNPROCESSABLE_ENTITY: 422,
    INTERNAL_SERVER_ERROR: 500,
};

// ========== ERROR MESSAGES ==========
const ERROR_MESSAGES = {
    TOKEN_NOT_FOUND: 'Token not found, please log in.',
    ACCESS_TOKEN_EXPIRED: 'Access token expired',
    INVALID_ACCESS_TOKEN: 'Invalid access token',
    INVALID_REFRESH_TOKEN: 'Invalid refresh token',
    REFRESH_TOKEN_EXPIRED: 'Refresh token expired',
    INVALID_VERIFY_TOKEN: 'Invalid verify token',
    VERIFY_TOKEN_EXPIRED: 'Verification token has expired',
    INVALID_CREDENTIALS: 'Invalid email or password',
    USER_ALREADY_EXISTS: 'User already exists',
    USER_NOT_FOUND: 'User not found',
    INTERNAL_ERROR: 'Internal server error',
    FAILED_LOGOUT: 'Failed to logout',
    LOGOUT_SUCCESS: 'Logged out successfully',
    CONVERSATION_NOT_FOUND: 'Conversation not found.',
    NOT_PARTICIPANT: 'You are not a participant of this conversation.',
    USER_ID_REQUIRED: 'user_id is required.',
    CONTENT_REQUIRED: 'Message content is required.',
    DIRECT_CHAT_TWO_MEMBERS: 'Direct chat only have two members.',
    CANNOT_ADD_TO_DIRECT: 'Can not add more participants in to direct chat.',
    USER_ALREADY_IN_CONVERSATION: 'This user has already existed in the conversation.',
    PARTICIPANT_ADDED: 'Added participant successfully.',
    CONVERSATION_EXISTS: 'This conversation has already existed.',
};

// ========== RESPONSE MESSAGES ==========
const RESPONSE_MESSAGES = {
    SUCCESS: 'success',
    ERROR: 'error',
    VERIFIED: 'Email verified successfully'
};

module.exports = {
    SERVER,
    CORS,
    DATABASE,
    AUTH,
    COOKIE,
    VALIDATION,
    PAGINATION,
    SEARCH,
    HTTP_STATUS,
    ERROR_MESSAGES,
    RESPONSE_MESSAGES,
};
