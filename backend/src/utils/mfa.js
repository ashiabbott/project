import speakeasy from 'speakeasy';

/**
 * Generate TOTP secret for MFA
 * @param {String} email - User's email address
 * @returns {Object} - Secret and otpauth URL
 */
export const generateTotpSecret = (email) => {
  const secret = speakeasy.generateSecret({
    name: `YourAppName (${email})`,
  });

  return {
    secret: secret.base32,
    otpauthUrl: secret.otpauth_url,
  };
};

/**
 * Verify TOTP token for MFA
 * @param {String} secret - User's MFA secret
 * @param {String} token - Token provided by user
 * @returns {Boolean} - Validity of the token
 */
export const verifyTotpToken = (secret, token) => {
  return speakeasy.totp.verify({
    secret,
    encoding: 'base32',
    token,
    window: 1, // Allows for a one-step window to account for time drift
  });
};
