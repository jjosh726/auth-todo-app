import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}`);

        console.log(`\n\tMongoDB Connected! \n\tConnection Instance : ${connectionInstance.connection.host}\n`);

    } catch (error) {
        console.log(`MongoDB connection failed : ${error}`);
    }
}

export default connectDB;