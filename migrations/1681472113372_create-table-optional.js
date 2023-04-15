/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {


    pgm.createTable('collaborations', {
        id: {
            type: 'VARCHAR(50)',
            primaryKey: true,
        },
        playlist_id: {
            type: 'VARCHAR(50)',
            notNull: true,
            references: 'playlists',
            referencesConstraintName: 'fk_collaborations.playlist_id:playlists.id',
            onDelete: 'cascade',
            onUpdate: 'cascade',
        },
        user_id: {
            type: 'VARCHAR(50)',
            notNull: true,
            references: 'users',
            referencesConstraintName: 'fk_collaborations.user_id:users.id',
            onDelete: 'cascade',
            onUpdate: 'cascade',
        },
    });

    pgm.addConstraint('collaborations', 'unique_playlist_id_and_user_id', 'UNIQUE(playlist_id, user_id)');

    pgm.createTable('playlist_song_activities', {
        id: {
            type: 'VARCHAR(50)',
            primaryKey: true,
        },
        playlist_id: {
            type: 'VARCHAR(50)',
            notNull: true,
            references: 'playlists',
            referencesConstraintName: 'fk_playlist_song_activities.playlist_id:playlists.id',
        },
        song_id: {
            type: 'VARCHAR(50)',
            notNull: true,
        },
        user_id: {
            type: 'VARCHAR(50)',
            notNull: true,
        },
        action: {
            type: 'TEXT',
            notNull: true,
        },
        time: {
            type: 'DATE',
        },
    });
};

exports.down = pgm => {
    pgm.dropTable('collaborations');
    pgm.dropTable('playlist_song_activities');
};
