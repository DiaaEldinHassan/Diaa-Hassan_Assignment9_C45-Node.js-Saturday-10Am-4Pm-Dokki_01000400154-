import mongoose from "mongoose";
import { uri ,offline_db } from "../../Config/config.service.js";
export async function connectDB() {
    try {
        await mongoose.connect(offline_db);
        console.log("Connected To DB Successfully 👌👌");
    } catch (error) {
        throw error;
    }
}