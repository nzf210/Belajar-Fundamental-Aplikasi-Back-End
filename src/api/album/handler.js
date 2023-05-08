const ClientError = require('../../exceptions/ClientError');
const autoBind = require('auto-bind');
const config = require('../../utils/config');


class AlbumsHandler {
  constructor(service, validator, songsService, storageService, uploadsValidator) {
    this.service = service;
    this.validator = validator;
    this.songsService = songsService;
    this.storageService = storageService;
    this.uploadsValidator = uploadsValidator;
    autoBind(this);
  }

  async postAlbumHandler(request, h) {
    try {
      this.validator.validateAlbumPayload(request.payload);
      const {
        name, year
      } = request.payload;

      const albumId = await this.service.addAlbum({
        name, year
      });

      const response = h.response({
        status: 'success',
        message: 'Album berhasil ditambahkan',
        data: {
          albumId,
        },
      });
      response.code(201);
      return response;
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      // Server ERROR!
      const response = h.response({
        status: 'error',
        message: 'Terjadi kegagalan pada server',
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }

  async getAlbumByIdHandler(request, h) {
    try {
      const { id } = request.params;
      const album = await this.service.getAlbumById(id);
      album.songs = await this.songsService.getSongByAlbumId(id);

      return {
        status: 'success',
        data: {
          album,
        },
      };

    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      const response = h.response({
        status: 'error',
        message: 'Terjadi kegagalan pada server',
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }

  async putAlbumByIdHandler(request, h) {
    try {
      this.validator.validateAlbumPayload(request.payload);
      const { id } = request.params;
      await this.service.editAlbumById(id, request.payload);
      const respon = h.response({
        status: 'success',
        message: 'Album berhasil diperbarui',

      });
      respon.code(200);
      return respon;
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      const response = h.response({
        status: 'fail',
        message: 'Terjadi kegagalan pada server',
      });
      response.code(404);
      return response;
    }
  }

  async deleteAlbumByIdHandler(request, h) {
    try {
      const { id } = request.params;
      await this.service.deleteAlbumById(id);
      return {
        status: 'success',
        message: 'Album berhasil dihapus',
      };
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      // Server ERROR!
      const response = h.response({
        status: 'error',
        message: 'Terjadi kegagalan pada server',
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }

  async postUploadCoverHandler(request, h) {
    const { id } = request.params;
    const { cover } = request.payload;

    await this.service.getAlbumById(id);

    this.uploadsValidator.validateImageHeaders(cover.hapi.headers);

    const filename = await this.storageService.writeFile(cover, cover.hapi);
    const fileLocation = `http://${config.app.host}:${config.app.port}/albums/covers/${filename}`;

    await this.service.editAlbumToAddCoverById(id, fileLocation);

    const response = h.response({
      status: 'success',
      message: 'Cover berhasil diupload',
    });

    response.code(201);
    return response;
  }

  async postLikesAlbumHandler(request, h) {
    const { id } = request.params;
    const { userId: credentialId } = request.auth.credentials;

    await this.service.getAlbumById(id);

    const like = await this.service.addLikeAndDislikeAlbum(id, credentialId);

    return h.response({
      status: 'success',
      message: `Berhasil ${like} Album`,
    }).code(201);
  }

  async getLikesAlbumByIdhandler(request, h) {
    const { id } = request.params;
    const { likes, source } = await this.service.getLikesAlbumById(id);

    const response = h.response({
      status: 'success',
      data: {
        likes,
      },
    });

    response.header('X-Data-Source', source);
    return response;
  }

  async deleteLikesAlbumByIdhandler(request, h) {
    const { id } = request.params;
    const { userId: credentialId } = request.auth.credentials;

    await this.service.getAlbumById(id);

    await this.service.unLikeAlbumById(id, credentialId);

    return h.response({
      status: 'success',
      message: 'Album batal disukai',
    }).code(200);
  }
}

module.exports = AlbumsHandler;
