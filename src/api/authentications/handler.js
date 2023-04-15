const autoBind = require('auto-bind');

class AuthenticationsHandler {
    constructor(authenticationsService, usersService, tokenManager, validator) {
        this.authenticationsService = authenticationsService;
        this.usersService = usersService;
        this.tokenManager = tokenManager;
        this.validator = validator;

        autoBind(this);
    }

    async postAuthenticationHandler({ payload }, h) {
        this.validator.validatePostAuthenticationPayload(payload);
        const { username, password } = payload;

        const userId = await this.usersService.verifyUserCredential(username, password);
        const accessToken = this.tokenManager.generateAcessToken({ userId });
        const refreshToken = this.tokenManager.generateRefreshToken({ userId });

        await this.authenticationsService.addRefreshToken(refreshToken);

        const response = h.response({
            status: 'success',
            message: 'Authentication berhasil ditambahkan',
            data: {
                accessToken,
                refreshToken,
            },
        });
        response.code(201);
        return response;
    }

    async putAuthenticationHandler({ payload }) {
        this.validator.validatePutAuthenticationPayload(payload);
        const { refreshToken } = payload;
        await this.authenticationsService.verifyRefreshToken(refreshToken);
        const { userId } = this.tokenManager.verifyRefreshToken(refreshToken);
        const accessToken = this.tokenManager.generateAcessToken({ userId });
        return {
            status: 'success',
            message: 'Access Token berhasil diperbarui',
            data: {
                accessToken,
            },
        };
    }

    async deleteAuthenticationHandler({ payload }) {
        this.validator.validateDeleteAuthenticationPayload(payload);

        const { refreshToken } = payload;
        await this.authenticationsService.verifyRefreshToken(refreshToken);
        await this.authenticationsService.deleteRefreshToken(refreshToken);

        return {
            status: 'success',
            message: 'Refresh Token berhasil dihapus',
        };
    }
};

module.exports = AuthenticationsHandler;