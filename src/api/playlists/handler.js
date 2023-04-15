const autoBind = require('auto-bind');

class PlaylistsHandler {
    constructor(service, validator) {
        this.service = service;
        this.validator = validator;
        autoBind(this);
    }

    async postPlaylistHandler({ payload, auth }, h) {
        this.validator.validatePostPlaylistPayload(payload);
        const { name: playlistName } = payload;
        const { userId: owner } = auth.credentials;

        const playlistId = await this.service.addPlaylist(playlistName, owner);

        const response = h.response({
            status: 'success',
            data: {
                playlistId,
            },
        });
        response.code(201);
        return response;
    }

    async getPlaylistsHandler({ auth }) {
        const { userId: owner } = auth.credentials;

        const playlists = await this.service.getPlaylists(owner);

        return {
            status: 'success',
            data: {
                playlists,
            },
        };
    }

    async deletePlaylistByIdHandler({ params, auth }) {
        const { id: playlistId } = params;
        const { userId: owner } = auth.credentials;

        await this.service.verifyPlaylistOwner(playlistId, owner);
        await this.service.deletePlaylistById(playlistId);

        return {
            status: 'success',
            message: 'Playlist berhasil dihapus',
        };
    }

    async postSongIntoPlaylistHandler({ params, payload, auth }, h) {
        this.validator.validatePostSongIntoPlaylistPayload(payload);

        const { id: playlistId } = params;
        const { songId } = payload;
        const { userId } = auth.credentials;

        await this.service.verifyPlaylistAccess(playlistId, userId);
        await this.service.addSongToPlaylist(playlistId, songId);

        await this.service.addPlaylistActivity({
            playlistId, songId, userId, action: 'add',
        });

        const response = h.response({
            status: 'success',
            message: 'lagu berhasil ditambahkan ke playlist',
        });
        response.code(201);
        return response;
    }

    async getSongsFromPlaylistHandler({ params, auth }) {
        const { id: playlistId } = params;
        const { userId } = auth.credentials;

        await this.service.verifyPlaylistAccess(playlistId, userId);
        const playlist = await this.service.getSongsFromPlaylist(playlistId);

        return {
            status: 'success',
            data: {
                playlist,
            },
        };
    }

    async deleteSongFromPlaylistHandler({ params, payload, auth }) {
        this.validator.validateDeleteSongFromPlaylistPayload(payload);

        const { id: playlistId } = params;
        const { songId } = payload;
        const { userId } = auth.credentials;

        await this.service.verifyPlaylistAccess(playlistId, userId);
        await this.service.deleteSongFromPlaylist(playlistId, songId);

        // add data to playlist activity
        await this.service.addPlaylistActivity({
            playlistId, songId, userId, action: 'delete',
        });

        return {
            status: 'success',
            message: 'lagu berhasil dihapus dari playlist',
        };
    }

    async getPlaylistActivitiesHandler({ params, auth }) {
        const { id: playlistId } = params;
        const { userId } = auth.credentials;

        await this.service.verifyPlaylistAccess(playlistId, userId);

        const activities = await this.service.getPlaylistActivities(playlistId);

        return {
            status: 'success',
            data: {
                playlistId,
                activities,
            },
        };
    }
};

module.exports = PlaylistsHandler;