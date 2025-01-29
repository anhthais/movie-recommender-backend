export const beautifyEmail = (email: string): string => {
  const cleanedEmail = email.replace(/[\s]/g, '');

  return cleanedEmail.toLowerCase().trim();
};

const StringHelper = {
  beautifyEmail,
}

export default StringHelper;