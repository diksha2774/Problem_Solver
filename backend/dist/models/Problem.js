"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const ProblemSchema = new mongoose_1.default.Schema({
    title: {
        type: String,
        required: true,
        set: (val) => val.trim().replace(/\s+/g, ' ').toLowerCase()
    },
    description: {
        type: String,
        required: true,
        set: (val) => val.trim()
    },
    constraints: {
        type: [String],
        required: true,
        set: (val) => val.map(str => str.trim())
    },
    status: {
        type: String,
        enum: ["pending", "completed"],
        required: true,
        default: 'pending'
    },
    createdBy: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User', // Reference to User schema
        required: true
    },
    submitCount: {
        type: Number,
        required: true,
        default: 1
    },
    hintGiven: {
        type: Boolean,
        required: true,
        default: false
    }
}, {
    timestamps: true
});
ProblemSchema.index({ title: 1, createdBy: 1 }, { unique: true });
const Problem = mongoose_1.default.model('Problem', ProblemSchema);
exports.default = Problem;
