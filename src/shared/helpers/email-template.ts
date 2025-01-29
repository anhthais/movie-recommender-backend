export const getActivationAccountEmailTemplate = (props: {
  username: string;
  activateLink: string;
}) => {
  return `
    <body style="background-color: #f9fafb; padding: 2rem;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #1a202c; color: white; border-radius: 8px; padding: 2rem; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
        <h1 style="text-align: center; font-size: 1.5rem; font-weight: bold;">TMDB2</h1>
        <p>Hello ${props.username},</p>
        <p>Thank you for registering an account at TMDB.</p>
        <p>To activate your account, please click the button below:</p>
        <a href="${props.activateLink}" style="display: inline-block; margin-top: 1rem; padding: 0.75rem 1.5rem; background-color: #dc2626; color: white; border-radius: 8px; text-decoration: none; font-weight: bold;">Activate Account</a>
        <p style="margin-top: 2rem; font-size: 0.9rem;">This email will expire in 10 minutes.</p>
        <p style="margin-top: 1rem;">
          <a href="${process.env.HOMEPAGE_URL}" style="color: #ef4444; text-decoration: none;">Explore thousands of movies and TV series on TMDB2</a>
        </p>
      </div>
    </body>`;
};

export const getResetPasswordTemplate = (props: {
  username: string;
  resetLink: string;
}) => {
  return `
  <body style="background-color: #f9fafb; padding: 2rem;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #1a202c; color: white; border-radius: 8px; padding: 2rem; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
      <h1 style="text-align: center; font-size: 1.5rem; font-weight: bold;">TMDB2</h1>
      <p>Hello ${props.username},</p>
      <p>You have required to reset your account password.</p>
      <p>To reset the password, please click the button below:</p>
      <a href="${props.resetLink}" style="display: inline-block; margin-top: 1rem; padding: 0.75rem 1.5rem; background-color: #dc2626; color: white; border-radius: 8px; text-decoration: none; font-weight: bold;">Reset password</a>
      <p style="margin-top: 2rem; font-size: 0.9rem;">This email will expire in 10 minutes.</p>
      <p style="margin-top: 1rem;">
        <a href="${process.env.HOMEPAGE_URL}" style="color: #ef4444; text-decoration: none;">Explore thousands of movies and TV series on TMDB2</a>
      </p>
    </div>
  </body>`;
};
