import mongoose from "mongoose";

const mongoConnection = async () => {
	try {
		const conn = await mongoose.connect(process.env.MONGO_URI);
		console.log(`MongoDB connected  successfully : ${conn.connection.host} `);
	} catch (error) {
		console.error(`Error while connecting MongoDB : ${error}`);
		process.exit(1);
	}
};

export default mongoConnection;
