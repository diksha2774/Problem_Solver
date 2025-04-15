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
const express_1 = require("express");
const GeminiService_1 = require("../config/GeminiService");
const auth_1 = __importDefault(require("../middleware/auth"));
const Problem_1 = __importDefault(require("../models/Problem"));
const User_1 = __importDefault(require("../models/User"));
const router = (0, express_1.Router)();
router.use(auth_1.default);
router.get("/getuser", (req, res) => {
    const username = req.username;
    res.status(200).json({ msg: "you are logged in", username });
});
router.get('/all_PS', ((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const username = req.username;
        const user = yield User_1.default.findOne({ username: username });
        console.log(username);
        if (!user) {
            res.status(404).json({ error: "User not found" });
            return;
        }
        const userid = user._id;
        const Problems = yield Problem_1.default.find({ createdBy: userid });
        if (!Problems || Problems.length === 0) {
            res.status(404).json({ error: "No problems found for this user." });
            return;
        }
        res.status(200).json({ Problems });
    }
    catch (err) {
        res.status(500).json({ msg: "Error fetching problems", error: err.message });
    }
})));
router.post('/PS_data', ((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const username = req.username;
        // console.log(`🔍 Searching for user: ${username}`);
        const user = yield User_1.default.findOne({ username: username });
        if (!user) {
            // console.warn(`⚠️ User not found: ${username}`);
            res.status(404).json({ error: "User not found" });
            return;
        }
        // console.log(`✅ User found: ${username}`);
        const PS = req.body;
        const normalizedTitle = PS.title.trim().replace(/\s+/g, ' ').toLowerCase();
        // console.log(`📝 Normalized title: ${normalizedTitle}`);
        const existingProblem = yield Problem_1.default.findOne({
            title: normalizedTitle,
            createdBy: user._id
        });
        if (existingProblem) {
            // console.warn(`⚠️ Problem already exists for user: ${username}`);
            res.status(200).json({
                message: "Problem already registered for user",
                user: user.username,
                problem: existingProblem
            });
            return;
        }
        const p = yield Problem_1.default.create({
            title: normalizedTitle,
            description: PS.description.trim(),
            constraints: PS.constraints.map((str) => str.trim()),
            createdBy: user._id,
            status: 'pending',
            submitCount: 0
        });
        res.status(201).json({ message: "Problem statement added successfully" });
        return;
    }
    catch (err) {
        if (err.code === 11000) {
            // console.warn(`⚠️ Duplicate entry detected for user: ${req.query.username}`);
            res.status(400).json({ error: "A problem with this title already exists for this user." });
            return;
        }
        res.status(500).json({
            msg: "Internal server error",
            error: err.message
        });
        return;
    }
})));
router.post('/Evaluate_code', ((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = req.body;
        const title = data.title;
        const code = data.code;
        const approach = data.approach;
        const username = req.username;
        const user = yield User_1.default.findOne({ username: username });
        if (user === null) {
            res.status(404).json({ error: "User not found" });
            return;
        }
        const PS = yield Problem_1.default.findOne({ title: title, createdBy: user._id });
        if (PS === null) {
            res.status(404).json({ error: "No active problem statement found." });
            return;
        }
        yield Problem_1.default.updateOne({ _id: PS._id }, { $inc: { submitCount: 1 } });
        const updatedPS = yield Problem_1.default.findOne({ _id: PS._id });
        if (updatedPS === null) {
            res.status(404).json({ error: "Problem statement not found." });
            return;
        }
        let responseType = "mistake"; // Default to 'mistake' feedback
        if (updatedPS.submitCount === 2 && !updatedPS.hintGiven) {
            responseType = "hint";
            yield Problem_1.default.updateOne({ _id: PS._id }, { $set: { submitCount: 0, hintGiven: true } });
        }
        else if (updatedPS.submitCount === 2 && updatedPS.hintGiven) {
            responseType = "solution";
            yield Problem_1.default.updateOne({ _id: PS._id }, { $set: { submitCount: 0, hintGiven: false } });
        }
        const promptTitle = responseType === "hint"
            ? "### Hint"
            : responseType === "mistake"
                ? "### Mistake"
                : "### Solution";
        const prompt = `
        ${promptTitle}

        ### Problem Description
        ${title}
        ${PS.description}

        ### Constraints
        ${PS.constraints || "No specific constraints mentioned."}

        ### User's Code
        ${code}

        ### User's Approach
        ${approach || "Approach not provided."}

        ### Instructions for AI
        Provide a clear and direct **${responseType}** only. No extra explanations.
        - If incorrect, clearly describe the mistake and provide a simple fix.
        - If providing a hint, focus on the core logic without revealing the full solution.
        - If providing a solution, ensure it’s clear, efficient, and correct.

        Ensure your response is **brief**, **clear**, and **actionable**.
        `;
        const aiResponse = yield (0, GeminiService_1.generateAIResponse)(prompt);
        res.status(200).json({ message: "AI Response", response: aiResponse });
    }
    catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Failed to generate AI response" });
    }
})));
exports.default = router;
