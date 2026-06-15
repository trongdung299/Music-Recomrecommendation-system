import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

const PersonalizeContext = createContext(null);

function toggleInSet(set, key) {
  const next = new Set(set);
  if (next.has(key)) next.delete(key);
  else next.add(key);
  return next;
}

export function PersonalizeProvider({ children }) {
  const [selectedGenres, setSelectedGenres] = useState(
    () => new Set([])
    // new Set(["all", "hip_hop"])
  );
  const [selectedArtists, setSelectedArtists] = useState(
    () => new Set([])
    // new Set(["billie-eilish", "taylor-swift"])
  );
  const [selectedSongs, setSelectedSongs] = useState(
    () => new Set([])
    // new Set(["midnight-city"])
  );

  const toggleGenre = useCallback((key) => {
    setSelectedGenres((prev) => toggleInSet(prev, key));
  }, []);

  const toggleArtist = useCallback((key) => {
    setSelectedArtists((prev) => toggleInSet(prev, key));
  }, []);

  const toggleSong = useCallback((key) => {
    setSelectedSongs((prev) => toggleInSet(prev, key));
  }, []);

  const value = useMemo(
    () => ({
      selectedGenres,
      selectedArtists,
      selectedSongs,
      setSelectedGenres,
      setSelectedArtists,
      setSelectedSongs,
      toggleGenre,
      toggleArtist,
      toggleSong,
    }),
    [
      selectedGenres,
      selectedArtists,
      selectedSongs,
      toggleGenre,
      toggleArtist,
      toggleSong,
    ]
  );

  return (
    <PersonalizeContext.Provider value={value}>
      {children}
    </PersonalizeContext.Provider>
  );
}

export function usePersonalize() {
  const ctx = useContext(PersonalizeContext);
  if (!ctx)
    throw new Error("usePersonalize must be used within PersonalizeProvider");
  return ctx;
}
