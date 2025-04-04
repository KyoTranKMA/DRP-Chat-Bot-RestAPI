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

/**
 * Create an object composed of the picked object properties
 * @param {Object} object
 * @param {string[]} keys
 * @returns {Object}
 */
const pick = (object, keys) => {
    return keys.reduce((obj, key) => {
        if (object && Object.prototype.hasOwnProperty.call(object, key)) {
            // eslint-disable-next-line no-param-reassign
            obj[key] = object[key];
        }
        return obj;
    }, {});
};
module.exports = {
    getInfoData, getArrayInfoData, pick
};
