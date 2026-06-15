import { useState, useRef, useEffect,useContext } from "react";
import PlaySongContext from "../context/PlaySongContext";
import AuthContext from "../AuthProvider";
import { useNavigate } from "react-router-dom";
const ALL_SONGS = [
  { title: "Hoa Sứ Nhà Nàng", sub: "Song • Anh Khang", emoji: "🌸", type: "song" },
  { title: "Hoa Sứ Nhà Nàng (Lofi)", sub: "Song • KProx, H2K", emoji: "🎵", type: "song" },
  { title: "Hoa Sứ Nhà Nàng", sub: "Song • Quang Lê", emoji: "🌺", type: "song" },
  { title: "Hoa sứ nhà nàng", sub: "Song • Dan Nguyen", emoji: "🎶", type: "song" },
  { title: "Đập Vỡ Cây Đàn", sub: "Song • Quang Lê", emoji: "🎸", type: "song" },
  { title: "Hoa Sứ Nhà Nàng", sub: "Song • Phương Ý", emoji: "🌼", type: "song" },
  { title: "Hoa sứ trắng ngần...", sub: "Lyrics match • Anh Khang", emoji: "📝", type: "lyrics" },
  { title: "Nàng ơi hoa sứ rơi", sub: "Lyrics match • Dan Nguyen", emoji: "📝", type: "lyrics" },
];

const FILTERS = [
  { key: "all", label: "Tìm tất cả", icon: "⊞" },
  { key: "name", label: "Tìm theo tên bài / Ca sĩ", icon: "♪" },
  { key: "lyric", label: "Tìm theo lời bài hát", icon: "📄" },
];

