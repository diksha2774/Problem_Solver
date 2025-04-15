"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const User_1 = __importDefault(require("../models/User"));
const express_1 = require("express");
const zod_1 = __importDefault(require("zod"));
const userschema = zod_1.default.object({
    username: zod_1.default.string(),
    email: zod_1.default.string().email(),
    password: zod_1.default.string()
});
const router = (0, express_1.Router)();
dotenv_1.default.config();
const JWT_SECRET = process.env.JWT_SECRET || "";
if (!JWT_SECRET) {
    console.log("secret key is not present");
    process.exit(1);
}
router.post('/signup', ((req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const exist = yield User_1.default.findOne({ username });
        if (exist) {
            return res.status(409).json({ msg: "User already exists." });
        }
        // Create user if valid
        yield User_1.default.create({ username, email, password });
        const token = jsonwebtoken_1.default.sign({ username }, JWT_SECRET);
        res.status(201).json({ msg: "User successfully added.", token });
    }
    catch (err) {
        res.status(500).json({ msg: "An error occurred.", err });
    }
})));
router.post('/signin', ((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ msg: "Please provide both username and password." });
        }
        const user = yield User_1.default.findOne({ username: username,
            password: password
        });
        if (!user) {
            return res.status(404).json({ msg: "User does not exist." });
        }
        if (user.password !== password) {
            return res.status(403).json({ msg: "Incorrect password." });
        }
        const token = jsonwebtoken_1.default.sign({ username }, JWT_SECRET);
        res.status(200).json({ msg: "You are logged in.", token });
    }
    catch (err) {
        res.status(500).json({ msg: "An error occurred.", err });
    }
})));
exports.default = router;
