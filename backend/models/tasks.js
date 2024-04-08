import mongoose from 'mongoose';

const TaskDetailsSchema = new mongoose.Schema(
	{
		title: String,
		description: String,
		department: String,
		section: String,
		assignedTo: [
			{
				id: { type: String },
				initials: { type: String },
				fname: { type: String },
				lname: { type: String },
				color: { type: String },
			},
		],
		dueDate: String,
		priority: String,
		subTasks: [{ taskName: { type: String }, checked: { type: Boolean } }],
	},
	{
		collection: 'TaskInfo',
	}
);

mongoose.model('TaskInfo', TaskDetailsSchema);
