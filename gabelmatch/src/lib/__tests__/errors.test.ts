import { AppError, errorKey } from '../errors';

describe('Fehlerübersetzung', () => {
  it.each([
    [{ message: 'invalid_code' }, 'errors.invalidCode'],
    [{ message: 'group_full', code: 'P0001' }, 'errors.groupFull'],
    [{ message: 'Invalid login credentials' }, 'errors.invalidCredentials'],
    [{ code: 'email_not_confirmed', message: 'x' }, 'errors.emailNotConfirmed'],
    [{ message: 'User already registered' }, 'errors.userExists'],
    [new TypeError('Network request failed'), 'errors.network'],
    [{ message: 'new row violates row-level security policy for table "swipes"' }, 'errors.sessionEnded'],
    [new AppError('errors.oauthCancelled'), 'errors.oauthCancelled'],
    ['irgendwas', 'errors.generic'],
    [null, 'errors.generic'],
  ])('%p → %s', (error, key) => {
    expect(errorKey(error)).toBe(key);
  });
});
