const autoBind = require('auto-bind');

class UsersHandler {
  constructor(service, validator) {
    this.service = service;
    this.validator = validator;
    autoBind(this);
  }

  async postUserHandler({ payload }, h) {
    this.validator.validateUserPayload(payload);
    const userId = await this.service.addUser(payload);
    const response = h.response({
      status: 'success',
      message: 'User berhasil ditambahkan',
      data: {
        userId,
      },
    });
    response.code(201);
    return response;
  }
};

module.exports = UsersHandler;
