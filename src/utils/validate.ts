export const validateEmail = (email: string) => {
  const regex = /^[a-zA-Z0-9]+[a-zA-Z0-9\.]+@([a-z]+\.)+[a-z]{2,4}$/;

  if (email == '') return 'Please enter your email';

  if (email.match(regex)) return '';

  return 'Email is invalid';
};

export const validatePassword = (password: string) => {
  if (password == '') return 'Please enter your password';

  if (password.length < 6) return 'Password must be at least 6 characters';

  return '';
};
