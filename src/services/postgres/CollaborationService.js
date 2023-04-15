const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class CollaborationsService {
    constructor() {
        this.pool = new Pool();
    }

    async addCollaboration(playlistId, userId) {
        try {
            const id = `collab-${nanoid(16)}`;

            const query = {
                text: 'INSERT INTO collaborations VALUES($1, $2, $3) RETURNING id',
                values: [id, playlistId, userId],
            };

            const { rows } = await this.pool.query(query);
            return rows[0].id;
        } catch {
            throw new NotFoundError('user tidak ditemukan.');
        }
    }

    async deleteCollaboration(playlistId, userId) {
        const query = {
            text: `DELETE FROM collaborations WHERE playlist_id = $1 AND user_id = $2 RETURNING id`,
            values: [playlistId, userId],
        };

        const { rowCount } = await this.pool.query(query);

        if (!rowCount) {
            throw new InvariantError('Gagal menghapus user collaborator');
        }
    }

    async verifyCollaborator(playlistId, userId) {
        const query = {
            text: `SELECT * FROM collaborations WHERE playlist_id = $1 AND user_id = $2`,
            values: [playlistId, userId],
        };

        const { rowCount } = await this.pool.query(query);
        if (!rowCount) {
            throw new InvariantError('kolaborasi gagal diverifikasi');
        }
    }
}

module.exports = { CollaborationsService };