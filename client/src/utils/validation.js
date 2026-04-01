export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateLoginForm = ({ email, password }) => {
  const errors = {};

  if (!email.trim()) errors.email = "Email is required.";
  else if (!EMAIL_REGEX.test(email)) errors.email = "Please enter a valid email.";
  if (!password) errors.password = "Password is required.";

  return errors;
};

export const validateRegisterForm = ({ name, email, password, confirmPassword }) => {
  const errors = {};

  if (!name.trim()) errors.name = "Name is required.";
  if (!email.trim()) errors.email = "Email is required.";
  else if (!EMAIL_REGEX.test(email)) errors.email = "Please enter a valid email.";
  if (!password) errors.password = "Password is required.";
  else if (password.length < 6) errors.password = "Password must be at least 6 characters.";
  if (!confirmPassword) errors.confirmPassword = "Please confirm your password.";
  else if (password !== confirmPassword) errors.confirmPassword = "Passwords do not match.";

  return errors;
};
