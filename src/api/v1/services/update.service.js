"use strict";

const userModel = require("../models/user.model.js");
const userInfoModel = require("../models/user_info.model.js");

const { getInfoData } = require("../utils/index.js");

class UpdateService {
    static updateAccount = async ({ username, name, age, height, dateOfBirth, weight, bmi }) => {
        try {
            const existingUsername = await userModel.findOne({ username });
            if (!existingUsername) {
                return { code: 400, message: "Tên tài khoản không tồn tại" };
            }

            const Account = await userInfoModel.findByIdAndUpdate(
                existingUsername.info,
                {
                    $set: {
                        'name': name,
                        'age': age,
                        'height': height,
                        'dateOfBirth': dateOfBirth,
                        'weight': weight,
                        'bmi': bmi
                    }
                },
                { new: true }
            );
            if (Account) {
                return {
                    code: 201, message: "Cập nhật tài khoản thành công",    
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
