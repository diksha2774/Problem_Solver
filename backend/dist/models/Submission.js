"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const UserSubmissionSchema = new mongoose_1.default.Schema({
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User', // Reference to User schema
        required: true
    },
    problemId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Problem', // Reference to ProblemStat schema
        required: true
    },
    submitCount: {
        type: Number,
        required: true,
        default: 1
    },
    code: {
        type: String, // Store the user's code for evaluation
        required: true
    },
    approach: {
        type: String, // Describes the user's thought process
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'correct', 'incorrect'],
        default: 'pending'
    }
}, {
    timestamps: true
});
const Submission = mongoose_1.default.model('Submission', UserSubmissionSchema);
exports.default = Submission;
