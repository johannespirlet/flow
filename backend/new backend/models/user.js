import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
	{
		fname: {
			type: String,
			required: true,
		},
		lname: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			required: true,
		},
		userType: {
			type: String,
			enum: ['User', 'Admin'],
			default: 'User',
		},
		color: {
			type: String,
		},
		phone: {
			type: String,
		},
		note: {
			type: String,
		},
	},
	{
		timestamps: true,
	}
);

// Hash the password before saving it to the database
userSchema.pre('save', async function (next) {
	const user = this;
	if (!user.isModified('password')) return next();

	try {
		const salt = await bcrypt.genSalt();
		user.password = await bcrypt.hash(user.password, salt);
		next();
	} catch (error) {
		return next(error);
	}
});

// Compare the given password with the hashed password in the database
userSchema.methods.comparePassword = async function (password) {
	return bcrypt.compare(password, this.password);
};

export const User = mongoose.model('User', userSchema);
