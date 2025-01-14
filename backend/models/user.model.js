import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
	{
		username: {
			type: String,
			required: true,
			unique: true,
		},
		fullname: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			reauired: true,
			unique: true,
		},
		password: {
			type: String,
			required: true,
			minLength: 6,
		},
		followers: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "User",
				default: [],
			},
		],
		following: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "User",
				default: [],
			},
		],
		profileImage: {
			type: String,
			default: "",
		},
		coverImage: {
			type: String,
			default: "",
		},
		bio: {
			type: String,
			default: "",
		},
		link: {
			type: String,
			default: "",
		},
	},
	{ timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
