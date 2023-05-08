const autoBind = require('auto-bind');

class ExportsHandler {
  constructor(producerService, playlistsService, exportsValidator) {
    this._producerService = producerService;
    this._playlistsService = playlistsService;
    this._exportsValidator = exportsValidator;

    autoBind(this);
  }

  async postToExportPlaylistHandler(request, h) {
    this._exportsValidator.validateExportPlaylistsPayload(request.payload);

    const { userId: credentialId } = request.auth.credentials;
    const { playlistId } = request.params;

    await this._playlistsService.verifyPlaylistOwner(playlistId, credentialId);

    const message = {
      playlistId,
      targetEmail: request.payload.targetEmail,
    };

    await this._producerService.sendMessage(
      'export:playlist',
      JSON.stringify(message),
    );

    const response = h.response({
      status: 'success',
      message: 'Permintaan Anda dalam antrian',
    });

    response.code(201);
    return response;
  }
}

module.exports = ExportsHandler;