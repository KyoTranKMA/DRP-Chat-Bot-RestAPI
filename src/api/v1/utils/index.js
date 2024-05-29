"use strict";

const _ = require("lodash");

const getInfoData = ({ fields = [], object = {} }) => {
    return _.pick(object, fields);
};
const getArrayInfoData = ({ fields = [], object = [] }) => {
    return object.map((item) => {
        return _.pick(item, fields);
    });
};

module.exports = {
    getInfoData, getArrayInfoData
};
