const captainModel = require('../models/captain.model');
const captainService = require('../services/captain.service');
const blackListTokenModel = require('../models/blackListToken.model');
const { validationResult } = require('express-validator');


module.exports.registerCaptain = async (req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { fullname, email, password, vehicle } = req.body;
    const cleanEmail = email.toLowerCase().trim();

    const isCaptainAlreadyExist = await captainModel.findOne({ email: cleanEmail });

    if (isCaptainAlreadyExist) {
        return res.status(400).json({ message: 'Captain already exist' });
    }

    const hashedPassword = await captainModel.hashPassword(password);

    const captain = await captainService.createCaptain({
        firstname: fullname.firstname,
        lastname: fullname.lastname,
        email: cleanEmail,
        password: hashedPassword,
        color: vehicle.color,
        plate: vehicle.plate,
        capacity: vehicle.capacity,
        vehicleType: vehicle.vehicleType
    });

    captain.status = 'active';
    await captain.save();

    const token = captain.generateAuthToken();

    res.status(201).json({ token, captain });
}

module.exports.loginCaptain = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array(), message: errors.array()[0]?.msg || 'Validation error' });
    }

    const { email, password } = req.body;
    const cleanEmail = email.toLowerCase().trim();

    const captain = await captainModel.findOne({ email: cleanEmail }).select('+password');

    if (!captain) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await captain.comparePassword(password);

    if (!isMatch) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Set captain status to active in DB on login
    captain.status = 'active';
    await captain.save();

    const token = captain.generateAuthToken();

    res.cookie('token', token);

    res.status(200).json({ token, captain });
}

module.exports.getCaptainProfile = async (req, res, next) => {
    res.status(200).json({ captain: req.captain });
}

module.exports.logoutCaptain = async (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[ 1 ];

    if (req.captain?._id) {
        await captainModel.findByIdAndUpdate(req.captain._id, { status: 'inactive' });
    }

    if (token) {
        await blackListTokenModel.create({ token });
    }

    res.clearCookie('token');

    res.status(200).json({ message: 'Logout successfully' });
}

module.exports.forgotPassword = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array(), message: errors.array()[0]?.msg });
    }

    const { email } = req.body;
    const cleanEmail = email.toLowerCase().trim();
    const captain = await captainModel.findOne({ email: cleanEmail });

    if (!captain) {
        return res.status(404).json({ message: 'Captain with this email does not exist' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    captain.resetOtp = otp;
    captain.resetOtpExpires = Date.now() + 15 * 60 * 1000;
    await captain.save();

    try {
        const emailService = require('../services/email.service');
        await emailService.sendPasswordResetEmail({
            to: captain.email,
            otp,
            userName: captain.fullname?.firstname || 'Captain'
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
    const captain = await captainModel.findOne({ email: cleanEmail }).select('+resetOtp +resetOtpExpires +password');

    if (!captain || captain.resetOtp !== otp || !captain.resetOtpExpires || captain.resetOtpExpires < Date.now()) {
        return res.status(400).json({ message: 'Invalid or expired OTP code.' });
    }

    const hashedPassword = await captainModel.hashPassword(newPassword);
    captain.password = hashedPassword;
    captain.resetOtp = undefined;
    captain.resetOtpExpires = undefined;
    captain.status = 'active';
    await captain.save();

    return res.status(200).json({ message: 'Password reset successful. You can now log in.' });
};