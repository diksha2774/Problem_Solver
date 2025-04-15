const mongoose = require("mongoose");
import * as dotenv from "dotenv"

dotenv.config();
async function connectDB (){
    try{     
        const mongoUri = process.env.DB_URI;
        if(!mongoUri){
            throw new Error("mongo uri is not provided");
        }   
        await mongoose.connect(mongoUri);
        console.log("mongo db is connected");
    }
    catch(err){
        console.error(`error is ${(err as Error).message}`);
        process.exit(1);
    }
}

module.exports = {connectDB};