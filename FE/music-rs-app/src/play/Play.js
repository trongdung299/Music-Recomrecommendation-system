import { useContext, useEffect, useState } from "react";
import AppHeader from "../appheader/Header";
import Sidebar from "../appsidebar/Sidebar";
import { useLocation, useNavigate } from "react-router-dom";
import AuthContext from "../AuthProvider";
import AddSongButton from "../components/AddSongButton";
import PlaySongContext from "../context/PlaySongContext";
import SelectedPlayItemContext from "../context/SelectedPlayItemContext";
import AddSongsToPlaylistModal from "../components/AddSongsToPlaylistModal";
export default function Play() {
    const location = useLocation();
    const id = new URLSearchParams(location.search).get("id");
    const displayId = id ? id.replace(/-/g, " ") : null;
    const { currentUser, setcurrentUser } = useContext(AuthContext);
    const { playSong, setplaySong } = useContext(PlaySongContext);
    const { selectedPlayItem, setSelectedPlayItem } = useContext(SelectedPlayItemContext)
    const [tracks, setTracks] = useState([])
    const [isOpen, setisOpen] = useState(false)
    const [song, setSong] = useState()
    const [current_index, setCurrentIndex] = useState(0)
    const navigate = useNavigate();
    const defaultImage="https://lh3.googleusercontent.com/aida-public/AB6AXuBNZNtmqrTwWcdGCggCCAkCrzV7LeofIYJ0AIvLiMNHsaWochZNsY51WhRGzWS-Rz4CwGLh2Tshu0bhBqzhXF_dq67dbU5CubC5mkjMubPBy05MZIWP7T0h7QkB5xPOI0mjGqVcMCH_3pI3Y4MHt7c0BlBF4anbA1EB37MLU-eU1AZqpyKw-YPrlwAW1XXO2EaybQjNGG0RiUza4dqlR5eiFotjMgYR9_-j6drDtpfZjclJcLqtsDDLhLROksnmEhqdYyNVw9VnrHA"
    useEffect(() => {
        if (!currentUser) {
            navigate('/login')
        }
        const fetchArtistSong = async () => {
            const data = {
                'artist_id': selectedPlayItem.item.artistid ? selectedPlayItem.item.artistid : selectedPlayItem.item.artist_id
            }
            const fetchOption = {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            }
            try {
                const response = await fetch('http://localhost:8080/track/track-by-artist', fetchOption)
                const result = await response.json();
                if (response.ok) {
                    setTracks(result);
                } else {
                    setTracks(null);
                }
            } catch (error) {
                console.error('Error fetching data', error);
            }


        }
        const fetchAlbumSong = async () => {
            const data = {
                'album_id': selectedPlayItem.item.albumid
            }
            console.log(data)
            const fetchOption = {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            }
            try {
                const response = await fetch('http://localhost:8080/track/track-by-album', fetchOption)
                const result = await response.json();
                if (response.ok) {
                    setTracks(result);

                } else {
                    setTracks(null);
                }
            } catch (error) {
                console.error('Error fetching data', error);
            }
        }
        const fetchPlaylistSong = async () => {
            const data = {
                'playlist_id': selectedPlayItem.item.id
            }
            const fetchOption = {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            }
            try {
                const response = await fetch('http://localhost:8080/track/track-by-playlist', fetchOption)
                const result = await response.json();
                if (response.ok) {
                    setTracks(result);
                } else {
                    setTracks(null);
                }
            } catch (error) {
                console.error('Error fetching data', error);
            }
        }
        if (selectedPlayItem && selectedPlayItem.type == 'artist') {
            fetchArtistSong();
        }
        if (selectedPlayItem && selectedPlayItem.type == "album") {
            fetchAlbumSong();
        }
        if (selectedPlayItem && selectedPlayItem.type == "playlist") {
            fetchPlaylistSong();
        }
        if(!playSong){
            setplaySong(tracks[0])
        }
    }, [])
    const update_User_history = async (data) => {
        const dt = JSON.stringify(data)
        const fetchOption = {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: dt,
        }
        try {
            const response = await fetch('http://localhost:8080/user/update-user-history', fetchOption);
            const result = await response.json();
            if (response.ok) {
                console.log('Update user history successfully.')
            }
        } catch (error) {
            console.log(error)
            console.error('Error when update user history', error);
        }
    }
    const songIdForAdd = id || "midnight-city";
    return (
        <>
            <div className="relative flex h-screen w-full overflow-hidden bg-background-dark">
                {/* <!-- Top Navigation --> */}
                {/* <div id="app-sidebar"></div> */}
                <Sidebar />
                {/* <!-- Main Player Area --> */}
                <div className="flex-1 flex flex-col h-full overflow-hidden">
                    {/* <!-- Top Search/Profile Bar --> */}
                    {/* <header id="app-header"></header> */}
                    <AppHeader />
                    <main className="flex-1 flex flex-col md:flex-row overflow-hidden">
                        {/* <!-- Left: Album Art and Queue --> */}
                        <section className="flex-[1.2] flex flex-col p-8 gap-8 overflow-y-auto items-center">
                            <div className="flex flex-col xl:flex-row gap-8 items-center justify-center">
                                <div className="relative group aspect-square w-full max-w-[400px] rounded-xl overflow-hidden shadow-2xl shadow-primary/20">
                                    <img alt="Album Art" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAOV9YrTtOZRxzSFQ0a2R3fLKtlwb5F6YqiF6poqsdBqTK7mEKz94_4aghH3ixBQHs5lIB06_pqM4R17_bd7mNgvqNWf2SWAvfLYbSZVJkJmPverWWjpvm1JDsxM9YPv5JjknkLt-vjUb8dkjxMrQ_4rLz4FfSU_GrJE6ozeKQTEa27xgfsRaUBz3_p5fjvIHd0mzgdsAVeKW5e6AtiivJ-oTzWR9BdzXyVrAu3yCPC2JatRXmEZU98SgaXZboEech-0vzrc4ZhKQg" />
                                </div>
                                <div className="flex flex-col gap-2 text-center">
                                    <h1 className="text-4xl xl:text-5xl font-bold tracking-tight text-white">Midnight City Echoes</h1>
                                    <p className="text-xl text-primary font-medium">Neon Synthesis • Electric Dreams (2024)</p>
                                    {id && <p className="text-sm text-white/70 mt-2">Selected: {displayId}</p>}
                                    <div className="flex gap-4 mt-4 justify-center items-center flex-wrap">
                                        {/* <button type="button" onClick={() => openAddToPlaylist(songIdForAdd)} className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors text-sm font-medium text-white">
<span className="material-symbols-outlined text-lg">add_circle</span> Save to Library
                        </button> */}
                                        <button className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors text-sm font-medium">
                                            <span className="material-symbols-outlined text-lg">share</span> Share
                                        </button>
                                    </div>
                                    <div className="mt-8 w-full max-w-2xl">
                                        <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-4">Up Next</h3>
                                        <div className="space-y-2 text-left">
                                            {tracks && tracks.slice(current_index, current_index + 2).map((it) => (

                                                <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-white/5 transition-colors group">
                                                    <img alt="Queue Art" className="size-12 rounded object-cover" src={it.image ? it.image :defaultImage} />
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-semibold truncate text-slate-100">{it.track_name}</p>
                                                        <p className="text-xs text-slate-400 truncate">{it.t_name}</p>
                                                    </div>
                                                    <button className="opacity-0 group-hover:opacity-100 transition-opacity size-8 rounded-full bg-primary text-black flex items-center justify-center"
                                                        type="button"
                                                        data-nav-type="song"
                                                        data-id="ultraviolet-horizon"
                                                        aria-label="Play song"
                                                        onClick={(e) => {
                                                            const data = {
                                                                "user_id": currentUser.user_id,
                                                                "item_id": it.trackid,
                                                                "type": 'track',
                                                                "time": `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()}`
                                                            }
                                                            update_User_history(data)
                                                            setplaySong(it)
                                                        }}
                                                    >
                                                        <span className="material-symbols-outlined fill-1 text-lg">play_arrow</span>
                                                    </button>
                                                    <AddSongButton song={it} setSong={setSong} setisOpen={setisOpen} layout="inline" />
                                                    <span className="text-xs text-slate-500">{Math.round(it.duration_ms / 60000)}:{('0' + Math.round(((it.duration_ms) % 60000) / 1000)).slice(-2)}</span></div>

                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </main>
                    {playSong && <footer className="fixed bottom-0 left-64 right-0 h-24 bg-background-dark border-t border-white/5 px-8 flex flex-col justify-center z-40">
                        <div className="w-full flex items-center gap-4 mb-2">
                            <span className="text-xs font-medium text-slate-400 min-w-[40px] text-right">1:45</span>
                            <div className="relative h-1 flex-1 bg-white/10 rounded-full group cursor-pointer">
                                <div className="absolute top-0 left-0 h-full w-[45%] bg-primary rounded-full group-hover:bg-primary/80 transition-all"></div>
                            </div>
                            <span className="text-xs font-medium text-slate-400 min-w-[40px]">{playSong && Math.round(playSong.duration_ms / 60000)}:{('0' + Math.round(((playSong.duration_ms) % 60000) / 1000)).slice(-2)}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 w-1/4">
                                <img alt="Mini Art" className="size-10 rounded object-cover" src={playSong.image ? playSong.image : defaultImage} />
                                <div className="flex flex-col overflow-hidden">
                                    <span className="text-sm font-bold text-white truncate">{playSong && playSong.track_name}</span>
                                    <span className="text-xs text-slate-400 truncate">{playSong && playSong.t_name}</span>
                                </div>
                            </div>
                            <div className="flex-1 flex items-center justify-center gap-6">
                                <button className="material-symbols-outlined text-slate-400 hover:text-white">shuffle</button>
                                <button
                                    className="material-symbols-outlined text-2xl text-white"
                                    onClick={(e) => {
                                        if (current_index > 0) {
                                            setCurrentIndex(current_index - 1)
                                        } else {
                                            setCurrentIndex(0)
                                        }
                                        setplaySong(tracks[current_index])
                                        const data = {
                                            "user_id": currentUser.user_id,
                                            "item_id": playSong.trackid,
                                            "type": 'track',
                                            "time": `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()}`
                                        }
                                        update_User_history(data)
                                    }}
                                >skip_previous</button>
                                <button className="size-10 rounded-full bg-primary text-black flex items-center justify-center hover:scale-105 transition-transform">
                                    <span className="material-symbols-outlined text-2xl fill-1">pause</span>
                                </button>
                                <button className="material-symbols-outlined text-2xl text-white"
                                    onClick={(e) => {
                                        if (current_index < tracks.length)
                                            setCurrentIndex(current_index + 1)
                                        setplaySong(tracks[current_index])
                                        const data = {
                                            "user_id": currentUser.user_id,
                                            "item_id": playSong.trackid,
                                            "type": 'track',
                                            "time": `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()}`
                                        }
                                        update_User_history(data)
                                    }}
                                >skip_next</button>
                                <button className="material-symbols-outlined text-slate-400 hover:text-white">repeat</button>
                            </div>
                            <div className="flex items-center justify-end gap-3 w-1/4">
                                <button className="material-symbols-outlined text-slate-400 hover:text-white">lyrics</button>
                                <button className="material-symbols-outlined text-slate-400 hover:text-white">queue_music</button>
                                <div className="flex items-center gap-2 w-24">
                                    <span className="material-symbols-outlined text-slate-400 text-lg">volume_up</span>
                                    <div className="h-1 flex-1 bg-white/10 rounded-full">
                                        <div className="h-full w-[70%] bg-primary rounded-full"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </footer>}
                </div>
                {/* <!-- Player Controls Footer --> */}
            </div>
            <AddSongsToPlaylistModal open={isOpen} track={song} onClose={setisOpen} />
        </>)
}