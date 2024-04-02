import mongoose from 'mongoose';

const TaskDetailsSchema = new mongoose.Schema(
	{
		title: String,
		description: String,
		department: String,
		section: String,
		assignedTo: [{ type: String, unique: true }],
		dueDate: { type: Date, optional: true },
		priority: String,
		subTasks: [{ type: String, optional: true }],
	},
	{
		collection: 'TaskInfo',
	}
);

mongoose.model('TaskInfo', TaskDetailsSchema);
