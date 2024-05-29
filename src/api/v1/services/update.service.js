"use strict";

const userModel = require("../models/user.model.js");
const userInfoModel = require("../models/user_info.model.js");

const { getInfoData } = require("../utils/index.js");

class UpdateService {
    static getInfoAccount = async ({ username }) => {
        try {
            const existingUsername = await userModel.findOne
                ({ username });
            if (!existingUsername) {
                return {
                    code: 404, message: "Tên tài khoản không tồn tại"
                };
            }

            const info = await userInfoModel.findById(existingUsername.info);
            
            if (info) {
                let infoData = info.toObject();
                // Convert yyyy-mm-dd to dd-mm-yyyy format for user 
                const dob = new Date(infoData.dateOfBirth);
                const formattedDob = `${String(dob.getDate()).padStart(2, '0')}-${String(dob.getMonth() + 1).padStart(2, '0')}-${dob.getFullYear()}`;

                infoData.dateOfBirth = formattedDob;
                return {
                    code: 200, message: "Lấy thông tin tài khoản thành công",
                    data: getInfoData({
                        fields: ['name', 'dateOfBirth', 'age', 'height', 'weight', 'bmi'],
                        object: infoData
                    }),
                };
            } else {
                return { code: 400, message: "Lấy thông tin tài khoản không thành công" };
            }
        }
        catch (error) {
            console.error(error);
            return { code: 500, message: "Internal Server Error" };
        }
    }
    static updateAccount = async ({ username, name, height, weight, dateOfBirth }) => {
        try {
            const existingUsername = await userModel.findOne({ username });
            if (!existingUsername) {
                return { code: 404, message: "Tên tài khoản không tồn tại" };
            }
            // Convert dd-mm-yyyy to yyyy-mm-dd format    
            const formattedDob = dateOfBirth.split("-").reverse().join("-");
            const age = new Date().getFullYear() - new Date(formattedDob).getFullYear();
            // Convert height to meter and calculate BMI
            const heightInM = height / 100;
            const bmi = (weight / (heightInM * heightInM)).toFixed(2);
            const Account = await userInfoModel.findByIdAndUpdate(
                existingUsername.info,
                {
                    $set: {
                        'name': name,
                        'age': age,
                        'height': height,
                        'dateOfBirth': formattedDob,
                        'weight': weight,
                        'bmi': bmi
                    }
                },
                { new: true }
            );
            if (Account) {
                return {
                    code: 201, message: "Cập nhật tài khoản thành công"
                };
            } else {
                return { code: 400, message: "Cập nhật tài khoản không thành công" };
            }
        } catch (error) {
            console.error(error);
            return { code: 500, message: "Internal Server Error" };
        }
    };

}

module.exports = {
    UpdateService,
};
