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
            console.log("existingUsername", existingUsername.id);
            const Account = await userInfoModel.findByIdAndUpdate(
                existingUsername._id,
                {
                    $set: {
                        'info.name': name,
                        'info.age': age,
                        'info.height': height,
                        'info.dateOfBirth': dateOfBirth,
                        'info.weight': weight,
                        'info.bmi': bmi
                    }
                },
                { new: true }
            );
            console.log("Account", Account);
            if (Account) {
                return {
                    code: 201, message: "Cập nhật tài khoản thành công",
                    Account: getInfoData({
                        fields: ["_id", "username", "info"],
                        object: Account
                    })
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
