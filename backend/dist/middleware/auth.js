"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = require("express");
const router = (0, express_1.Router)();
dotenv_1.default.config();
const JWT_SECRET = process.env.JWT_SECRET || "";
if (!JWT_SECRET) {
    console.log("secret key is not present");
    process.exit(1);
}
router.use((req, res, next) => {
    const data = req.headers.authorization;
    const token = (data === null || data === void 0 ? void 0 : data.startsWith("Bearer ")) ? data.split(" ")[1] : data;
    console.log(token);
    if (!token) {
        res.status(401).json({ msg: "unauthorized" });
        return;
    }
    const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
    if (!decoded) {
        res.status(401).json({ msg: "unauthorized" });
        return;
    }
    const username = decoded.username;
    req.username = username;
    if (!username) {
        res.status(401).json({ msg: "unauthorized" });
        return;
    }
    next();
});
exports.default = router;
