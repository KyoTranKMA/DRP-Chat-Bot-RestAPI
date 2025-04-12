const objectId = (value, helpers) => {
  if (!value.match(/^[0-9a-fA-F]{24}$/)) {
    return helpers.message('"{{#label}}" must be a valid mongo id');
  }
  return value;
};

const password = (value, helpers) => {
  if (value.length < 8) {
    return helpers.message('mật khẩu phải có ít nhất 8 ký tự');
  }
  if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
    return helpers.message('mật khẩu phải chứa ít nhất một chữ cái và một số');
  }
  return value;
};

module.exports = {
  objectId,
  password,
};
