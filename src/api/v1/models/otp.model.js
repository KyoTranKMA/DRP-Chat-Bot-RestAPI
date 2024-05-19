const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
    email:{type: String, required: true},
    otp:{type: String, required: true}
});

const Otps = mongoose.model('Otps', otpSchema);
module.exports = Otps;
