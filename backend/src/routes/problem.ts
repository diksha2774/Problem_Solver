import { RequestHandler, Router } from "express";
import { generateAIResponse } from '../config/GeminiService';
import auth from '../middleware/auth';
import Problem from '../models/Problem';
import User from "../models/User";

const router = Router();
router.use(auth);

router.get("/getuser",(req,res)=>{
    const username = req.username;
    res.status(200).json({msg:"you are logged in",username});
});

router.get('/all_PS', (async (req, res) => {   
    try {
        const username = req.username;
        const user = await User.findOne({ username: username });
        console.log(username);
        if (!user) {
            res.status(404).json({ error: "User not found" });
            return;
        }

        const userid = user._id;

        const Problems = await Problem.find({ createdBy: userid });

        if (!Problems || Problems.length === 0) {
            res.status(404).json({ error: "No problems found for this user." });
            return;
        }
        res.status(200).json({ Problems });

    } catch (err: any) {
        res.status(500).json({ msg: "Error fetching problems", error: err.message });
    }
}) as RequestHandler);

router.post('/PS_data', (async (req, res) => {
    try {
        const username = req.username;
        // console.log(`🔍 Searching for user: ${username}`);

        const user = await User.findOne({ username: username });
        if (!user) {
            // console.warn(`⚠️ User not found: ${username}`);
            res.status(404).json({ error: "User not found" });
            return;
        }
        // console.log(`✅ User found: ${username}`);

        const PS = req.body;
        const normalizedTitle = PS.title.trim().replace(/\s+/g, ' ').toLowerCase();
        // console.log(`📝 Normalized title: ${normalizedTitle}`);

        const existingProblem = await Problem.findOne({ 
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

        const p = await Problem.create({
            title: normalizedTitle,
            description: PS.description.trim(),
            constraints: PS.constraints.map((str: string) => str.trim()),
            createdBy: user._id,
            status: 'pending',
            submitCount: 0
        });
        res.status(201).json({ message: "Problem statement added successfully" });
        return;

    } catch (err: any) {

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
}) as RequestHandler);

router.post('/Evaluate_code', (async (req, res) => {
    try {
        const data = req.body;
        const title = data.title;
        const code = data.code;
        const approach = data.approach;
        const username = req.username;

        const user = await User.findOne({ username: username });
        if (user === null) {
            res.status(404).json({ error: "User not found" });
            return;
        }

        const PS = await Problem.findOne({ title: title, createdBy: user._id });
        if (PS === null) {
            res.status(404).json({ error: "No active problem statement found." });
            return;
        }

        await Problem.updateOne(
            { _id: PS._id },
            { $inc: { submitCount: 1 } }
        );

        const updatedPS = await Problem.findOne({ _id: PS._id });
        if(updatedPS === null) {
            res.status(404).json({ error: "Problem statement not found." });
            return;
        }
        let responseType = "mistake"; // Default to 'mistake' feedback
        if (updatedPS.submitCount === 2 && !updatedPS.hintGiven) {
            responseType = "hint";
            await Problem.updateOne(
                { _id: PS._id },
                { $set: { submitCount: 0, hintGiven: true } }
            );
        } else if (updatedPS.submitCount === 2 && updatedPS.hintGiven) {
            responseType = "solution";
            await Problem.updateOne(
                { _id: PS._id },
                { $set: { submitCount: 0, hintGiven: false } }
            );
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

        const aiResponse = await generateAIResponse(prompt);

        res.status(200).json({ message: "AI Response", response: aiResponse });

    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Failed to generate AI response" });
    }
}) as RequestHandler);



export default router;