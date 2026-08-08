const userModel = require('../models/user.model');
const userService = require('../services/user.service');
const { validationResult } = require('express-validator');
const blackListTokenModel = require('../models/blackListToken.model');

module.exports.registerUser = async (req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { fullname, email, password } = req.body;
    const cleanEmail = email.toLowerCase().trim();

    const isUserAlready = await userModel.findOne({ email: cleanEmail });

    if (isUserAlready) {
        return res.status(400).json({ message: 'User already exist' });
    }

    const hashedPassword = await userModel.hashPassword(password);

    const user = await userService.createUser({
        firstname: fullname.firstname,
        lastname: fullname.lastname,
        email: cleanEmail,
        password: hashedPassword
    });

    const token = user.generateAuthToken();

    res.status(201).json({ token, user });
}

module.exports.loginUser = async (req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    const cleanEmail = email.toLowerCase().trim();

    const user = await userModel.findOne({ email: cleanEmail }).select('+password');

    if (!user) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = user.generateAuthToken();

    res.cookie('token', token);

    res.status(200).json({ token, user });
}

module.exports.getUserProfile = async (req, res, next) => {
    res.status(200).json(req.user);
}

module.exports.logoutUser = async (req, res, next) => {
    res.clearCookie('token');
    const token = req.cookies.token || req.headers.authorization?.split(' ')[ 1 ];

    if (token) {
        await blackListTokenModel.create({ token });
    }

    res.status(200).json({ message: 'Logged out' });
}

module.exports.forgotPassword = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array(), message: errors.array()[0]?.msg });
    }

    const { email } = req.body;
    const cleanEmail = email.toLowerCase().trim();
    const user = await userModel.findOne({ email: cleanEmail });

    if (!user) {
        return res.status(404).json({ message: 'User with this email does not exist' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetOtp = otp;
    user.resetOtpExpires = Date.now() + 15 * 60 * 1000;
    await user.save();

    try {
        const emailService = require('../services/email.service');
        await emailService.sendPasswordResetEmail({
            to: user.email,
            otp,
            userName: user.fullname?.firstname || 'Rider'
        });
        return res.status(200).json({ message: 'Password reset OTP sent to your email.' });
    } catch (err) {
        return res.status(500).json({ message: err.message || 'Failed to send reset email.' });
    }
};

module.exports.resetPassword = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array(), message: errors.array()[0]?.msg });
    }

    const { email, otp, newPassword } = req.body;
    const cleanEmail = email.toLowerCase().trim();
    const user = await userModel.findOne({ email: cleanEmail }).select('+resetOtp +resetOtpExpires +password');

    if (!user || user.resetOtp !== otp || !user.resetOtpExpires || user.resetOtpExpires < Date.now()) {
        return res.status(400).json({ message: 'Invalid or expired OTP code.' });
    }

    const hashedPassword = await userModel.hashPassword(newPassword);
    user.password = hashedPassword;
    user.resetOtp = undefined;
    user.resetOtpExpires = undefined;
    await user.save();

    return res.status(200).json({ message: 'Password reset successful. You can now log in.' });
};