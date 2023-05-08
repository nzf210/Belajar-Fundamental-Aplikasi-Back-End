const ExportsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'exports',
  version: '1.0.0',
  register: async (server, { producerService, playlistsService, exportsValidator }) => {
    const exportsHandler = new ExportsHandler(
      producerService,
      playlistsService,
      exportsValidator,
    );

    server.route(routes(exportsHandler));
  },
};