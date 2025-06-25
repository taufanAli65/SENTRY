import { generatePassword, comparePassword } from '../api/utils/password';

describe('Password Utilities', () => {
  it('should generate a password and its hash', async () => {
    const { password, hashedPassword } = await generatePassword();
    expect(password).toBeDefined();
    expect(hashedPassword).toBeDefined();
    expect(password).not.toEqual(hashedPassword);
  }, 30000);

  it('should compare password and hash correctly', async () => {
    const { password, hashedPassword } = await generatePassword();
    const isValid = await comparePassword(password, hashedPassword);
    expect(isValid).toBe(true);
    const isInvalid = await comparePassword('wrongpassword', hashedPassword);
    expect(isInvalid).toBe(false);
  }, 120000);
});
