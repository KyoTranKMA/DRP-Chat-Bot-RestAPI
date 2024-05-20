const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
    email:{type: String, required: true},
    otp:{type: String, required: true},
    expiresAt: { type: Date, default: Date.now, index: { expires: '5m' } }
});

const Otps = mongoose.model('Otps', otpSchema);
module.exports = Otps;
