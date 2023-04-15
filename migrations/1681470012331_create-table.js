/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {

    pgm.createTable('albums', {
        id: {
            type: 'VARCHAR(50)',
            primaryKey: true,
        },
        name: {
            type: 'TEXT',
            notNull: true,
        },
        year: {
            type: 'INTEGER',
            notNull: true,
        },
        created_at: {
            type: 'TEXT',
            notNull: true,
        },
        updated_at: {
            type: 'TEXT',
            notNull: true,
        },
    });

    pgm.createTable('songs', {
        id: {
            type: 'VARCHAR(50)',
            primaryKey: true,
        },
        title: {
            type: 'TEXT',
            notNull: true,
        },
        year: {
            type: 'INTEGER',
            notNull: true,
        },
        performer: {
            type: 'TEXT',
            notNull: true,
        },
        genre: {
            type: 'TEXT',
            notNull: true,
        },
        duration: {
            type: 'INTEGER',
        },
        created_at: {
            type: 'TEXT',
            notNull: true,
        },
        updated_at: {
            type: 'TEXT',
            notNull: true,
        },
        album_id: {
            type: 'TEXT',
            references: 'albums',
            referencesConstraintName: 'fk_songs.album_id:albums.id',
            onDelete: 'cascade',
        },
    });

    pgm.createTable('users', {
        id: {
            type: 'VARCHAR(50)',
            primaryKey: true,
        },
        username: {
            type: 'VARCHAR(50)',
            unique: true,
            notNull: true,
        },
        password: {
            type: 'TEXT',
            notNull: true,
        },
        fullname: {
            type: 'VARCHAR(50)',
            notNull: true,
        },
    });

    pgm.createTable('playlists', {
        id: {
            type: 'VARCHAR(50)',
            primaryKey: true,
        },
        name: {
            type: 'TEXT',
            notNull: true,
        },
        owner: {
            type: 'VARCHAR(50)',
            notNull: true,
            references: 'users',
            referencesConstraintName: 'fk_playlists.owner:users.id',
            onDelete: 'cascade',
            onUpdate: 'cascade',
        },
    });

    pgm.createTable('playlist_songs', {
        id: {
            type: 'VARCHAR(50)',
            primaryKey: true,
        },
        playlist_id: {
            type: 'VARCHAR(50)',
            notNull: true,
            references: 'playlists',
            referencesConstraintName: 'fk_playlist_songs.playlist_id:playlists.id',
            onDelete: 'cascade',
            onUpdate: 'cascade',
        },
        song_id: {
            type: 'VARCHAR(50)',
            notNull: true,
            references: 'songs',
            referencesConstraintName: 'fk_playlist_songs.song_id:songs.id',
            onDelete: 'cascade',
            onUpdate: 'cascade',
        },
    });

    pgm.createTable('token', {
        token: {
            type: 'TEXT',
            notNull: true,
        }
    });

};

exports.down = pgm => {
    pgm.dropTable('playlist_songs');
    pgm.dropTable('playlists');
    pgm.dropTable('users');
    pgm.dropTable('songs');
    pgm.dropTable('albums');
    pgm.dropTable('token');

};
