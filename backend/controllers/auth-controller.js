import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken'
import Verification from "../models/verification.js";
import { sendEmail } from "../services/email-sender.js";
import aj from "../libs/arcjet.js";

const registerUser = async (req, res) => {
	try {
		const { email, name, password } = req.body;
		const decision = await aj.protect(req, { email }); // Deduct 5 tokens from the bucket
		if (decision.isDenied()) {
			res.writeHead(403, { "Content-Type": "application/json" });
			res.end(JSON.stringify({ message: "Invalid email address: (fake email!)" }));
		}

		// check if user exists
		const existingUser = await User.findOne({ email });
		if (existingUser) return res.status(400).json({ message: "Email address already in use" });

		// create new user
		const salt = await bcrypt.genSalt(10);
		const hashPassword = await bcrypt.hash(password, salt);
		const newUser = await User.create({ email, password: hashPassword, name, });

		// create email verification token
		const verificationToken = jwt.sign({ userId: newUser.id, purpose: "email-verification" }, process.env.JWT_SECRET, { expiresIn: '1h' })
		await Verification.create({ userId: newUser.id, token: verificationToken, expiresAt: new Date(Date.now() + 1 * 60 * 60 * 1000) })

		// send email
		const verificationLink = `${process.env.FRONTEND_HOST_NAME}/verify-email?token=${verificationToken}`
		const emailSubject = `Verify your email`
		const emailBody = `<p>Click <a href="${verificationLink}">here</a> to verify your email</p>`
		const isEmailSent = await sendEmail(email, emailSubject, emailBody)
		if (!isEmailSent) return res.status(500).json({ message: "Failed to send verification email" })

		res.status(201).json({ message: "Verification email sent to your email. Please check and verify your account." });

	} catch (error) {
		console.log(error);
		res.status(500).json({ message: "Internal server error" });
	}
};

const loginUser = async (req, res) => {
	try {
		// check if user exists with given email
		const { email, password } = req.body;
		const user = await User.findOne({ email }).select("+password");
		if (!user) return res.status(400).json({ status: "error", message: "Invalid email or password" });

		// check if email verified
		if (!user.isEmailVerified) {
			const currentVerification = await Verification.findOne({ userId: user._id });
			if (currentVerification && currentVerification.expiresAt > new Date()) {
				return res.status(400).json({ status: "error", message: "Email Not Verified. Please Check Your Email For Verification Link." });
			} else {
				await Verification.findByIdAndDelete(currentVerification._id);
				const verificationToken = jwt.sign({ userId: user._id, purpose: "email-verification" }, process.env.JWT_SECRET, { expiresIn: "1h" });
				await Verification.create({ userId: user._id, token: "dd", expiresAt: new Date(Date.now() + 1 * 60 * 60 * 1000) });
				// send email
				const verificationLink = `${process.env.FRONTEND_HOST_NAME}/verify-email?token=${verificationToken}`
				const emailSubject = `Verify your email`
				const emailBody = `<p>Click <a href="${verificationLink}">here</a> to verify your email</p>`
				const isEmailSent = await sendEmail(email, emailSubject, emailBody)
				if (!isEmailSent) return res.status(500).json({ message: "Failed to send verification email" })
				res.status(201).json({ message: "Verification Link Sent To Your Email Address. Please Check And Verify Your Account." });
			}
		}

		// check password is valid
		const isPasswordValid = await bcrypt.compare(password, user.password);
		if (!isPasswordValid) return res.status(400).json({ status: "error", message: "Invalid email or password" });

		// login successful, issue the token
		const token = jwt.sign({ userId: user._id, purpose: "login" }, process.env.JWT_SECRET, { expiresIn: "7d" });

		// set user last login status
		user.lastLogin = new Date();
		await user.save();

		// necessary user data
		const userData = user.toObject();
		delete userData.password;

		return res.status(200).json({ status: "success", message: "User logged in successfully", token, user: userData })

	} catch (error) {
		console.log(error);
		res.status(500).json({ message: "Internal server error" });
	}
};

