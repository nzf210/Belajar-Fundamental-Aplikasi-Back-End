const AlbumsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'albums',
  version: '1.0.0',
  register: async (server, { service, validator, songsService, storageService, uploadsValidator }) => {
    const albumsHandler = new AlbumsHandler(
      service,
      validator,
      songsService,
      storageService,
      uploadsValidator
    );
    server.route(routes(albumsHandler));
  },
};
