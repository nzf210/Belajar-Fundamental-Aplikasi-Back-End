/* eslint-disable camelcase */

exports.shorthands = undefined;

// exports.up = (pgm) => {
//     pgm.createTable('user_album_likes', {
//         id: {
//             type: 'VARCHAR(50)',
//             primaryKey: true,
//         },
//         user_id: {
//             type: 'VARCHAR(50)',
//             notNull: true,
//             references: '"users"',
//             onDelete: 'cascade',
//         },
//         album_id: {
//             type: 'VARCHAR(50)',
//             notNull: true,
//             references: '"albums"',
//             onDelete: 'cascade',
//         },
//         created_at: {
//             type: 'TIMESTAMP',
//             notNull: true,
//             default: pgm.func('CURRENT_TIMESTAMP'),
//         },
//         updated_at: {
//             type: 'TIMESTAMP',
//             notNull: true,
//             default: pgm.func('CURRENT_TIMESTAMP'),
//         },
//     });
// };

// exports.down = (pgm) => {
//     pgm.dropTable('user_album_likes');
// };

exports.up = (pgm) => {
    pgm.createTable('user_album_likes', {
        id: {
            type: 'VARCHAR(50)',
            notNull: true,
            primaryKey: true,
        },
        user_id: {
            type: 'VARCHAR(50)',
            notNull: true,
            references: '"users"',
            onDelete: 'CASCADE',
        },
        album_id: {
            type: 'VARCHAR(50)',
            notNull: true,
            references: '"albums"',
            onDelete: 'CASCADE',
        },
    });
};

exports.down = (pgm) => {
    pgm.dropTable('user_album_likes');
};