export const validateName = (name) => {
	if (name.trim().length < 2) {
		return 'Input cannot be empty';
	}
	return '';
};

export const validateEmail = (email) => {
	if (!email.includes('@')) {
		return 'Invalid E-Mail Address';
	} else if (email.trim() === '') {
		return 'E-Mail Address cannot be empty';
	}
	return '';
};

export const validatePassword = (password) => {
	if (password.trim() === '') {
		return 'Password cannot be empty';
	} else if (password.length < 3) {
		return 'Password has to be at least 3 characters long';
	}
	return '';
};

export const validateConfirmPassword = (confirmPassword, password) => {
	if (confirmPassword !== password) {
		return 'Passwords do not match';
	}
	return '';
};
