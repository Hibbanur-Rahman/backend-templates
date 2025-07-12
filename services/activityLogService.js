const SystemActivityLog = require('../models/systemActivityLog');

/**
 * Log system activity
 * @param {string} activityType - Type of activity (e.g., 'LOGIN', 'CREATE_USER', 'UPDATE_PROFILE')
 * @param {string} activityDescription - Description of the activity
 * @param {string} performedByRole - Role of the user performing the action (e.g., 'User', 'Admin', 'Pharmacy')
 * @param {string} performedBy - ObjectId of the user performing the action
 */
const logActivity = async (activityType, activityDescription, performedByRole = null, performedBy = null) => {
    try {
        const newPerformedByRole=performedByRole==="consumer"?'User':performedByRole==="pharmacy"?'Pharmacy':'Admin';
        await SystemActivityLog.create({
            activityType,
            activityDescription,
            performedByRole:newPerformedByRole,
            performedBy
        });
    } catch (error) {
        console.error('Error logging activity:', error);
        // We don't throw the error to prevent disrupting the main application flow
    }
};

// Predefined activity types for consistency
const ActivityTypes = {
    USER: {
        LOGIN: 'USER_LOGIN',
        LOGOUT: 'USER_LOGOUT',
        REGISTER: 'USER_REGISTER',
        UPDATE_PROFILE: 'UPDATE_PROFILE',
        DELETE_ACCOUNT: 'DELETE_ACCOUNT',
        FORGOT_PASSWORD: 'FORGOT_PASSWORD',
        RESET_PASSWORD: 'RESET_PASSWORD',
        CHANGE_PASSWORD: 'CHANGE_PASSWORD',
        VERIFY_EMAIL: 'VERIFY_EMAIL',
        ONBOARD_PHARMACY: 'ONBOARD_PHARMACY',
        ONBOARD_CONSUMER: 'ONBOARD_CONSUMER',
        UPDATE_PHARMACY: 'UPDATE_PHARMACY',
        UPDATE_CONSUMER: 'UPDATE_CONSUMER',
        DELETE_PHARMACY: 'DELETE_PHARMACY',
        DELETE_CONSUMER: 'DELETE_CONSUMER',
        UPLOAD_PRESCRIPTION: 'UPLOAD_PRESCRIPTION',
        CREATE_REFUND: 'CREATE_REFUND',
    },
    PHARMACY: {
        ONBOARD: 'PHARMACY_ONBOARD',
        ADD_MEDICINE: 'ADD_MEDICINE',
        UPDATE_MEDICINE: 'UPDATE_MEDICINE',
        DELETE_MEDICINE: 'DELETE_MEDICINE',
        UPDATE_PROFILE: 'UPDATE_PHARMACY_PROFILE',
        UPDATE_VERIFY: 'UPDATE_VERIFY_PHARMACY',
        UPDATE_BANK_DETAILS: 'UPDATE_BANK_DETAILS',
        UPDATE_CONTACT_DETAILS: 'UPDATE_CONTACT_DETAILS',
        UPDATE_ADDRESS_DETAILS: 'UPDATE_ADDRESS_DETAILS',
        UPDATE_OPERATING_HOURS: 'UPDATE_OPERATING_HOURS',
    },
    SUBSCRIPTION: {
        CREATE: 'CREATE_SUBSCRIPTION',
        UPDATE: 'UPDATE_SUBSCRIPTION',
        CANCEL: 'CANCEL_SUBSCRIPTION',
        VERIFY_PAYMENT: 'VERIFY_PAYMENT',
    },
    BILLING: {
        CREATE: 'CREATE_BILL',
        UPDATE: 'UPDATE_BILL',
        DELETE: 'DELETE_BILL',
        CREATE_PIN: 'CREATE_PIN',
        CHECK_PIN: 'CHECK_PIN',
    },
    TRANSACTION: {
        CREATE: 'CREATE_TRANSACTION',
        UPDATE: 'UPDATE_TRANSACTION',
        REFUND: 'REFUND_TRANSACTION',
    },
    ADMIN: {
        CREATE_PLAN: 'CREATE_SUBSCRIPTION_PLAN',
        UPDATE_PLAN: 'UPDATE_SUBSCRIPTION_PLAN',
        DELETE_PLAN: 'DELETE_SUBSCRIPTION_PLAN',
    },
    CONSUMER: {
        CREATE_BILLING: 'CREATE_BILLING',
        UPDATE_BILLING: 'UPDATE_BILLING',
        DELETE_BILLING: 'DELETE_BILLING',
    },

};

module.exports = {
    logActivity,
    ActivityTypes
}; 