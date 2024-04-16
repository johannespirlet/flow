import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from './models/user.js';

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', 'https://flow-git-vercel-johannespirlets-projects.vercel.app/');
    if (req.method === 'POST') {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.json({ error: 'User nicht gefunden' });
        }

        if (await bcrypt.compare(password, user.password)) {
            // eslint-disable-next-line no-undef
            const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, {
                expiresIn: '20m',
            });

            res.json({ status: 'ok', data: token });
        } else {
            res.json({ status: 'error', error: 'Ungültiges Passwort' });
        }
    } else {
        res.status(405).end(); // Method Not Allowed
    }
}
