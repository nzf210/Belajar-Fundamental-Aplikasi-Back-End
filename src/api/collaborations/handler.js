const autoBind = require('auto-bind');

class CollaborationsHandler {
    constructor(collaborationsService, playlistsService, validator) {
        this.collaborationsService = collaborationsService;
        this.playlistsService = playlistsService;
        this.validator = validator;
        autoBind(this);
    }

    async postCollaboration({ payload, auth }, h) {
        this.validator.validatePostCollaborationPayload(payload);

        const { playlistId, userId } = payload;
        const { userId: credentialId } = auth.credentials;

        await this.playlistsService.verifyPlaylistOwner(playlistId, credentialId);
        const collaborationId = await this.collaborationsService.addCollaboration(
            playlistId, userId,
        );

        const response = h.response({
            status: 'success',
            data: {
                collaborationId,
            },
        });
        response.code(201);
        return response;
    }

    async deleteCollaboration({ payload, auth }) {
        this.validator.validateDeleteCollaborationPayload(payload);

        const { playlistId, userId } = payload;
        const { userId: credentialId } = auth.credentials;

        await this.playlistsService.verifyPlaylistOwner(playlistId, credentialId);
        await this.collaborationsService.deleteCollaboration(playlistId, userId);

        return {
            status: 'success',
            message: 'Collaborator berhasil dihapus',
        };
    }
}

module.exports = CollaborationsHandler;