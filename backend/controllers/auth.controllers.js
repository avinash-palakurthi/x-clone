import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import { generateTokenAndSetCookie } from "../lib/utils/generateToken.js";

// signup logic & validation
export const signupController = async (req, res) => {
	try {
		const { username, fullname, email, password } = req.body;

		// email validation Regex
		const emailRegex = /^[^@]+@[^@]+\.[^@]+$/;
		if (!emailRegex.test(email)) {
			return res.status(400).json({ error: "Ivalid email format" });
		}
		// existing user
		const existingUsername = await User.findOne({ username: username });
		if (existingUsername) {
			return res.status(400).json({ error: "Username is alreday in use" });
		}
		//existing email
		const existingEmail = await User.findOne({ email: email });
		if (existingEmail) {
			return res.status(400).json({ error: "given email is already in use" });
		}
		//password length
		if (password.length < 6) {
			return res
				.status(400)
				.json({ error: "password must be atleast 6 charecters" });
		}

		//hashing password
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);

		//new user
		const newUser = new User({
			fullname: fullname,
			username: username,
			email: email,
			password: hashedPassword,
		});

		// providing JWT token for newuser
		if (newUser) {
			generateTokenAndSetCookie(newUser._id, res);
			await newUser.save();
			res.status(201).json({
				message: "user created successfully",
				_id: newUser._id,
				email: newUser.email,
				username: newUser.username,
				fullname: newUser.fullname,
				followers: newUser.followers,
				profileImage: newUser.profileImage,
				coverImage: newUser.coverImage,
			});
		} else {
			res.status(401).json({ error: "Invalid User Data" });
		}
	} catch (error) {
		console.error(`Error in signupController : ${error}`);
		res.status(500).json({ error: "Internal server error" });
	}
};

//login logic & validation
export const loginController = async (req, res) => {
	try {
		// 1. user gives their username & password
		const { username, password } = req.body;
		// 2. verify given username stored username in database
		const user = await User.findOne({ username });
		// 3. verify given password stored password(hashedPW) in database
		const passwordIsCorrect = await bcrypt.compare(
			password,
			user?.password || ""
		);

		if (!user || !passwordIsCorrect) {
			return res.status(400).json({ error: "Ivalid username or password" });
		}
		generateTokenAndSetCookie(user._id, res);
		res.status(201).json({
			message: "Login successfully",
			_id: user._id,
			email: user.email,
			username: user.username,
			fullname: user.fullname,
			followers: user.followers,
			profileImage: user.profileImage,
			coverImage: user.coverImage,
		});
	} catch (error) {
		console.error(`Error in Login Controller ${error}`);
		res.status(500).json({ error: "Internal server error" });
	}
};

//logout logic & validation
export const logoutController = async (req, res) => {
	try {
		res.cookie("jwt", "", { maxAge: 0 });
		res.status(200).json({ message: "Logged Out successfully" });
	} catch (error) {
		console.error(`Error in Logout Controller ${error}`);
		res.status(500).json({ error: "Internal server error" });
	}
};

//user Authenticated or not

export const getMe = async (req, res) => {
	try {
		const user = await User.findById(req.user._id).select("-password");
		res.status(200).json(user);
	} catch (error) {
		console.error(`Error in getMe Controller ${error.message}`);
		res.status(500).json({ error: "Internal server error" });
	}
};
