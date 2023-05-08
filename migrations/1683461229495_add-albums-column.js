/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
    pgm.addColumns('albums', {
        cover_url: {
            type: 'TEXT',
            default: null,
        },
    });
};


