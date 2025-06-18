import User, { UserRoles } from '../api/models/users';

describe('User Model', () => {
  it('should have required fields', () => {
    const user = new User({
      email: 'test@example.com',
      name: 'Test User',
      role: UserRoles.Employee,
      photoUrl: 'http://example.com/photo.jpg',
      password: 'hashedpassword'
    });
    expect(user.email).toBe('test@example.com');
    expect(user.name).toBe('Test User');
    expect(user.role).toBe(UserRoles.Employee);
    expect(user.photoUrl).toBe('http://example.com/photo.jpg');
    expect(user.password).toBe('hashedpassword');
  });
});
