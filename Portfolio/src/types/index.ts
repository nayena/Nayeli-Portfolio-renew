export interface NowPlayingData {
  isPlaying?: boolean;
  item: NowPlayingItem | null;
}

interface NowPlayingItem {
  album: string;
  album_image: string | null;
  artists: string[];
  name: string;
  url?: string;
}

export interface TopTracksData {
  tracks: Track[];
}

interface Track {
  id: string;
  name: string;
  artist: string;
  album: string;
  album_image: string | null;
  playcount?: string;
  url?: string;
  rank?: number;
}

export interface LeetCodeData {
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
  totalSolved: number;
  submissionCalendar: {
    [timestamp: string]: number;
  };
}
