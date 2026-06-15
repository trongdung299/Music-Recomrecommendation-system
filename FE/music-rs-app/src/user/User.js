import { useContext, useEffect } from "react";
import AppHeader from "../appheader/Header";
import Sidebar from "../appsidebar/Sidebar";
import { useLocation, useNavigate } from "react-router-dom";
import AuthContext from "../AuthProvider";
import { usePlaylist } from "../context/PlaylistContext";
import AddSongButton from "../components/AddSongButton";

export default function User(){
    const location = useLocation();
    const navigate = useNavigate();
    const id = new URLSearchParams(location.search).get("id");
    const displayId = id ? id.replace(/-/g, " ") : null;
    const isArtistView = Boolean(id);
    const { isFollowingArtist, toggleFollowArtist, playlists } = usePlaylist();
    const following = id ? isFollowingArtist(id) : false;
    const {currentUser,setcurrentUser}=useContext(AuthContext);
    return (
    <>
<div className="flex h-screen overflow-hidden">
{/* <div id="app-sidebar"></div> */}
<Sidebar/>
<main className="flex-1 flex flex-col bg-background-light dark:bg-background-dark overflow-hidden relative min-h-0">
    <AppHeader/>
{/* <header id="app-header"></header> */}
<div className="flex-1 overflow-y-scroll custom-scrollbar force-scrollbar min-h-0 pr-2 pb-28">
<div className="flex-1 max-w-5xl mx-auto w-full p-4 md:p-10 flex flex-col gap-8 pb-8">
{/* <!-- Profile Header --> */}
<section className="flex flex-col @container">
<div className="flex flex-col md:flex-row gap-8 items-center md:items-end">
<div className="relative group">
<div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-40 md:size-52 border-4 border-primary shadow-2xl shadow-primary/20" data-alt="Large circular user profile picture" id="bg-background-image"></div>
{!isArtistView && (
<button type="button" className="absolute bottom-2 right-2 bg-primary text-slate-900 rounded-full p-2 border-4 border-background-light dark:border-background-dark flex items-center justify-center hover:scale-110 transition-transform" aria-label="Edit profile photo">
<span className="material-symbols-outlined text-sm font-bold">edit</span>
</button>
)}
</div>
<div className="flex flex-col gap-4 flex-1 items-center md:items-start text-center md:text-left">
<div className="flex flex-col">
<p className="text-primary text-sm font-bold uppercase tracking-[0.2em] mb-1">{isArtistView ? "Artist" : "Profile"}</p>
<h1 className="text-slate-900 dark:text-white text-4xl md:text-6xl font-black leading-tight tracking-tight">{displayId ||currentUser.user_name}</h1>
<p className="text-slate-500 dark:text-slate-400 text-lg font-medium mt-1">{isArtistView ? "Artist • Follow for new releases" : "Experimental Jazz & Lo-fi Enthusiast"}</p>
</div>
<div className="flex flex-wrap gap-6 mt-2">
<div className="flex flex-col">
<p className="text-slate-900 dark:text-white text-xl font-bold">1,248</p>
<p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-widest">Followers</p>
</div>
<div className="flex flex-col">
<p className="text-slate-900 dark:text-white text-xl font-bold">452</p>
<p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-widest">Following</p>
</div>
<div className="flex flex-col">
<p className="text-slate-900 dark:text-white text-xl font-bold">34</p>
<p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-widest">Playlists</p>
</div>
</div>
<div className="flex gap-3 mt-4 w-full md:w-auto">
{isArtistView ? (
<button
type="button"
onClick={() => id && toggleFollowArtist(id)}
className={
  following
    ? "flex-1 md:flex-none flex items-center justify-center gap-2 rounded-full px-8 py-3 border-2 border-primary text-primary text-sm font-bold transition-transform active:scale-95"
    : "flex-1 md:flex-none flex items-center justify-center gap-2 rounded-full px-8 py-3 bg-primary text-slate-900 text-sm font-bold transition-transform active:scale-95"
}
>
<span className="material-symbols-outlined text-base">{following ? "check" : "person_add"}</span>
<span>{following ? "Following" : "Follow"}</span>
</button>
) : (
<button type="button" className="flex-1 md:flex-none flex items-center justify-center gap-2 rounded-full px-8 py-3 bg-primary text-slate-900 text-sm font-bold transition-transform active:scale-95">
<span>Edit Profile</span>
</button>
)}
<button type="button" className="flex items-center justify-center rounded-full size-11 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
<span className="material-symbols-outlined">more_horiz</span>
</button>
</div>
</div>
</div>
</section>
{/* <!-- Tabs Section --> */}
<section className="flex flex-col gap-6 mt-8">
<div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
<h3 className="text-slate-900 dark:text-white text-xl font-bold">{isArtistView ? "Trending songs" : "Playlists"}</h3>
<a className="text-slate-400 text-sm font-bold hover:text-primary" href={isArtistView ? "/show_all?section=trending" : "/playlist"}>Show all</a>
</div>
{isArtistView ? (
<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
<div className="group flex flex-col gap-3 p-4 rounded-xl bg-slate-800/20 hover:bg-slate-800/40 transition-all cursor-pointer" data-nav-type="song" data-id="midnight-city">
<div className="relative aspect-square overflow-hidden rounded-lg shadow-lg">
<div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors"></div>
<div className="absolute bottom-2 right-2 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all bg-primary rounded-full p-3 shadow-xl shadow-black/40">
<span className="material-symbols-outlined text-slate-900 fill-1">play_arrow</span>
</div>
<img className="w-full h-full object-cover" data-alt="Music album cover with vibrant neon lights" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCQ2Csa_7Tqb5Rha5Qd74J3fT_eYSRkOn4oPRdzAU8gm3zbg9HF1nSrBWhllMO5JI_SiEe487Oygn4yzk9Sf54EuaMFFBXyQv1NWCtjm5IPx1AwkiNK9kT0zMIKglpc8gAkgDzmC_SBsY17z9CQoAs1gaV1UFpxHP9SDBSQKQ8H6sD3eQPAURybqR2KMU6Gy5XQq3MLcJlmaQ3xl7SmjJlr7Oekl3fMwslSYzctJj64qtzmjluFRMigIbEJdva_5xy56zYinbJNdmY"/>
<AddSongButton songId="midnight-city" />
</div>
<div>
<h4 className="text-slate-900 dark:text-white font-bold truncate">Midnight City</h4>
<p className="text-slate-500 dark:text-slate-400 text-xs font-medium mt-0.5 truncate">Electric Dreams</p>
</div>
</div>
<div className="group flex flex-col gap-3 p-4 rounded-xl bg-slate-800/20 hover:bg-slate-800/40 transition-all cursor-pointer" data-nav-type="song" data-id="acoustic-soul">
<div className="relative aspect-square overflow-hidden rounded-lg shadow-lg">
<div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors"></div>
<div className="absolute bottom-2 right-2 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all bg-primary rounded-full p-3 shadow-xl shadow-black/40">
<span className="material-symbols-outlined text-slate-900 fill-1">play_arrow</span>
</div>
<img className="w-full h-full object-cover" data-alt="Album art featuring a lone guitar on stage" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD8hhVGgpV-3WyQKYsMHGAr_7qPpP8nA9-1KFxT4XcyX8c7r7nylLZIP6uHauwXNOSSB28ydhFR-ThewqpnOdMgwIsHPCRyOUrsDT-2fl1JVDoJaJtx2zUSe2tGQHf81UvAQWaz3So8dzKHTdxDRIuYv6SObdbmH_JSIsAL57cMJRpGGKmeNyk_jVHXZ3mQObruHhAFIsCg7bYsEo_OoqLowZBbzRJtcpvzgw6cbkQAZ9O95WNj-8NuJSC8eaVBO6JagkspKQt9aGI"/>
<AddSongButton songId="acoustic-soul" />
</div>
<div>
<h4 className="text-slate-900 dark:text-white font-bold truncate">Acoustic Soul</h4>
<p className="text-slate-500 dark:text-slate-400 text-xs font-medium mt-0.5 truncate">The Strays</p>
</div>
</div>
<div className="group flex flex-col gap-3 p-4 rounded-xl bg-slate-800/20 hover:bg-slate-800/40 transition-all cursor-pointer" data-nav-type="song" data-id="underground-beats">
<div className="relative aspect-square overflow-hidden rounded-lg shadow-lg">
<div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors"></div>
<div className="absolute bottom-2 right-2 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all bg-primary rounded-full p-3 shadow-xl shadow-black/40">
<span className="material-symbols-outlined text-slate-900 fill-1">play_arrow</span>
</div>
<img className="w-full h-full object-cover" data-alt="DJ equipment with colorful lighting effect" src="https://lh3.googleusercontent.com/aida-public/AB6AXuArsIymb_KpsJBtpaD6j95I6vVw3siZDqnsfIoFUHEjUyNFVCQFTzfdlW6rBkRxv275DkUwgjEvsNMaVxR51773-AJZl0DMcHIYGM093vIBdY2ZjdjO2NgpEEWv_VXxYEizNsr_eh552rbGC4lUNN92gOZwxvSUDgTYu4FAtPzTZpn_2gcdVFoHJBPGLD8-0JkEh-xLkTmBj3OkwRzIkEmZxu8DHZE26vtLzjR9Y1KhKAeLRvG7Bkusjpyg2x78gfbODzgSpJxm2Ns"/>
<AddSongButton songId="underground-beats" />
</div>
<div>
<h4 className="text-slate-900 dark:text-white font-bold truncate">Underground Beats</h4>
<p className="text-slate-500 dark:text-slate-400 text-xs font-medium mt-0.5 truncate">System Flux</p>
</div>
</div>
<div className="group flex flex-col gap-3 p-4 rounded-xl bg-slate-800/20 hover:bg-slate-800/40 transition-all cursor-pointer" data-nav-type="song" data-id="ocean-waves">
<div className="relative aspect-square overflow-hidden rounded-lg shadow-lg">
<div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors"></div>
<div className="absolute bottom-2 right-2 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all bg-primary rounded-full p-3 shadow-xl shadow-black/40">
<span className="material-symbols-outlined text-slate-900 fill-1">play_arrow</span>
</div>
<img className="w-full h-full object-cover" data-alt="Abstract musical patterns in deep blues and purples" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDSfmEWwQJxQEZXUXQXQ71VOFoAz1l9SPtCrB2oMo4b-DpzJ1Ha3kwlCBExQs8_89tdiWfNHHr-wCBqVTMeXws1TvEaef66P16bDISI31Nd91uEtFwL6thsiJ3MzbR3fpU0dquTejGDJPrZ-il_ZLDMQZLKMQ9UJhg80RmJRJF59H9jaJCd9NBtut9_Gtcjy_unFOw0E_INdlYiRYRy_LqeRmk6PYUKwxcMT9rsBK-UMG2sQUAVW1CvQa-BTffmfM1kGaoZlLs20gk"/>
<AddSongButton songId="ocean-waves" />
</div>
<div>
<h4 className="text-slate-900 dark:text-white font-bold truncate">Ocean Waves</h4>
<p className="text-slate-500 dark:text-slate-400 text-xs font-medium mt-0.5 truncate">Ambient Drift</p>
</div>
</div>
<div className="group flex flex-col gap-3 p-4 rounded-xl bg-slate-800/20 hover:bg-slate-800/40 transition-all cursor-pointer" data-nav-type="song" data-id="electric-sky">
<div className="relative aspect-square overflow-hidden rounded-lg shadow-lg">
<div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors"></div>
<div className="absolute bottom-2 right-2 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all bg-primary rounded-full p-3 shadow-xl shadow-black/40">
<span className="material-symbols-outlined text-slate-900 fill-1">play_arrow</span>
</div>
<img className="w-full h-full object-cover" data-alt="Concert stage with crowds and lasers" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDeFN1rBQqwCzyDdvqexRFotr0HJNeLZjaPKH5XrbbOSg3Ox2ejMC_UHodiobDCm-tpgxNvuQbBx4xG52Hv4DRfxg5_oVVqgSAiXQlVNJ-cYHPWglU8rSaI9hchLvruJDldRByoV707AeTmz4wDG0QbcBwwjP2KZe0whgE9tlPHEr1ZPWvL3DPdGFgu0v2739ucqNNVdCdvBRbxP5outXPY_JlWC0Flj-M5P7rgGKCd6-Wxlp9Zao78hjSk-MHXTCkMhrEdZ0aOtj0"/>
<AddSongButton songId="electric-sky" />
</div>
<div>
<h4 className="text-slate-900 dark:text-white font-bold truncate">Electric Sky</h4>
<p className="text-slate-500 dark:text-slate-400 text-xs font-medium mt-0.5 truncate">Nova Pulsar</p>
</div>
</div>
</div>
) : (
<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
{playlists.map((pl) => (
<div
key={pl.id}
role="button"
tabIndex={0}
className="group flex flex-col gap-3 p-4 rounded-xl bg-slate-800/20 hover:bg-slate-800/40 transition-all cursor-pointer"
onClick={() => navigate(`/playlist?id=${encodeURIComponent(pl.id)}`)}
onKeyDown={(e) => {
if (e.key === "Enter" || e.key === " ") {
e.preventDefault();
navigate(`/playlist?id=${encodeURIComponent(pl.id)}`);
}
}}
>
<div className="relative aspect-square overflow-hidden rounded-lg shadow-lg bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center">
<span className="material-symbols-outlined text-white text-5xl">queue_music</span>
{pl.songIds[0] ? (
<AddSongButton songId={pl.songIds[0]} />
) : (
<AddSongButton />
)}
</div>
<div>
<h4 className="text-slate-900 dark:text-white font-bold truncate">{pl.name}</h4>
<p className="text-slate-500 dark:text-slate-400 text-xs font-medium mt-0.5 truncate">{pl.songIds.length} tracks</p>
</div>
</div>
))}
</div>
)}
</section>
</div>
</div>
</main>
{/* <!-- Bottom Player (Minimalist) --> */}
<footer className="h-20 bg-background-light/95 dark:bg-background-dark/95 border-t border-slate-200 dark:border-slate-800 px-4 md:px-10 flex items-center justify-between fixed bottom-0 left-64 w-[calc(100%-16rem)] z-50 backdrop-blur-md">
<div className="flex items-center gap-4 w-1/3">
<img className="size-12 rounded-lg object-cover shadow-sm" data-alt="Small thumbnail of current playing track album art" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAyVz8ws36JQ1__ROvdfRayBCFTxL-3N08M8FM1RkFPRdVCoXZppw5pys9rf91PbVQzI8C_mYJ55iT29lklglvAkq5qyK-dGlM075Cdaeonb-th91c9u8A0B_QLGYOsvLPkRmCx-cAnJzsGFl_vpSPEFmMXGOZBZ6ItssA6EFwFl0TzoNiQ6Vi-M3KruZy8I54hllfcItNgVDCgDDE-TTpy36mOahrbOCDe5bxYkIHwkQxa3EOLKoU2mQ2ezsY-6Rp7oKTthzxpj3c"/>
<div className="hidden sm:block">
<p className="text-slate-900 dark:text-white text-sm font-bold truncate">Midnight City</p>
<p className="text-slate-500 dark:text-slate-400 text-xs truncate">Electric Dreams</p>
</div>
</div>
<div className="flex flex-col items-center gap-1 flex-1">
<div className="flex items-center gap-6">
<span className="material-symbols-outlined text-slate-400 cursor-pointer hover:text-primary transition-colors">shuffle</span>
<span className="material-symbols-outlined text-slate-700 dark:text-slate-200 cursor-pointer">skip_previous</span>
<div className="size-10 bg-primary rounded-full flex items-center justify-center text-slate-900 cursor-pointer hover:scale-110 transition-transform">
<span className="material-symbols-outlined fill-1">play_arrow</span>
</div>
<span className="material-symbols-outlined text-slate-700 dark:text-slate-200 cursor-pointer">skip_next</span>
<span className="material-symbols-outlined text-slate-400 cursor-pointer hover:text-primary transition-colors">repeat</span>
</div>
<div className="hidden md:flex items-center gap-3 w-full max-w-md">
<span className="text-[10px] text-slate-500 font-bold">1:24</span>
<div className="flex-1 h-1 bg-slate-200 dark:bg-slate-800 rounded-full relative">
<div className="absolute left-0 top-0 h-full w-[40%] bg-primary rounded-full"></div>
<div className="absolute left-[40%] top-1/2 -translate-y-1/2 size-3 bg-white border-2 border-primary rounded-full shadow-md"></div>
</div>
<span className="text-[10px] text-slate-500 font-bold">3:45</span>
</div>
</div>
<div className="flex items-center justify-end gap-4 w-1/3">
<span className="material-symbols-outlined text-slate-400 hover:text-primary cursor-pointer hidden sm:block">lyrics</span>
<span className="material-symbols-outlined text-slate-400 hover:text-primary cursor-pointer hidden sm:block">queue_music</span>
<div className="flex items-center gap-2">
<span className="material-symbols-outlined text-slate-400">volume_up</span>
<div className="w-20 h-1 bg-slate-200 dark:bg-slate-800 rounded-full hidden md:block">
<div className="h-full w-2/3 bg-slate-400 rounded-full"></div>
</div>
</div>
</div>
</footer>
</div>

    </>
    )
}
