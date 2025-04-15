import { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv'
import User from '../models/User';
import {Router} from 'express'
import zod from 'zod';

const userschema = zod.object({
    username:zod.string(),
    email:zod.string().email(),
    password:zod.string()
})

const router = Router();
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET || "";

if(!JWT_SECRET){
    console.log("secret key is not present")
    process.exit(1);
}
router.post('/signup', (async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ msg: "Please fill all the fields." });
        }

        // Validate data using schema
        const status = userschema.safeParse(req.body);
        if (!status.success) {
            return res.status(400).json({ msg: "Invalid data format." });
        }

        // Check if the user already exists
        const exist = await User.findOne({ username });
        if (exist) {
            return res.status(409).json({ msg: "User already exists." });
        }

        // Create user if valid
        await User.create({ username, email, password });
        const token = jwt.sign({ username }, JWT_SECRET);

        res.status(201).json({ msg: "User successfully added.", token });
    } catch (err) {
        res.status(500).json({ msg: "An error occurred.", err });
    }
}) as RequestHandler);


router.post('/signin', (async (req, res) => {
    try {
        const { username, password }  = req.body;
        if (!username || !password) {
            return res.status(400).json({ msg: "Please provide both username and password." });
        }
        const user = await User.findOne({username:username,
            password:password
        });
        
        if (!user) {
            return res.status(404).json({ msg: "User does not exist." });
        }
        if (user.password !== password) {
            return res.status(403).json({ msg: "Incorrect password." });
        }
        const token = jwt.sign({ username }, JWT_SECRET);
        res.status(200).json({ msg: "You are logged in.", token });
    } catch (err) {
        res.status(500).json({ msg: "An error occurred.", err });
    }
}) as RequestHandler);


export default router;