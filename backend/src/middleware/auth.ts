import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { Router, Request } from 'express';

// Extend the Request interface to include the username property
declare global {
    namespace Express {
        interface Request {
            username?: string;
        }
    }
}
const router = Router();
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET || "";
if (!JWT_SECRET) {                    
    console.log("secret key is not present");
    process.exit(1);
}
router.use((req, res, next) => {        
    const data = req.headers.authorization;
    const token = data?.startsWith("Bearer ") ? data.split(" ")[1] : data;    console.log(token)
    if (!token) {
        res.status(401).json({msg: "unauthorized"});
        return;
    }
    const decoded = jwt.verify(token, JWT_SECRET);
    if (!decoded) {
        res.status(401).json({msg: "unauthorized"});
        return;
    }   
    const username = (decoded as any).username;
    req.username = username;
    if (!username) {
        res.status(401).json({msg: "unauthorized"});
        return;
    }
    next();
});

export default router;