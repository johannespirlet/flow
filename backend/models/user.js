import mongoose from 'mongoose';

const UserDetailsSchema = new mongoose.Schema(
	{
		fname: String,
		lname: String,
		email: { type: String, unique: true },
		password: String,
		userType: String,
		color: String,
		phone: String,
		note: String,
	},
	{
		collection: 'UserInfo',
	}
);

mongoose.model('UserInfo', UserDetailsSchema);
