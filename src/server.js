require('dotenv').config();
const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');
const Inert = require('@hapi/inert');
const ClientError = require('./exceptions/ClientError');
const albums = require('./api/album');
const { AlbumsValidator } = require('./validator/albums');
const AlbumsService = require('./services/postgres/AlbumsService');

const songs = require('./api/song');
const { SongsValidator } = require('./validator/songs');
const SongsService = require('./services/postgres/SongsService');

/* Users */
const users = require('./api/users');
const { UsersValidator } = require('./validator/users');
const UsersService = require('./services/postgres/UsersServices');

/* Collaborations */
const collaborations = require('./api/collaborations');
const { CollaborationsService } = require('./services/postgres/CollaborationService');
const CollaborationsValidator = require('./validator/collaboration');

/* Authentications */
const authentications = require('./api/authentications');
const { AuthenticationsService } = require('./services/postgres/AuthenticationsService');
const TokenJWT = require('./token/jwtToken');
const AuthenticationsValidator = require('./validator/authentications');

/* Playlists */
const playlists = require('./api/playlists');
const { PlaylistsService } = require('./services/postgres/PlaylistsService');
const PlaylistsValidator = require('./validator/playlists');

const init = async () => {
  const albumsService = new AlbumsService();
  const songsService = new SongsService();
  const usersService = new UsersService();
  const collaborationsService = new CollaborationsService();
  const authenticationsService = new AuthenticationsService();
  const playlistsService = new PlaylistsService(collaborationsService);

  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  server.ext('onPreResponse', (request, h) => {
    const { response } = request;

    if (response instanceof Error) {
      if (response instanceof ClientError) {
        const newResponse = h.response({
          status: 'fail',
          message: response.message,
        });
        newResponse.code(response.statusCode);
        return newResponse;
      }
      if (!response.isServer) {
        return h.continue;
      }

      const newResponse = h.response({
        status: 'error',
        message: 'terjadi kegagalan pada server',
      });
      newResponse.code(500);
      console.error(`detail: ${response.message}`);
      return newResponse;
    }

    return h.continue;
  });

  await server.register([
    {
      plugin: Jwt,
    },
    {
      plugin: Inert,
    },
  ]);

  server.auth.strategy('openmusic_jwt', 'jwt', {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE,
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        userId: artifacts.decoded.payload.userId,
      },
    }),
  });


  await server.register([{
    plugin: albums,
    options: {
      service: albumsService,
      validator: AlbumsValidator,
    },
  },
  {
    plugin: songs,
    options: {
      service: songsService,
      validator: SongsValidator,
    },
  },
  {
    plugin: users,
    options: {
      service: usersService,
      validator: UsersValidator,
    },
  },
  {
    plugin: collaborations,
    options: {
      collaborationsService,
      playlistsService,
      validator: CollaborationsValidator,
    },
  },
  {
    plugin: authentications,
    options: {
      usersService,
      authenticationsService,
      tokenManager: TokenJWT,
      validator: AuthenticationsValidator,
    },
  },
  {
    plugin: playlists,
    options: {
      service: playlistsService,
      validator: PlaylistsValidator,
    },
  },
  ]);

  await server.start();
  console.log(`Server on => ${server.info.uri}`);
};

init();
