import bcrypt from 'bcryptjs';
import User from '../server.js';

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', 'https://flow-git-vercel-johannespirlets-projects.vercel.app/auth/sign-up');
    if (req.method === 'POST') {
        const { fname, lname, email, password, userType, secretKey } = req.body;
        const encryptedPassword = await bcrypt.hash(password, 10);

        try {
            // eslint-disable-next-line no-undef
            if (secretKey && secretKey !== process.env.ADMIN_KEY)
                return res.json({ error: 'Ungültiger Adminkey' });

            const oldUser = await User.findOne({ email });
            if (oldUser) return res.json({ error: 'User gibt es bereits' });

            await User.create({
                fname,
                lname,
                email,
                password: encryptedPassword,
                userType,
                color: `rgb(${Math.floor(Math.random() * 255)},${Math.floor(
                    Math.random() * 255
                )},${Math.floor(Math.random() * 255)})`,
                phone: '',
                note: '',
            });

            res.send({ status: 'ok' });
        } catch (error) {
            res.send({ status: error });
        }
    } else {
        res.status(405).end(); // Method Not Allowed
    }
}
