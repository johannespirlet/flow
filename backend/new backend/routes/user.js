import express from 'express';
import { authenticate } from '../middlewares/auth';

export const router = express.Router();

router.get('/profile', authenticate, (req, res) => {
  res.json({ message: `Welcome ${req.user.fname} ${req.user.lname}` });
});