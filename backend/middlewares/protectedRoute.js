import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

export const protectedRoute = async (req, res, next) => {
	try {
		const token = req.cookies.jwt;
		//if there is  no token
		if (!token) {
			return res.status(401).json({ error: "Unathorized: No Token Provided" });
		}

		//if there is token verify the token
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		//if no token or expired token
		if (!decoded) {
			return res
				.status(401)
				.json({ error: "Unathorized: Invalid Token Provided" });
		}

		// if both logics are satisfying
		const user = await User.findById(decoded.userId).select("-password");

		if (!user) {
			return res.status(404).json({ error: " User not found" });
		}

		req.user = user;
		next();
	} catch (error) {
		console.log("Error in protectedRoute middleware", error.message);
		return res.status(500).json({ error: "Internal Server Error " });
	}
};
