import mongoose, { model, mongo } from "mongoose";

const ProblemSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        set: (val: string) => val.trim().replace(/\s+/g, ' ').toLowerCase()
    },
    description: {
        type: String,
        required: true,
        set: (val: string) => val.trim()
    },
    constraints: { 
        type: [String], 
        required: true,
        set: (val: string[]) => val.map(str => str.trim())
    },
    status: {
        type: String,
        enum: ["pending", "completed"],
        required: true,
        default: 'pending'
    },
    createdBy: {
            type: mongoose.Schema.Types.ObjectId,
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
})
ProblemSchema.index({ title: 1, createdBy: 1 }, { unique: true });
const Problem = mongoose.model('Problem', ProblemSchema);
export default Problem;
