import * as bcrypt from 'bcrypt';

export const hashText = (text: string, saltRounds: number): string => {
  const salt = bcrypt.genSaltSync(saltRounds);
  return bcrypt.hashSync(text, salt);
};
