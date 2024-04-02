import express from 'express';
import { connectDB } from './db';
import authRoutes from './routes/auth';
import userRoutes from './routes/user';

const app = express();
// eslint-disable-next-line no-undef
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Parse JSON request body
app.use(express.json());

// Define authentication routes
app.use('/auth', authRoutes);

// Define user routes
app.use('/user', userRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});