import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { SONGS } from "../data/catalog";

const PlaylistContext = createContext(null);

export function PlaylistProvider({ children }) {
  const [playlists, setPlaylists] = useState(() => [
    {
      id: "pl-seed-chill",
      name: "Chill Vibes",
      songIds: ["midnight-city", "starboy"],
    },
    {
      id: "pl-seed-drive",
      name: "Night Drive",
      songIds: ["blinding-lights", "levitating"],
    },
  ]);

  const [likedSongIds, setLikedSongIds] = useState(
    () =>
      new Set(["midnight-city", "blinding-lights", "save-your-tears"])
  );

  const [followedArtistIds, setFollowedArtistIds] = useState(() => new Set());

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [addModalPrefillIds, setAddModalPrefillIds] = useState([]);

  const openAddToPlaylist = useCallback((songId) => {
    setAddModalPrefillIds(songId ? [songId] : []);
    setAddModalOpen(true);
  }, []);

  const closeAddToPlaylist = useCallback(() => {
    setAddModalOpen(false);
    setAddModalPrefillIds([]);
  }, []);

  const createPlaylist = useCallback((name) => {
    const trimmed = (name || "").trim();
    if (!trimmed) return null;
    const id = `pl-${Date.now()}`;
    setPlaylists((prev) => [...prev, { id, name: trimmed, songIds: [] }]);
    return id;
  }, []);

  const addSongsToPlaylist = useCallback((playlistId, songIds) => {
    const add = (songIds || []).filter(Boolean);
    if (!add.length) return;
    setPlaylists((prev) =>
      prev.map((pl) =>
        pl.id === playlistId
          ? {
              ...pl,
              songIds: [...new Set([...pl.songIds, ...add])],
            }
          : pl
      )
    );
  }, []);

  const toggleLikeSong = useCallback((songId) => {
    if (!songId || !SONGS[songId]) return;
    setLikedSongIds((prev) => {
      const next = new Set(prev);
      if (next.has(songId)) next.delete(songId);
      else next.add(songId);
      return next;
    });
  }, []);

  const toggleFollowArtist = useCallback((artistId) => {
    if (!artistId) return;
    setFollowedArtistIds((prev) => {
      const next = new Set(prev);
      if (next.has(artistId)) next.delete(artistId);
      else next.add(artistId);
      return next;
    });
  }, []);

  const isFollowingArtist = useCallback(
    (artistId) => followedArtistIds.has(artistId),
    [followedArtistIds]
  );

  const value = useMemo(
    () => ({
      playlists,
      likedSongIds,
      followedArtistIds,
      addModalOpen,
      addModalPrefillIds,
      openAddToPlaylist,
      closeAddToPlaylist,
      createPlaylist,
      addSongsToPlaylist,
      toggleLikeSong,
      toggleFollowArtist,
      isFollowingArtist,
    }),
    [
      playlists,
      likedSongIds,
      followedArtistIds,
      addModalOpen,
      addModalPrefillIds,
      openAddToPlaylist,
      closeAddToPlaylist,
      createPlaylist,
      addSongsToPlaylist,
      toggleLikeSong,
      toggleFollowArtist,
      isFollowingArtist,
    ]
  );

  return (
    <PlaylistContext.Provider value={value}>{children}</PlaylistContext.Provider>
  );
}

export function usePlaylist() {
  const ctx = useContext(PlaylistContext);
  if (!ctx) throw new Error("usePlaylist must be used within PlaylistProvider");
  return ctx;
}
