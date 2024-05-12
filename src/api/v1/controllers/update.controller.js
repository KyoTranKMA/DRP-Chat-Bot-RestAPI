'use strict';

const { UpdateService } = require('../services/update.service');

class UpdateController {
    updateAccount = async (req, res, next) => {
        try {
            const updateResult = await UpdateService.updateAccount(req.body);
            res.status(updateResult.code).json(updateResult);
        } catch (error) {
            next(error);
        }
    }
   


}

module.exports = new UpdateController();
