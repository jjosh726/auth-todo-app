import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}`);

        console.log(`MongoDB Connected! Connection Instance : ${connectionInstance}`);

    } catch (error) {
        console.log(`MongoDB connection failed : ${error}`);
    }
}

export default connectDB;