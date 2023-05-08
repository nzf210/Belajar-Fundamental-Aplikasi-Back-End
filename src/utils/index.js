const mapDbAlbumModel = ({
  id,
  name,
  year,
  songs,
  cover_url,
  inserted_at,
  updated_at,
}) => ({
  id,
  name,
  year,
  songs,
  coverUrl: cover_url,
  insertedAt: inserted_at,
  updatedAt: updated_at,
});
const mapDbSongModel = ({
  id,
  title,
  year,
  performer,
  genre,
  duration,
  albumId,
  inserted_at,
  updated_at,
}) => ({
  id,
  title,
  year,
  performer,
  genre,
  duration,
  albumId,
  insertedAt: inserted_at,
  updatedAt: updated_at,
});

module.exports = { mapDbAlbumModel, mapDbSongModel };
