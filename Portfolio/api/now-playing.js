// Last.fm API - Get recent/now playing track
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
    const response = await fetch(
      `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${LASTFM_USERNAME}&api_key=${LASTFM_API_KEY}&format=json&limit=1`
    );

    if (!response.ok) {
      throw new Error(`Last.fm API error: ${response.status}`);
    }

    const data = await response.json();
    const tracks = data?.recenttracks?.track;

    if (!tracks || tracks.length === 0) {
      return res.status(200).json({ item: null });
    }

    const track = tracks[0];
    const isNowPlaying = track["@attr"]?.nowplaying === "true";

    // Get album image (Last.fm provides multiple sizes)
    const images = track.image || [];
    const albumImage = images.find((img) => img.size === "large")?.["#text"] ||
                       images.find((img) => img.size === "medium")?.["#text"] ||
                       images[0]?.["#text"] ||
                       null;

    return res.status(200).json({
      isPlaying: isNowPlaying,
      item: {
        name: track.name,
        artists: [track.artist?.["#text"] || track.artist],
        album: track.album?.["#text"] || "Unknown Album",
        album_image: albumImage,
        url: track.url,
      },
    });
  } catch (error) {
    console.error("Last.fm error:", error);
    return res.status(500).json({
      error: "Failed to fetch from Last.fm",
      details: error.message,
    });
  }
}

