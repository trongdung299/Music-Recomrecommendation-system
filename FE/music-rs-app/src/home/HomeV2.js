import { useContext, useEffect, useState } from "react";
import AppHeader from "../appheader/Header";
import Sidebar from "../appsidebar/Sidebar";
import AuthContext from "../AuthProvider";
import { Link, useNavigate } from "react-router-dom";
import AddSongButton from "../components/AddSongButton";
import AddSongsToPlaylistModal from "../components/AddSongsToPlaylistModal";
import SelectedPlayItemContext from "../context/SelectedPlayItemContext";
import PlaySongContext from "../context/PlaySongContext";


export default function HomeV2() {
    const [dataTrackHomeTrend, setDataTHT] = useState([]);
    const [dataArtistHomeTrend, setDataAHT] = useState([]);
    const [dataTrackHomeRecommend, setDataTHR] = useState([]);
    const [dataTrackHomeRecommendAE, setDataTHRAE] = useState([]);
    const [dataArtistHomeRecommend, setDataAHR] = useState([]);
    const [dataAlbumRecommend, setDataAR] = useState([]);
    const [dataPlaylistRecommend, setDataPLR] = useState([]);
    const { currentUser, setcurrentUser } = useContext(AuthContext);
    const {selectedPlayItem,setSelectedPlayItem}=useContext(SelectedPlayItemContext)
    const {playSong,setplaySong}=useContext(PlaySongContext)
    const [isOpen,setisOpen]=useState(false)
    const [loading, setLoading] = useState(false);
    const [song,setSong]=useState()
    const navigate = useNavigate();
    const default_image="https://lh3.googleusercontent.com/aida-public/AB6AXuCw4oZwtGKxRHRrk99OCvAZIqla4Bb5yLqxsQTmbF2nlocrXKrmwzVpUXo_8csF-rVF6i2mpOx3RwtPCV5Bu_eY9W_limRvRhPR1HCcmqB-rzsx2WVuSyabrRjfMRnB10-xZ3UbnEhYYMcpHfjJeBF6kqu_VOqxvb20ZcCXJ0POYaL9Jyknst97GtIe6ztd8dBl2C5cGYOouN7YeVjyFwoem9YSVDvoBwR4aLo6s8bBGYC8Qxn6Hli5TAwO5USQshkq3cu4y1_mZJo";
    useEffect(() => {
        if (!currentUser) {
            navigate('/login')
        }
    })
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:8080/track/track-home-trend/5');
                const result = await response.json();
                setDataTHT(result);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        const fetchDataAHT = async () => {
            try {
                const response = await fetch('http://localhost:8080/artist/artist-home-trend/5');
                const result = await response.json();
                setDataAHT(result);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        const fetchDataTHR = async () => {
            try {
                const response = await fetch('http://127.0.0.1:8000/recommend-content-base/home?limit=20&user_id=6');
                const result = await response.json();
                setDataTHR(result);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        const fetchDataTHRAE = async () => {
            try {
                const response = await fetch('http://127.0.0.1:8000/recommend-content-base-vae/home?limit=20&user_id=6');
                const result = await response.json();
                setDataTHRAE(result);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };


        const requestData = {
            "history_track_ids": [
                "7EwrZIIzEEsht1Sb8K38fm",
                "4hcQI4HMvJmlMbpFOi0Wtv"
            ],
            "top_k": 10
        };

        // const fetchDataAHR = async () => {
        //     try {
        //         const response = await fetch(`http://127.0.0.1:8000/recommend/${currentUser.user_id}?top_k_users=20&top_k_cases=20&weight_case=0.7&weight_user=0.3`);
        //         const result = await response.json();
        //         // console.log("-----------------------",result["recommendations"])
        //         setDataAHR(result["recommendations"].slice(0,5));
        //     } catch (error) {
        //         console.error('Error fetching data:', error);
        //     }
        // };
        const fetchDataAHR = async () => {
            setLoading(true);
            try {
                // Thay đổi URL và PORT chính xác với nơi bạn chạy uvicorn (mặc định là localhost:8000)
                const response = await fetch('http://localhost:8000/recommend', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(requestData)
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const result = await response.json();
                
                // Theo cấu trúc RecommendResponse: kết quả trả về nằm trong key 'recommendations'
                if (result.status === "success") {
                    console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx")
                    setDataAHR(result['recommendations'].slice(0,5));
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };
        const fetchDataAR = async () => {
            try {
                const response = await fetch('http://localhost:8080/api/recommend/home?limit=5&maxPerArtist=3');
                const result = await response.json();
                setDataAR(result['data']);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        const fetchDataPLR = async () => {
             const data={
                            "user_id": currentUser.user_id,
                              "top_k": 5,
                            "interval": 10
                               }
            const fetchOption={
                    method:'post',
                    headers:{
                          'Accept':'application/json',
                          'Content-Type':'application/json',
                           }, 
                    body:JSON.stringify(data),
                }
            try {
                const response = await fetch('http://127.0.0.1:8000/recommend/playlist',fetchOption);
                const result = await response.json();
                if (response.ok){
                     setDataPLR(result);
                } else{
                    setDataPLR(null);
                }
                
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
       
        if(currentUser){
        fetchDataAHR();
        fetchData();
        fetchDataAHT();
        fetchDataTHR();
        fetchDataTHRAE();
        fetchDataAR();
        fetchDataPLR();
        }
        
    }, []);
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
        <div className="flex h-screen overflow-hidden">
            <Sidebar />
            {/* <div id="app-sidebar"></div> */}
            {/* !-- Main Content -- */}
            <main className="flex-1 flex flex-col bg-background-light dark:bg-background-dark overflow-y-auto custom-scrollbar relative">
                {/* <header id="app-header"><AppHeader/></header> */}
                <AppHeader />
                <div className="px-8 py-6 flex flex-col gap-10">
                    {/* !-- Trending Songs Section -- */}
                    <section>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold tracking-tight" >Bài hát thịnh hành</h2>
                            <Link className="text-sm font-bold text-slate-500 hover:underline dark:text-slate-400" to="/show_all?section=trending">Show all</Link>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                            {/* !-- Song Card 1 -- */}
                            {dataTrackHomeTrend.map((it) => (
                                <div className="bg-slate-200/50 dark:bg-white/5 p-4 rounded-xl hover:bg-slate-300/50 dark:hover:bg-white/10 transition-all group cursor-pointer">
                                    <div className="relative aspect-square mb-4 shadow-xl">
                                        <img className="rounded-lg w-full h-full object-cover"
                                            data-alt="Abstract album cover art for Midnight City"
                                            src={it.image ? it.image : default_image} />
                                        <button
                                            className="absolute bottom-2 right-2 bg-primary text-black rounded-full p-3 shadow-lg opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 flex items-center justify-center"
                                            data-nav-type="song"
                                            data-id="midnight-city"
                                            aria-label="Play song"
                                            onClick={(e)=>{
                                               const data={
                                               "user_id":currentUser.user_id,
                                                "item_id":it.trackid,
                                                "type":'track',
                                                "time":`${new Date().getFullYear()}-${new Date().getMonth()+1}-${new Date().getDate()}`
                                               }
                                               update_User_history(data)
                                               setplaySong(it)
                                               navigate('/play')
                                            }}>
                                            <span className="material-symbols-outlined fill-1" >play_arrow</span>
                                        </button>
                                        <button className="absolute top-2 left-2 bg-primary text-black rounded-full p-3 shadow-lg opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 flex items-center justify-center" data-nav-type="song" data-id="midnight-city" aria-label="Play song">
                                            <span className="material-symbols-outlined fill-1" >favorite</span>
                                        </button>
                                        <AddSongButton song={it} setSong={setSong} setisOpen={setisOpen}  />
                                    </div>
                                    <h3 className="font-bold truncate" >{it.track_name}</h3>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 truncate" >{it.artist}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                    {/* !-- Popular Artists Section -- */}
                    <section>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold tracking-tight" >Nghệ sỹ thịnh hành</h2>
                            <Link className="text-sm font-bold text-slate-500 hover:underline dark:text-slate-400" to="/show_all?section=artists">Show all</Link>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                            {/* !-- Artist Card 1 -- */}
                            {dataArtistHomeTrend.map((it) => (
                                <div className="bg-slate-200/50 dark:bg-white/5 p-4 rounded-xl hover:bg-slate-300/50 dark:hover:bg-white/10 transition-all group cursor-pointer text-center">
                                    <div className="relative aspect-square mb-4 shadow-xl mx-auto w-full">
                                        <img className="rounded-full w-full h-full object-cover" data-alt="Portrait of Billie Eilish artist" src={it.images} />
                                        <button className="absolute bottom-2 right-2 bg-primary text-black rounded-full p-3 shadow-lg opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 flex items-center justify-center" 
                                        data-nav-type="artist" 
                                        data-id="billie-eilish" 
                                        aria-label="Open artist"
                                        onClick={(e)=>{
                                            const data={
                                                'item':it,
                                                'type':'artist',
                                            }
                                            setSelectedPlayItem(data)
                                            navigate("/play")
                                        }}
                                        >
                                            <span className="material-symbols-outlined fill-1">play_arrow</span>
                                        </button>
                                    </div>
                                    <h3 className="font-bold truncate">{it.artist_name}</h3>
                                    <p className="text-sm text-slate-500 dark:text-slate-400" >Artist</p>
                                </div>
                            ))}
                        </div>
                    </section>
                    {/* Bài hát bạn có thể thích */}
                    <section>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold tracking-tight">Bài hát bạn có thể thích (Content-Base)</h2>
                            <Link className="text-sm font-bold text-slate-500 hover:underline dark:text-slate-400" to="/show_all?section=for_you">Show all</Link>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                            {dataTrackHomeRecommend && dataTrackHomeRecommend.slice(0,5).map((it) => (
                                <div className="bg-slate-200/50 dark:bg-white/5 p-4 rounded-xl hover:bg-slate-300/50 dark:hover:bg-white/10 transition-all group cursor-pointer">
                                    <div className="relative aspect-square mb-4 shadow-xl">
                                        <img className="rounded-lg w-full h-full object-cover" 
                                        data-alt="Album cover" src={it.image ? it.image : default_image} />
                                        <button className="absolute bottom-2 right-2 bg-primary text-black rounded-full p-3 shadow-lg opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 flex items-center justify-center" 
                                        data-nav-type="song" 
                                        data-id="save-your-tears"
                                         aria-label="Play song"
                                          onClick={(e)=>{
                                               const data={
                                               "user_id":currentUser.user_id,
                                                "item_id":it.trackid,
                                                "type":'track',
                                                "time":`${new Date().getFullYear()}-${new Date().getMonth()+1}-${new Date().getDate()}`
                                               }
                                               update_User_history(data)
                                               setplaySong(it)
                                               navigate('/play')
                                            }}
                                         >
                                            <span className="material-symbols-outlined fill-1">play_arrow</span>
                                        </button>
                                        <AddSongButton song={it} setSong={setSong} setisOpen={setisOpen} />
                                    </div>
                                    <h3 className="font-bold truncate" >{it.track_name}</h3>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 truncate">{it.artist_name}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                     {/* Bài hát bạn có thể thích  content-base-ae*/}
                    <section>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold tracking-tight">Bài hát bạn có thể thích (Content-Base-Autoencoder)</h2>
                            <Link className="text-sm font-bold text-slate-500 hover:underline dark:text-slate-400" to="/show_all?section=for_you">Show all</Link>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                            {dataTrackHomeRecommendAE && dataTrackHomeRecommendAE.slice(0,5).map((it) => (
                                <div className="bg-slate-200/50 dark:bg-white/5 p-4 rounded-xl hover:bg-slate-300/50 dark:hover:bg-white/10 transition-all group cursor-pointer">
                                    <div className="relative aspect-square mb-4 shadow-xl">
                                        <img className="rounded-lg w-full h-full object-cover" 
                                        data-alt="Album cover" src={it.image ? it.image : default_image} />
                                        <button className="absolute bottom-2 right-2 bg-primary text-black rounded-full p-3 shadow-lg opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 flex items-center justify-center" 
                                        data-nav-type="song" 
                                        data-id="save-your-tears"
                                         aria-label="Play song"
                                          onClick={(e)=>{
                                               const data={
                                               "user_id":currentUser.user_id,
                                                "item_id":it.track_id,
                                                "type":'track',
                                                "time":`${new Date().getFullYear()}-${new Date().getMonth()+1}-${new Date().getDate()}`
                                               }
                                               update_User_history(data)
                                               setplaySong(it)
                                               navigate('/play')
                                            }}
                                         >
                                            <span className="material-symbols-outlined fill-1">play_arrow</span>
                                        </button>
                                        <AddSongButton song={it} setSong={setSong} setisOpen={setisOpen} />
                                    </div>
                                    <h3 className="font-bold truncate" >{it.track_name}</h3>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 truncate">{it.artist_name}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                    {/* Nghệ sĩ bạn có thể thích */}
                    <section>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold tracking-tight">Gợi ý bài hát bằng two-tower</h2>
                            <Link className="text-sm font-bold text-slate-500 hover:underline dark:text-slate-400" to="/show_all?section=artists_suggested">Show all</Link>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                            {dataArtistHomeRecommend && dataArtistHomeRecommend.map((it) => (
                                <div className="bg-slate-200/50 dark:bg-white/5 p-4 rounded-xl hover:bg-slate-300/50 dark:hover:bg-white/10 transition-all group cursor-pointer text-center">
                                    <div className="relative aspect-square mb-4 shadow-xl mx-auto w-full">
                                        <img className="rounded-full w-full h-full object-cover" data-alt="Artist portrait" src={it.images} />
                                        <button className="absolute bottom-2 right-2 bg-primary text-black rounded-full p-3 shadow-lg opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 flex items-center justify-center" 
                                        data-nav-type="artist" 
                                        data-id="justin-bieber" 
                                        aria-label="Open artist"
                                        onClick={(e)=>{
                                            const data={
                                                'item':it,
                                                'type':'artist',
                                            }
                                            setSelectedPlayItem(data)
                                            navigate("/play")
                                        }}
                                        >
                                            <span className="material-symbols-outlined fill-1">play_arrow</span>
                                        </button>
                                    </div>
                                    <h3 className="font-bold truncate">{it.track_title}</h3>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">Artist</p>
                                </div>
                            ))}

                        </div>
                    </section>
                    {/* Album bạn có thể thích */}
                    <section>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold tracking-tight">Album bạn có thể thích</h2>
                            <Link className="text-sm font-bold text-slate-500 hover:underline dark:text-slate-400" to="/show_all?section=albums">Show all</Link>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                            {dataAlbumRecommend.map((it) => (
                                <div className="bg-slate-200/50 dark:bg-white/5 p-4 rounded-xl hover:bg-slate-300/50 dark:hover:bg-white/10 transition-all group cursor-pointer">
                                    <div className="relative aspect-square mb-4 shadow-xl">
                                        <img className="rounded-lg w-full h-full object-cover" data-alt="Album cover" src={it.images ? it.images : default_image} />
                                        <button className="absolute bottom-2 right-2 bg-primary text-black rounded-full p-3 shadow-lg opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 flex items-center justify-center" 
                                        data-nav-type="album" 
                                        data-id="after-hours" 
                                        aria-label="Open album"
                                        onClick={(e)=>{
                                            const data={
                                                'item':it,
                                                'type':'album',
                                            }
                                            setSelectedPlayItem(data)
                                            navigate("/play")
                                        }}
                                        >
                                            <span className="material-symbols-outlined fill-1">play_arrow</span>
                                        </button>
                                    </div>
                                    <h3 className="font-bold truncate">{it.album_name}</h3>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 truncate">Album • {it.artist_name}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                    {/* Playlist bạn có thể thích */}
                    <section>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold tracking-tight" >Đề xuất cho bạn</h2>
                            <Link className="text-sm font-bold text-slate-500 hover:underline dark:text-slate-400" to="/show_all?section=recommended">Show all</Link>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                            {dataPlaylistRecommend && dataPlaylistRecommend.map((it) => (
                                <div className="bg-slate-200/50 dark:bg-white/5 p-4 rounded-xl hover:bg-slate-300/50 dark:hover:bg-white/10 transition-all group cursor-pointer">
                                    <div className="relative aspect-square mb-4 shadow-xl">
                                        <img className="rounded-lg w-full h-full object-cover" data-alt="Recommendation cover" src={default_image} />
                                        <button className="absolute bottom-2 right-2 bg-primary text-black rounded-full p-3 shadow-lg opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 flex items-center justify-center" 
                                        data-nav-type="album" data-id="chill-vibes" aria-label="Open playlist"
                                        onClick={(e)=>{
                                            const data={
                                                'item':it,
                                                'type':'playlist',
                                            }
                                            setSelectedPlayItem(data);
                                            navigate("/play")
                                        }}
                                        >
                                            <span className="material-symbols-outlined fill-1" >play_arrow</span>
                                        </button>
                                        <AddSongButton songId="chill-vibes" />
                                    </div>
                                    <h3 className="font-bold truncate">{it.name}</h3>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 truncate">Playlist</p>
                                </div>
                            ))}
                        </div>
                    </section>

                </div>
                {/* !-- Spacer for playback bar -- */}
            </main>
            {/* !-- Playback Bar -- */}
            <AddSongsToPlaylistModal open={isOpen} track={song} onClose={setisOpen}/>
        </div>
    )
}