const verifyEmail = async (req, res) => {
	try {
		const { token } = req.body;
		const payload = jwt.verify(token, process.env.JWT_SECRET);
		if (!payload) return res.status(401).json({ message: "Unauthorized, token not found" });

		const { userId, purpose } = payload;
		if (purpose !== "email-verification") return res.status(401).json({ message: "Unauthorized, bad purpose" });

		const verification = await Verification.findOne({ userId, token, });
		if (!verification) return res.status(401).json({ message: "Unauthorized not verified" });

		const isTokenExpired = verification.expiresAt < new Date();
		if (isTokenExpired) return res.status(401).json({ message: "Token expired" });

		const user = await User.findById(userId);
		if (!user) return res.status(404).json({ message: "User Not Found" });

		if (user.isEmailVerified) return res.status(400).json({ message: "Email already verified" });

		user.isEmailVerified = true;
		await user.save();

		await Verification.findByIdAndDelete(verification._id);

		res.status(200).json({ message: "Email verified successfully" });

	} catch (error) {
		console.log(error);
		res.status(500).json({ message: "Internal server error" });
	}
};

const resetPasswordRequest = async (req, res) => {
	try {
		// check user
		const { email } = req.body;
		const user = await User.findOne({ email });
		if (!user) return res.status(401).json({ status: "error", message: "User Not Found!" })

		// check email verified
		if (!user.isEmailVerified) return res.status(401).json({ status: "error", message: "Email Not Verified!" })

		// check existing verification
		const existingVerification = await Verification.findOne({ userId: user._id });
		if (existingVerification && existingVerification.expiresAt > new Date()) {
			return res.status(400).json({ status: "error", message: "Reset Password Request Already Sent." });
		}
		if (existingVerification && existingVerification.expiresAt < new Date()) {
			await Verification.findByIdAndDelete(existingVerification._id);
		}

		// issue new token for verification
		const resetPasswordToken = jwt.sign({ userId: user._id, purpose: "reset-password" }, process.env.JWT_SECRET, { expiresIn: "15m" })

		await Verification.create({
			userId: user._id,
			token: resetPasswordToken,
			expiresAt: new Date(Date.now() + 15 * 60 * 1000)
		})

		// send link via email
		const resetPasswordLink = `${process.env.FRONTEND_HOST_NAME}/reset-password?token=${resetPasswordToken}`;
		const emailSubject = `Reset Your Password`
		const emailBody = `<p>Click <a href="${resetPasswordLink}">here</a> to reset your password</p>`
		const isEmailSent = await sendEmail(email, emailSubject, emailBody)
		if (!isEmailSent) return res.status(500).json({ status: "error", message: "Failed to Send Reset Password Link" })

		res.status(201).json({ status: "success", message: "Reset Password Email Sent." });

	} catch (error) {
		console.log(error);
		res.status(500).json({ status: "error", message: "Internal Server Error" });
	}
}

const resetPassword = async (req, res) => {
	try {
		const { token, newPassword, confirmPassword } = req.body;

		let payload;
		try {
			payload = jwt.verify(token, process.env.JWT_SECRET);
		} catch {
			return res.status(401).json({ message: "Invalid or expired token" });
		}

		const { userId, purpose } = payload;
		if (purpose !== "reset-password") {
			return res.status(403).json({ message: "Unauthorized" });
		}

		const verification = await Verification.findOne({ userId, token });
		if (!verification) {
			return res.status(401).json({ message: "Unauthorized" });
		}

		if (verification.expiresAt < new Date()) {
			return res.status(401).json({ message: "Token expired" });
		}

		const user = await User.findById(userId);
		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		if (newPassword !== confirmPassword) {
			return res.status(400).json({ message: "Passwords don't match" });
		}

		const hashPassword = await bcrypt.hash(newPassword, 10);
		user.password = hashPassword;
		await user.save();

		await Verification.findByIdAndDelete(verification._id);

		res.status(200).json({ message: "Password changed successfully" });

	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Internal server error" });
	}
};

export {
	registerUser,
	loginUser,
	verifyEmail,
	resetPasswordRequest,
	resetPassword
};
