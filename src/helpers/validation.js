export const validateName = (name) => {
	if (name.trim() === '') {
		return 'This field cannot be empty';
	}
	return '';
};

export const validateEmail = (email) => {
	if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email)) {
		return 'Enter a valid E-Mail';
	} else if (email.trim() === '') {
		return 'E-Mail Address cannot be empty';
	}
	return '';
};

export const validatePassword = (password) => {
	if (password.trim() === '') {
		return 'Password cannot be empty';
	} else if (password.length < 3) {
		return 'Use at least 3 characters';
	}
	return '';
};

export const validateConfirmPassword = (confirmPassword, password) => {
	if (confirmPassword !== password) {
		return 'Passwords do not match';
	}
	return '';
};

export const validateArray = (array) => {
	if (array.length === 0) {
		return 'Assign at least one person to this task';
	}
	return '';
};

export const validateDate = (date) => {
	if (date.trim() === '') {
		return 'Please pick a date';
	} else if (new Date(date) < new Date()) {
		return 'Pick a date in the future';
	}
	return '';
};

export const validatePrio = (prio) => {
	if (prio.trim() === '') {
		return 'Please select a priority';
	}
	return '';
}