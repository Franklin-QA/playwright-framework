/** Public demo credentials published on saucedemo.com. Not secrets. */
export const USERS = {
  standard: { username: 'standard_user', password: 'secret_sauce' },
  locked: { username: 'locked_out_user', password: 'secret_sauce' },
  invalid: { username: 'not_a_user', password: 'wrong_password' },
} as const;

export const CUSTOMER = { firstName: 'Test', lastName: 'Customer', postalCode: '600001' } as const;
