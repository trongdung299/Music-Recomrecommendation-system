import { useContext, useMemo, useState, useEffect,US } from "react";
import { Link, useNavigate } from "react-router-dom";
import AppHeader from "../appheader/Header";
import Sidebar from "../appsidebar/Sidebar";
import { usePersonalize } from "../context/PersonalizeContext";
import { ARTISTS, GENRES, SONGS } from "../data/catalog";
import AuthContext from "../AuthProvider";



export default function AskUser() {
  const {
    selectedGenres,
    setSelectedGenres,
    selectedArtists,
    setSelectedArtists,
    selectedSongs,
    setSelectedSong,
    toggleGenre,
    toggleArtist,
    toggleSong,
  } = usePersonalize();
  const { currentUser, setcurrentUser } = useContext(AuthContext);
  const navigate=useNavigate()
  // if (currentUser){
  // console.log("danh tính người dùng",currentUser)
  // }

  const canSave = useMemo(() => {
    // console.log("bài hát chọn", selectedSongs)
    // console.log("thể loại nhạc chọn", selectedGenres)
    // console.log("nghệ sĩ chọn", selectedArtists)
    return selectedGenres.size >= 2 && selectedArtists.size >= 2 && selectedSongs.size >= 2;
  }, [selectedGenres, selectedArtists, selectedSongs]);

  const [dataTrackHomeTrend, setDataTHT] = useState([]);
  const [dataGenre, setDataGenre] = useState();
  const [dataArtistHomeTrend, setDataAHT] = useState([]);
  const [dataUFG, setDataUFG] = useState();
  const [dataUFA, setDataUFA] = useState();
  const [dataUFT, setDataUFT] = useState();

  const submit = async (data) => {
    const userData = JSON.stringify(data);
    const fetchOption = {
      "method": 'post',
      "headers": {
        "Accept": 'application/json',
        'Content-Type': 'application/json',
      },
      "body": userData,
    }
    try {
      const response = await fetch('http://localhost:8080/user/update-user', fetchOption);
      // const result= await response.json();
      // console.log(response)
      // setcurrentUser(result);
      if (response.ok) {
        alert(`Save successfull`);
      }
      else
        alert(`Sever responses with status: ${response.status}`)
    } catch (error) {
      console.error("Error ", error);
      alert("Error when save profile user. Liên hệ đạt đẹp trai để nhờ fix bug =)))");
    }
  }
  const submitA = () => {
    //console.log("------------------",dataUFA)
    if (dataUFA){
        dataUFA.forEach(it => {
      const data = {
        'user_id': currentUser.user_id,
        'id': it["id"],
        'type': 'artist'
      }
      delFavourite(data)
    })
    }
    if(dataUFT){
        dataUFT.forEach(it=>{
      const data = {
        'user_id': currentUser.user_id,
        'id': it["id"],
        'type': 'track'
      }
      delFavourite(data)
    })
    }
    
    // console.log("aaaaaaa", selectedArtists)
    selectedArtists.forEach(it => {
      // console.log(it)
      const data = {
        'user_id': currentUser.user_id,
        'id': it,
        'type': 'artist'
      }
      // console.log("nghệ sĩ", data)
      submitArtist(data)
    });
  }
  const submitT = () => {
    //console.log("aaaaaaa", selectedArtists)
    selectedSongs.forEach(it => {
      // console.log(it)
      const data = {
        'user_id': currentUser.user_id,
        'id': it,
        'type': 'track'
      }
      // console.log("nghệ sĩ", data)
      submitTrack(data)
    });
  }

  const delFavourite = async(data) => {
    const content = JSON.stringify(data);
    const fetchOption = {
      "method": 'post',
      "headers": {
        "Accept": 'application/json',
        'Content-Type': 'application/json',
      },
      "body": content,
    }
    try {
      const response = await fetch('http://localhost:8080/user/del-favorite', fetchOption);
      // const result= await response.json();
      // console.log(response)
      // setcurrentUser(result);
      if (response.ok) {
         //alert(`Save successfull`);
      }
      // else
      //   alert(`Sever responses with status: ${response.status}`)
    } catch (error) {
      console.error("Error ", error);
      alert("Error when save profile user. Liên hệ đạt đẹp trai để nhờ fix bug =)))");
    }
  }

  const submitArtist = async (data) => {
    const ArtistData = JSON.stringify(data);
    const fetchOption = {
      "method": 'post',
      "headers": {
        "Accept": 'application/json',
        'Content-Type': 'application/json',
      },
      "body": ArtistData,
    }

    try {
      const response = await fetch('http://localhost:8080/user/favorite/artist', fetchOption);
      // const result= await response.json();
      // console.log(response)
      // setcurrentUser(result);
      if (response.ok) {
        // alert(`Save successfull`);
      }
      // else
      //   alert(`Sever responses with status: ${response.status}`)
    } catch (error) {
      console.error("Error ", error);
      alert("Error when save profile user. Liên hệ đạt đẹp trai để nhờ fix bug =)))");
    }
  }

  const submitTrack = async (data) => {
    const TrackData = JSON.stringify(data);
    const fetchOption = {
      "method": 'post',
      "headers": {
        "Accept": 'application/json',
        'Content-Type': 'application/json',
      },
      "body": TrackData,
    }
    try {
      const response = await fetch('http://localhost:8080/user/favorite/track', fetchOption);
      // const result= await response.json();
      // console.log(response)
      // setcurrentUser(result);
      if (response.ok) {
        // alert(`Save successfull`);
      }
      // else
      //   alert(`Sever responses with status: ${response.status}`)
    } catch (error) {
      console.error("Error ", error);
      alert("Error when save profile user. Liên hệ đạt đẹp trai để nhờ fix bug =)))");
    }
  }

  const dataTF = useMemo(() => {
  const listA = dataTrackHomeTrend ?? [];
  const listB = dataUFT ?? [];

  const mapA = new Map(
    listA.map(item => [item.trackid, item])
  );

  const result = [];

  for (const item of listB) {
    const found = mapA.get(item.id);

    result.push({
      user_id: item.user_id || '',
      type: item.type || '',
      trackid: item.id || '',
      image: item.image || '',
      track_name: item.track_name || '',
      popularity: found?.popularity || '',
      artist: found?.artist || ''
    });

    mapA.delete(item.id);
  }

  for (const item of mapA.values()) {
    result.push({
      user_id: '',
      type: '',
      trackid: item.trackid || '',
      image: item.image || '',
      track_name: item.track_name || '',
      popularity: item.popularity || '',
      artist: item.artist || ''
    });
  }

  return result;
}, [dataUFT, dataTrackHomeTrend]);

const mergedArtists = useMemo(() => {
  const listA = dataArtistHomeTrend ?? []; // mảng lớn
  const listB = dataUFA ?? []; // user favorite artist

  const mapA = new Map(
    listA.map(item => [item.artistid, item])
  );

  const result = [];

  // 1. Ưu tiên listB
  for (const item of listB) {
    const found = mapA.get(item.id);

    result.push({
      user_id: item.user_id || '',
      type: item.type || '',
      artistid: item.id || '',
      artist_name: item.artist_name || '',
      images: item.images || '',
      artist_genre: found?.artist_genre || '',
      followers: found?.followers || '',
      popularity: found?.popularity || '',
      country: found?.country || ''
    });

    mapA.delete(item.id); // tránh duplicate
  }

  // 2. Phần còn lại của listA
  for (const item of mapA.values()) {
    result.push({
      user_id: '',
      type: '',
      artistid: item.artistid || '',
      artist_name: item.artist_name || '',
      images: item.images || '',
      artist_genre: item.artist_genre || '',
      followers: item.followers || '',
      popularity: item.popularity || '',
      country: item.country || ''
    });
  }

  return result;
}, [dataArtistHomeTrend, dataUFA]);
    useEffect(() => {
        if (!currentUser) {
            navigate('/login')
        }
    })
  useEffect(() => {
    const fetchDataGenre = async () => {
      try {
        const response = await fetch('http://localhost:8080/track/genrelimit');
        const result = await response.json();
        setDataGenre(result);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    const fetchUFG = async () => {
      try {
        const response = await fetch(`http://localhost:8080/user/favourite-genres/${currentUser.user_id}`);
        // console.log("API là ", `http://localhost:8080/user/favourite-genres/${currentUser.user_id}`)
        const result = await response.json();
        setDataUFG(result);
        if (result && result.length > 0) {
          // console.log("API trả về:", result);

          const arr = result[0].favorite_genre.split(',').map(s => s.trim());
          // console.log("array là ",arr)
          // convert → Set
          const newSet = new Set(arr);
          // console.log(newSet)
          setSelectedGenres(newSet);
        }
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
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:8080/track/track-home-trend/5');
        const result = await response.json();
        setDataTHT(result);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    const fetchUF = async () => {
      const Data = JSON.stringify({ "user_id": currentUser.user_id });
      const fetchOption = {
        "method": 'post',
        "headers": {
          "Accept": 'application/json',
          'Content-Type': 'application/json',
        },
        "body": Data,
      }
      try {
        const response = await fetch('http://localhost:8080/user/favorite-artist', fetchOption);
        const response1 = await fetch('http://localhost:8080/user/favorite-track', fetchOption);
        const result = await response.json();
        const result1 = await response1.json();
        // setDataTHT(result);
        // console.log("oooooooooooooooooooooooooooo",result)
        if (result && result.length > 0 && result1 && result1.length > 0) {
          // console.log("API trả về:", result);
          // convert  → Set
          const newSet = new Set(result
            .filter(item => item.type === 'artist')
            .map(item => item.id));
          setSelectedArtists(newSet);
          setDataUFA(result)
          setDataUFT(result1)
          const newSet1 = new Set(result1
            .filter(item => item.type === 'track')
            .map(item => item.id));
          setSelectedSong(newSet1);
          //  console.log("aaaaaaaaaaaaaaa", newSet)
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
    fetchDataAHT()
    fetchDataGenre();
    if (currentUser) {
      // console.log("user_id", currentUser.user_id)
      fetchUFG();
      fetchUF();
      // console.log("xxxxxxxxxxxxxxxxxxxxxxx", selectedGenres)
    }
    // console.log(dataGenre)
  }, []);

  // console.log("dataUFA", dataUFA)
  // console.log("dataUFT", dataUFT)

  const genreOptions = useMemo(
    () =>
      Object.keys(GENRES)
        .slice(0, 6)
        .map((key) => ({ key, label: GENRES[key] })),
    []
  );


  const artistOptions = useMemo(
    () =>
      Object.entries(ARTISTS)
        .slice(0, 5)
        .map(([key, a]) => ({ key, label: a.name, img: a.cover })),
    []
  );

  const songOptions = useMemo(
    () =>
      Object.entries(SONGS)
        .filter(([, s]) => s.cover)
        .slice(0, 3)
        .map(([key, s]) => ({
          key,
          title: s.title,
          sub: s.artist,
          img: s.cover,
        })),
    []
  );

  return (
    <>
      <div className="flex h-screen overflow-hidden">
        {/* <div id="app-sidebar"></div> */}
        <Sidebar />
        <main className="flex-1 flex flex-col bg-background-light dark:bg-background-dark overflow-y-auto custom-scrollbar relative">
          {/* <header id="app-header"></header> */}
          <AppHeader />
          <div className="max-w-5xl mx-auto px-4 pb-32">
            {/* <!-- Progress Stepper --> */}
            <div className="py-8">
              <h2 className="text-3xl font-extrabold mb-2">Build your vibe</h2>
              <p className="text-slate-500 dark:text-slate-400">Select at least 2 items from each category to customize your feed.</p>
            </div>
            {/* <!-- 1. Favorite Genres --> */}
            <section className="mb-12">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold">Favorite Genres</h3>
                <Link to="/show_all?section=personalize_genres" className="text-primary text-sm font-semibold hover:underline">Show all</Link>
              </div>
              <div className="flex flex-wrap gap-3">
                {dataGenre && dataUFG && dataGenre.map((it) => {
                  // console.log("đã chọn genre", selectedGenres)
                  const isSelected = selectedGenres.has(it.genre);
                  return (
                    <button
                      key={it.genre}
                      type="button"
                      onClick={() => toggleGenre(it.genre)}
                      className={
                        isSelected
                          ? "px-6 py-2 rounded-full bg-primary text-background-dark font-bold text-sm shadow-lg shadow-primary/20 flex items-center gap-2"
                          : "px-6 py-2 rounded-full bg-slate-200 dark:bg-primary/10 border-2 border-transparent hover:border-primary/50 text-slate-700 dark:text-slate-300 font-semibold text-sm transition-all"
                      }
                    >
                      {isSelected && <span className="material-symbols-outlined text-sm font-bold">check</span>}
                      {it.genre}
                    </button>)
                })}
              </div>
            </section>
            {/* <!-- 2. Favorite Artists --> */}
            <section className="mb-12">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold">Who are your favorite artists?</h3>
                <Link to="/show_all?section=personalize_artists" className="text-primary text-sm font-semibold hover:underline">Show all</Link>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4 sm:gap-6">
                {mergedArtists.map((opt) => {
                  const isSelected = selectedArtists.has(opt.artistid);
                  return (
                    <button
                      key={opt.artistid}
                      type="button"
                      onClick={() => toggleArtist(opt.artistid)}
                      className="group flex flex-col items-center gap-2"
                    >
                      <div
                        className={
                          isSelected
                            ? "relative w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-4 border-primary shadow-lg shadow-primary/10"
                            : "relative w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-4 border-transparent hover:border-primary/30 transition-all"
                        }
                      >
                        <img
                          className={isSelected ? "w-full h-full object-cover" : "w-full h-full object-cover grayscale group-hover:grayscale-0"}
                          src={opt.images}
                          alt={opt.artist_name}
                        />
                        {isSelected && (
                          <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                            <div className="bg-primary text-background-dark rounded-full p-1.5">
                              <span className="material-symbols-outlined font-bold text-lg">check</span>
                            </div>
                          </div>
                        )}
                      </div>
                      <span
                        className={
                          isSelected
                            ? "font-bold text-xs sm:text-sm text-primary"
                            : "font-bold text-xs sm:text-sm text-slate-400 group-hover:text-primary transition-colors"
                        }
                      >
                        {opt.artist_name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </section>
            {/* <!-- 3. Songs You Love --> */}
            <section className="mb-10">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold">Songs you love</h3>
                <Link to="/show_all?section=personalize_songs" className="text-primary text-sm font-semibold hover:underline">Show all</Link>
              </div>
              <div className="space-y-2">
                {dataTF.map((opt) => {
                  console.log(selectedSongs)
                  const isSelected = selectedSongs.has(opt.trackid);
                  return (
                    <button
                      key={opt.trackid}
                      type="button"
                      onClick={() => toggleSong(opt.trackid)}
                      className={
                        isSelected
                          ? "flex items-center justify-between p-3 rounded-xl bg-primary/10 border border-primary/30 group cursor-pointer w-full"
                          : "flex items-center justify-between p-3 rounded-xl hover:bg-white/5 border border-transparent transition-all group cursor-pointer w-full"
                      }
                    >
                      <div className="flex items-center gap-4">
                        <div className="relative size-12 rounded-lg overflow-hidden">
                          <img className="w-full h-full object-cover" src={opt.image} alt={opt.track_name} />
                        </div>
                        <div>
                          <p className={isSelected ? "font-bold text-primary" : "font-bold group-hover:text-primary transition-colors"}>
                            {opt.track_name}
                          </p>
                          {/* <p className="text-xs text-slate-500">{opt.artist}</p> */}
                        </div>
                      </div>

                      {isSelected ? (
                        <div className="bg-primary text-background-dark rounded-full p-1">
                          <span className="material-symbols-outlined font-bold text-sm">check</span>
                        </div>
                      ) : (
                        <span className="material-symbols-outlined text-slate-600 group-hover:text-primary">add_circle</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </section></div>
        </main>
        {/* <!-- Fixed Bottom Action Bar --> */}
        <footer className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-background-light via-background-light to-transparent dark:from-background-dark dark:via-background-dark dark:to-transparent pt-12 pb-8 px-4 flex justify-center pointer-events-none">
          <div className="max-w-md w-full pointer-events-auto">
            <button
              type="button"
              disabled={!canSave}
              onClick={() => {
                if (!canSave) return;
                const data = {
                  'user_id': currentUser.user_id,
                  'user_name': '',
                  'user_password': '',
                  'favorite_genre': [...selectedGenres].join(', ')
                }
                submit(data)
                submitA()
                submitT()
                navigate('/')
                // console.log("aaaaaaaaaaaaaaaaaaa", data)
                // Chỗ này có thể gọi API/đẩy user tới trang tiếp theo.
                // Hiện tại chỉ cần đảm bảo UI cho phép chọn/tắt và bật Save đúng điều kiện.
                // eslint-disable-next-line no-console
                // console.log({
                //   genres: Array.from(selectedGenres),
                //   artists: Array.from(selectedArtists),
                //   songs: Array.from(selectedSongs),
                // });
              }}
              className={
                canSave
                  ? "w-full bg-primary text-background-dark py-4 rounded-full font-extrabold text-lg shadow-[0_0_40px_-10px_rgba(29,185,84,0.6)] hover:scale-[1.02] active:scale-95 transition-all duration-300 flex items-center justify-center gap-2"
                  : "w-full bg-primary text-background-dark py-4 rounded-full font-extrabold text-lg opacity-50 cursor-not-allowed shadow-[0_0_40px_-10px_rgba(29,185,84,0.6)] flex items-center justify-center gap-2"
              }
            >
              Save
              <br />
              <span className="material-symbols-outlined font-bold">arrow_forward</span>
            </button>
          </div>
        </footer>
      </div>
    </>)
}
