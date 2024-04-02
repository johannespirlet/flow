import express from 'express';
import { register, login } from '../controllers/auth';

export const router = express.Router();

router.post('/register', register);
router.post('/login', login);