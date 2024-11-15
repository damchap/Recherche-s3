const fs = require('fs');

function extractStreamData() {
  const streamingDirectoryPath = '/Users/louisalleyne/Downloads/Spotify Extended Streaming History/history';
  const streamingDirectory = fs.readdirSync(streamingDirectoryPath);

  const totalStreams = [];

  for (const streamPath of streamingDirectory) {
    const streams = JSON.parse(fs.readFileSync(`${streamingDirectoryPath}/${streamPath}`));
    for (const s of streams) {
      if (s.spotify_track_uri !== null) {
        const idRegex = /([A-Za-z0-9]+)/g;
        const id = s.spotify_track_uri.match(idRegex)[2];
        const existingStream = totalStreams.find(existingStream => existingStream.id === id)
        if (existingStream) {
          existingStream.ms_played += s.ms_played;
          existingStream.stream_count++;
        } else {
          totalStreams.push({
            id: id,
            ms_played: s.ms_played,
            stream_count: 1
          });
        }
      }
    }
  }

  fs.writeFileSync('./src/data/streams.json', JSON.stringify(totalStreams, null , 2));
}

function addStreamData() {
  const songs = JSON.parse(fs.readFileSync(`/Users/louisalleyne/Downloads/Spotify Extended Streaming History/songs.json`));
  const streams = JSON.parse(fs.readFileSync(`./src/data/streams.json`));
  const totalArtists = [];
  for (const song of songs) {
    const stream = streams.find(s => s.id === song.id);
    for (const artist of song.artists) {
      const existingArtist = totalArtists.find(a => a.id === artist.id);
      if (existingArtist) {
        existingArtist.ms_played += stream.ms_played;
        existingArtist.stream_count += stream.stream_count;
      } else {
        totalArtists.push({
          id: artist.id,
          name: artist.name,
          ms_played: stream.ms_played,
          stream_count: 1
        });
      }
    }
  }
  fs.writeFileSync('./src/data/artists.json', JSON.stringify(totalArtists.sort((a, b) => b.ms_played - a.ms_played), null , 2));
}

addStreamData();