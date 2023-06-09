const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const { mapDbSongModel } = require('../../utils');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class SongsService {
  constructor() {
    this._pool = new Pool();
  }

  async addSong({
    title, year, performer, genre, duration, albumId
  }) {
    const id = nanoid(16);
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;
    const query = {
      text: 'INSERT INTO songs VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id',
      values: [id, title, year, performer, genre, duration, insertedAt, updatedAt, albumId],
    };
    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Song gagal ditambahkan');
    }
    return result.rows[0].id;
  }

  async getSongs({ title, performer }) {
    try {
      let query;
      switch (true) {
        case title != null && performer != null:
          query = {
            text: 'SELECT id, title, performer from songs WHERE title ILIKE $1 AND performer ILIKE $2',
            values: [`%${title}%`, `%${performer}%`]
          }
          break;
        case title != null:
          query = {
            text: "SELECT id, title, performer from songs where title ILIKE $1;",
            values: [`%${title}%`]
          }
          break;
        case performer != null:
          query = {
            text: 'SELECT id, title, performer from songs where performer ILIKE $1;',
            values: [`%${performer}%`]
          }
          break;
        default:
          query = {
            text: 'SELECT id, title, performer from songs',
          }
          break;
      }
      const result = await this._pool.query(query);
      return result.rows;
    } catch (error) {
      throw new NotFoundError('Song tidak ditemukan');
    }
  }

  async getSongById(id) {
    const query = {
      text: 'SELECT * FROM songs WHERE id = $1',
      values: [id],
    };
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Lagu tidak ditemukan');
    }

    return result.rows.map(mapDbSongModel)[0];
  }

  async editSongById(id, {
    title, year, performer, genre, duration,
  }) {
    const updatedAt = new Date().toISOString();
    const query = {
      text: 'UPDATE songs SET title = $1, year = $2, performer = $3, genre = $4, duration = $5, updated_at = $6 WHERE id = $7 RETURNING id',
      values: [title, year, performer, genre, duration, updatedAt, id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Gagal memperbarui lagu. Id tidak ditemukan');
    }
  }

  async deleteSongById(id) {
    const query = {
      text: 'DELETE FROM songs WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Lagu gagal dihapus. Id tidak ditemukan');
    }
  }

  async getSongByAlbumId(albumId) {
    const query = {
      text: 'SELECT id, title, performer FROM songs WHERE "album_id" = $1',
      values: [albumId],
    };

    const result = await this._pool.query(query);

    return result.rows;
  }
}

module.exports = SongsService;
