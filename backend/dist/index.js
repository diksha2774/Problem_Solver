"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const { connectDB } = require('./config/configuration');
const user_1 = __importDefault(require("./routes/user"));
const problem_1 = __importDefault(require("./routes/problem"));
connectDB();
dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());
app.use("/api/user", user_1.default);
app.use("/api/problem", problem_1.default);
app.listen(process.env.PORT, () => {
    console.log(`server is connected at port ${process.env.PORT}`);
});