function normalize(str) {
  return str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

export default function Search() {
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("song");
  const [activeIdx, setActiveIdx] = useState(-1);
  const [open, setOpen] = useState(false);
  const [songs, setSongs] = useState([]);
  const inputRef = useRef(null);
  const wrapperRef = useRef(null);
  const {playSong,setplaySong}=useContext(PlaySongContext)
  const { currentUser, setcurrentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const filtered =[];
  //  query.trim()
  //   ? ALL_SONGS.filter((s) => {
  //     const matchFilter = activeFilter === "all" || s.type === activeFilter;
  //     const q = normalize(query);
  //     const matchText =
  //       normalize(s.title).includes(q) || normalize(s.sub).includes(q);
  //     return matchFilter && matchText;
  //   })
  //   : [];

  useEffect(() => {
    setActiveIdx(-1);
    setOpen(query.trim().length > 0);
  }, [query, activeFilter]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const executeSearch = async () => {
    const queryText = query.trim();
    if (!queryText) {

      return;
    }
    try {
      const response = await fetch(`http://127.0.0.1:8000/backend/api/search?query=${encodeURIComponent(queryText)}&search_type=${activeFilter}`);
      const results = await response.json();
      setSongs(results);

    } catch (error) {
      console.error("Lỗi kết nối Backend:", error);
    }
  }

  function handleKeyDown(e) {
    if (!open) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIdx((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && activeIdx >= 0) {
      console.log(activeIdx)
      setQuery(filtered[activeIdx].title);
      executeSearch();
      setOpen(false);
    } else if (e.key === "Escape") {
      setOpen(false);
      inputRef.current?.blur();
    }
  }

  function selectResult(song) {
    setQuery(song.title);
    setOpen(false);
  }

  function clearQuery() {
    setQuery("");
    setOpen(false);
    inputRef.current?.focus();
  }
   const update_User_history = async(data)=>{
            const dt=JSON.stringify(data)
            const fetchOption={
                method:'post',
                headers:{
                    'Accept':'application/json',
                    'Content-Type':'application/json',
                },
                body:dt,
            }
            try{
                const response=await fetch('http://localhost:8080/user/update-user-history',fetchOption);
                const result=await response.json();
                if (response.ok)
                {
                    console.log('Update user history successfully.')
                }
            } catch(error){
                console.log(error)
                console.error('Error when update user history', error);
            }
    }
  return (
    <div className="flex items-center gap-2 flex-wrap justify-end" ref={wrapperRef}>
      {/* Filter tabs */}
      <div className="flex items-center gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => {
              setActiveFilter(f.key);
              inputRef.current?.focus();
            }}
            className={[
              "flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium border transition-colors whitespace-nowrap",
              activeFilter === f.key
                ? "bg-[#1db954] border-[#1db954] text-black hover:bg-[#1ed760] hover:border-[#1ed760]"
                : "bg-[#1f1f1f] border-[#555] text-white hover:bg-[#2a2a2a] hover:border-[#888]",
            ].join(" ")}
          >
            <span>{f.icon}</span>
            {f.label}
          </button>
        ))}
      </div>

      {/* Search input + dropdown */}
      <div className="relative w-60">
        {/* Input */}
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#b3b3b3] text-base pointer-events-none">
            🔍
          </span>
          <input
            ref={inputRef}
            type="text"
            value={query}
            placeholder="Search for songs, artists..."
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => query.trim() && setOpen(true)}
            onKeyDown={e => e.key === 'Enter' && executeSearch()}
            className="w-full bg-[#1f1f1f] border border-[#333] rounded-full py-2 pl-9 pr-9 text-sm text-white placeholder-[#7a7a7a] outline-none focus:border-white transition-colors"
          />
          {query && (
            <button
              onClick={clearQuery}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#b3b3b3] hover:text-white text-base leading-none"
              aria-label="Clear"
            >
              ✕
            </button>
          )}
        </div>

        {/* Dropdown */}
        {open && (
          <div className="absolute top-[calc(100%+6px)] right-0 w-[310px] bg-[#282828] rounded-lg overflow-hidden z-50 shadow-[0_8px_24px_rgba(0,0,0,0.5)]">
            {/* Nav hint */}
            <div className="flex items-center gap-1.5 px-3 py-2 text-[11px] text-[#b3b3b3] border-b border-[#3a3a3a]">
              <kbd className="bg-[#3a3a3a] rounded px-1 py-0.5 text-[11px]">↑</kbd>
              <kbd className="bg-[#3a3a3a] rounded px-1 py-0.5 text-[11px]">↓</kbd>
              <span>Navigate</span>
              <kbd className="bg-[#3a3a3a] rounded px-1 py-0.5 text-[11px] ml-1">Enter</kbd>
              <span>Search</span>
            </div>

            {/* Results */}
            {songs && songs.length === 0 ? (
              <div className="px-3 py-5 text-sm text-[#b3b3b3] text-center">
                No results found
              </div>
            ) : (
              songs.map((song, i) => (
                <div
                  key={i}
                  className={[
                    "flex items-center gap-2.5 px-3 py-2 cursor-pointer transition-colors",
                    activeIdx === i ? "bg-[#3a3a3a]" : "hover:bg-[#3a3a3a]",
                  ].join(" ")}
                  onMouseEnter={() => setActiveIdx(i)}
                  onClick={() => selectResult(song)}
                >
                  <div className="w-11 h-11 rounded flex items-center justify-center text-xl bg-[#2a2a2a] shrink-0">
                    {"🎵"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">
                      {song.track_name}
                    </p>
                    <p className="text-xs text-[#b3b3b3] truncate">{song.artist_name}</p>
                  </div>
                  {/* <button
                    onClick={(e) => e.stopPropagation()}
                    className="w-6 h-6 rounded-full border border-[#555] text-[#b3b3b3] hover:text-white hover:border-white flex items-center justify-center shrink-0 transition-colors text-base leading-none"
                    aria-label="Add to queue"
                  >
                    +
                  </button> */}
                  <button
                    className="absolute bottom-2 right-2 bg-primary text-black rounded-full p-3 shadow-lg opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 flex items-center justify-center"
                    data-nav-type="song"
                    data-id="midnight-city"
                    aria-label="Play song"
                    onClick={(e) => {
                      if(currentUser){
                           const data = {
                        "user_id": currentUser.user_id,
                        "item_id": it.trackid,
                        "type": 'track',
                        "time": `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()}`
                      }
                      update_User_history(data)
                      setplaySong(it)
                      navigate('/play')
                      }
                    
                    }}>
                    <span className="material-symbols-outlined fill-1" >play_arrow</span>
                  </button>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}