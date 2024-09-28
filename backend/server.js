import express from "express";
import dotenv from "dotenv";
dotenv.config();
import authRoutes from "./routes/auth.routes.js";
import mongoConnection from "./db/connectMongoDB.js";
import cookieParser from "cookie-parser";
const app = express();

const PORT = process.env.PORT || 8001;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());
app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
	console.log(`Server running at PORT: ${PORT} `);
	mongoConnection();
});
