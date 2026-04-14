import mongoose from "mongoose"

const connectDb = async () => {
    try {
        
        mongoose.set('strictQuery', true);

        await mongoose.connect(process.env.MONGODB_URL);
        
        console.log("✅ System: Database connected successfully");
    } catch (error) {
        console.error("❌ Database Connection Error:", error.message);
        process.exit(1); 
    }
}

export default connectDb