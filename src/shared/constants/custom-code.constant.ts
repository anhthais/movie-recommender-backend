export type CustomCode = {
  customCode: number;
  message: string;
};

export const customCode = {
  USERNAME_DUPLICATED: {
    customCode: 601,
    message: 'Username is duplicated',
  },
  EMAIL_DUPLICATED: {
    customCode: 602,
    message: 'Email is duplicated',
  },
};
