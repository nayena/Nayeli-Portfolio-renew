// Last.fm API - Get top tracks
const LASTFM_API_KEY = process.env.LASTFM_API_KEY;
const LASTFM_USERNAME = process.env.LASTFM_USERNAME;

export default async function handler(req, res) {
  if (!LASTFM_API_KEY || !LASTFM_USERNAME) {
    return res.status(500).json({
      error: "Missing Last.fm configuration",
      details: "Set LASTFM_API_KEY and LASTFM_USERNAME in environment variables",
    });
  }

  try {
    // Get top tracks from the last 7 days
    const response = await fetch(
      `https://ws.audioscrobbler.com/2.0/?method=user.gettoptracks&user=${LASTFM_USERNAME}&api_key=${LASTFM_API_KEY}&format=json&period=7day&limit=5`
    );

    if (!response.ok) {
      throw new Error(`Last.fm API error: ${response.status}`);
    }

    const data = await response.json();
    const topTracks = data?.toptracks?.track || [];

    const tracks = topTracks.map((track, index) => {
      const images = track.image || [];
      const albumImage = images.find((img) => img.size === "large")?.["#text"] ||
                         images.find((img) => img.size === "medium")?.["#text"] ||
                         images[0]?.["#text"] ||
                         null;

      return {
        id: `${track.name}-${track.artist?.name || track.artist}`,
        name: track.name,
        artist: track.artist?.name || track.artist,
        album: track.album?.["#text"] || "",
        album_image: albumImage,
        playcount: track.playcount,
        url: track.url,
        rank: index + 1,
      };
    });

    return res.status(200).json({ tracks });
  } catch (error) {
    console.error("Last.fm error:", error);
    return res.status(500).json({
      error: "Failed to fetch from Last.fm",
      details: error.message,
    });
  }
}

