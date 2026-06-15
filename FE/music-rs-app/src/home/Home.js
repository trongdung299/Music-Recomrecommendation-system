import { useContext, useEffect } from "react";
import AppHeader from "../appheader/Header";
import Sidebar from "../appsidebar/Sidebar";
import AuthContext from "../AuthProvider";
import { Link, useNavigate } from "react-router-dom";
import AddSongButton from "../components/AddSongButton";

export default function Home() {
    const { currentUser, setcurrentUser } = useContext(AuthContext);
    const navigate = useNavigate();
    useEffect(() => {
        if (!currentUser) {
            navigate('/login')
        }
    })
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
                            <h2 className="text-2xl font-bold tracking-tight" >Trending songs</h2>
                            <Link className="text-sm font-bold text-slate-500 hover:underline dark:text-slate-400" to="/show_all?section=trending">Show all</Link>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                            {/* !-- Song Card 1 -- */}
                            <div className="bg-slate-200/50 dark:bg-white/5 p-4 rounded-xl hover:bg-slate-300/50 dark:hover:bg-white/10 transition-all group cursor-pointer">
                                <div className="relative aspect-square mb-4 shadow-xl">
                                    <img className="rounded-lg w-full h-full object-cover"
                                        data-alt="Abstract album cover art for Midnight City"
                                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuCw4oZwtGKxRHRrk99OCvAZIqla4Bb5yLqxsQTmbF2nlocrXKrmwzVpUXo_8csF-rVF6i2mpOx3RwtPCV5Bu_eY9W_limRvRhPR1HCcmqB-rzsx2WVuSyabrRjfMRnB10-xZ3UbnEhYYMcpHfjJeBF6kqu_VOqxvb20ZcCXJ0POYaL9Jyknst97GtIe6ztd8dBl2C5cGYOouN7YeVjyFwoem9YSVDvoBwR4aLo6s8bBGYC8Qxn6Hli5TAwO5USQshkq3cu4y1_mZJo" />
                                    <button
                                        className="absolute bottom-2 right-2 bg-primary text-black rounded-full p-3 shadow-lg opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 flex items-center justify-center"
                                        data-nav-type="song"
                                        data-id="midnight-city"
                                        aria-label="Play song">
                                        <span className="material-symbols-outlined fill-1" >play_arrow</span>
                                    </button>
                                    <button className="absolute top-2 left-2 bg-primary text-black rounded-full p-3 shadow-lg opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 flex items-center justify-center" data-nav-type="song" data-id="midnight-city" aria-label="Play song">
                                        <span className="material-symbols-outlined fill-1" >favorite</span>
                                    </button>
                                    <AddSongButton songId="midnight-city" />
                                </div>
                                <h3 className="font-bold truncate" >Midnight City</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400 truncate" >M83</p>
                            </div>
                            {/* !-- Song Card 2 -- */}
                            <div className="bg-slate-200/50 dark:bg-white/5 p-4 rounded-xl hover:bg-slate-300/50 dark:hover:bg-white/10 transition-all group cursor-pointer">
                                <div className="relative aspect-square mb-4 shadow-xl">
                                    <img className="rounded-lg w-full h-full object-cover" data-alt="The Weeknd Starboy album cover art" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAJGfkb4-IzZX5_o22Ki9ZkYcD25P3BvsB84O20Pe8gn3CuyQPO84eH5t_sLSdNfUNNInNprst8rYfPs5N-ZvGkM3HlipCA4EB2nAs0SgRjzryuCZu9Zf7nFXpbRpBkyZO4CR98pjwXXG_VgmrOGI1auWD8ZVH_6WcRXqT4UJwBL2Zoa05M7qNjVVUJ2PagKlEdr62Gni1x-sk7wHU2aAzpfxPOCA74omFTtFXBWavgijXgS8uIZotVO86yKaIC1190pfaSdqvzUxk" />
                                    <button className="absolute bottom-2 right-2 bg-primary text-black rounded-full p-3 shadow-lg opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 flex items-center justify-center" data-nav-type="song" data-id="starboy" aria-label="Play song">
                                        <span className="material-symbols-outlined fill-1" >play_arrow</span>
                                    </button>
                                    <AddSongButton songId="starboy" />
                                </div>
                                <h3 className="font-bold truncate" >Starboy</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400 truncate" >The Weeknd</p>
                            </div>
                            {/* !-- Song Card 3 -- */}
                            <div className="bg-slate-200/50 dark:bg-white/5 p-4 rounded-xl hover:bg-slate-300/50 dark:hover:bg-white/10 transition-all group cursor-pointer">
                                <div className="relative aspect-square mb-4 shadow-xl">
                                    <img className="rounded-lg w-full h-full object-cover" data-alt="The Weeknd Blinding Lights single cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCPBD59iOFxQoqwRYOeRh1KY7eX9vFqB_S3DhYFL1OVly8qRp3ltZI3pSQOKsqmpFbmzdbpiJewl77IggEGqdqD6TSoPKY_dpqsIvFd22HhsuO1HSAtdOvOdJAkFzkF0TRey42W1NWsiwnyNB6b6CRflwbiQk4uQAo8M_6pEfNUJE1hpR8ZyTvNBgLYbEvG72m4v__T_rOE2zVZv4SRVYq6WUYyIbGGJdXIKCC6igCaDEvdya-Z4WL4TAGFc3FhD4AYfmanJW6MJSM" />
                                    <button className="absolute bottom-2 right-2 bg-primary text-black rounded-full p-3 shadow-lg opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 flex items-center justify-center" data-nav-type="song" data-id="blinding-lights" aria-label="Play song">
                                        <span className="material-symbols-outlined fill-1">play_arrow</span>
                                    </button>
                                    <AddSongButton songId="blinding-lights" />
                                </div>
                                <h3 className="font-bold truncate" >Blinding Lights</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400 truncate">The Weeknd</p>
                            </div>
                            {/* !-- Song Card 4 -- */}
                            <div className="bg-slate-200/50 dark:bg-white/5 p-4 rounded-xl hover:bg-slate-300/50 dark:hover:bg-white/10 transition-all group cursor-pointer">
                                <div className="relative aspect-square mb-4 shadow-xl">
                                    <img className="rounded-lg w-full h-full object-cover" data-alt="Dua Lipa Levitating album cover design" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBGUO5pbO_MuGcnf5RQO_YOuRPzo58JaSD8-e2fSUI6YYsVUsO3IG2q9fgqikVN8TSizWp-VPrB-LU_uIxqBvMcbTqLy4xkS5Y4lFv_lhpRXyw3Lp5pmCXCOlUEtQKJScqkrQAerWzngcMAbe9a6VdjIfK6lR-LgvRERaH3YsTUyE3ZkPpXexZhlY4tQivMgAtB0OqAyZwRlY27fiyzib8f_lVrHNw96HiRunK8QaPaczxm88ZOErVqs4kkqB0dx11SyfUB_qWncUE" />
                                    <button className="absolute bottom-2 right-2 bg-primary text-black rounded-full p-3 shadow-lg opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 flex items-center justify-center" data-nav-type="song" data-id="levitating" aria-label="Play song">
                                        <span className="material-symbols-outlined fill-1">play_arrow</span>
                                    </button>
                                    <AddSongButton songId="levitating" />
                                </div>
                                <h3 className="font-bold truncate">Levitating</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400 truncate">Dua Lipa</p>
                            </div>
                            {/* !-- Song Card 5 -- */}
                            <div className="bg-slate-200/50 dark:bg-white/5 p-4 rounded-xl hover:bg-slate-300/50 dark:hover:bg-white/10 transition-all group cursor-pointer hidden xl:block">
                                <div className="relative aspect-square mb-4 shadow-xl">
                                    <img className="rounded-lg w-full h-full object-cover" data-alt="Harry Styles As It Was single cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAfdZCqIS97NUqIx6Qx7oWHm-Tkueac2WPR3IT1OnRw6-Ps84jvgWjLz31I8loIBxD3iruqInTJge_0axhCvUmZKY4usYNtL07tuXNe5gBMdNmH6oWRA3yydKpxQQF-s47e98OIQnjO8azn-pXxjK58cKSMoEI9p56cU8Asc436IdN03QcQ-uV53yLj9MTl7QOhtKZg_iybOau44u3_f5dtxYVJQUrjeggUHV87XyBieKvQsZEHKT13wownTtTKL1SBrDUyKBCfW-Q" />
                                    <button className="absolute bottom-2 right-2 bg-primary text-black rounded-full p-3 shadow-lg opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 flex items-center justify-center" data-nav-type="song" data-id="as-it-was" aria-label="Play song">
                                        <span className="material-symbols-outlined fill-1">play_arrow</span>
                                    </button>
                                    <AddSongButton songId="as-it-was" />
                                </div>
                                <h3 className="font-bold truncate" >As It Was</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400 truncate">Harry Styles</p>
                            </div>
                        </div>
                    </section>
                    {/* !-- Popular Artists Section -- */}
                    <section>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold tracking-tight" >Popular artists</h2>
                            <Link className="text-sm font-bold text-slate-500 hover:underline dark:text-slate-400" to="/show_all?section=artists">Show all</Link>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                            {/* !-- Artist Card 1 -- */}
                            <div className="bg-slate-200/50 dark:bg-white/5 p-4 rounded-xl hover:bg-slate-300/50 dark:hover:bg-white/10 transition-all group cursor-pointer text-center">
                                <div className="relative aspect-square mb-4 shadow-xl mx-auto w-full">
                                    <img className="rounded-full w-full h-full object-cover" data-alt="Portrait of Billie Eilish artist" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDOsvx3oCAfHFYOgpvlBXuRBG3BxStGID1LCWH74NYeuXp5ISuCuVYNPHLS7PBN8lX4JtBRV4hY_EKwF3aSEyqTlJ2yFIQLevL7txCCclC6HNMX0cdbiKN5pJfSxyS0kGOLOXMrHFveeGC1V7LKgwVXB-ARDw9e2xw_TcwefxoVxE-N8VDIJWo1NCDl1X4SdUd0qtwcFO34T8TYhvQ8vyHSYGFog3cJws2veQQjIJqmAgPuHoCJgDItkOdmhi9WR4TcmAdo7BlkoIA" />
                                    <button className="absolute bottom-2 right-2 bg-primary text-black rounded-full p-3 shadow-lg opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 flex items-center justify-center" data-nav-type="artist" data-id="billie-eilish" aria-label="Open artist">
                                        <span className="material-symbols-outlined fill-1">play_arrow</span>
                                    </button>
                                </div>
                                <h3 className="font-bold truncate">Billie Eilish</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400" >Artist</p>
                            </div>
                            {/* !-- Artist Card 2 -- */}
                            <div className="bg-slate-200/50 dark:bg-white/5 p-4 rounded-xl hover:bg-slate-300/50 dark:hover:bg-white/10 transition-all group cursor-pointer text-center">
                                <div className="relative aspect-square mb-4 shadow-xl mx-auto w-full">
                                    <img className="rounded-full w-full h-full object-cover" data-alt="Portrait of Post Malone artist" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA_znynijA7cdnulMOZICn5F7uGfOFHfJLhYOoctlceq5jHyUx-rjmB8toM4ENB-noY33IKx5ZLACq3Xuz7XuCx6BP3IRrX8315dKy9-OAI75R92PoJa8Rvju38g9Jwj8ISxlT8lZDxHX7_l0CwPU8aD19JxoGEikYNp_Q0yRd8uNWRnoNsUEeDC5OMUV1E1ki_Zg0jCkiEpAnZF7Ri2dYNrdFL85z0mkG8PK4lOEaX1iOzELMZ8gncbx-zyn53lhV85T5upAuqlWs" />
                                    <button className="absolute bottom-2 right-2 bg-primary text-black rounded-full p-3 shadow-lg opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 flex items-center justify-center" data-nav-type="artist" data-id="post-malone" aria-label="Open artist">
                                        <span className="material-symbols-outlined fill-1" >play_arrow</span>
                                    </button>
                                </div>
                                <h3 className="font-bold truncate">Post Malone</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400">Artist</p>
                            </div>
                            {/* !-- Artist Card 3 -- */}
                            <div className="bg-slate-200/50 dark:bg-white/5 p-4 rounded-xl hover:bg-slate-300/50 dark:hover:bg-white/10 transition-all group cursor-pointer text-center">
                                <div className="relative aspect-square mb-4 shadow-xl mx-auto w-full">
                                    <img className="rounded-full w-full h-full object-cover" data-alt="Portrait of Drake artist" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBhwQfC_UolIa4tM5g3XuGsAwTqzryqLMs_JQnsk0JvOp2nw7XjBbdREfARurBuOyluU3OR-Syn_fG3rc_8pp51TLeanIPbtl47Citu8fvek_bvSrff6dFRuOp_u2FhVzQ0T4ebRmIDD9fwZbOVasAMTEmlKTPGaQCI_K9YLvTQiwPDYkM77gFiU7pktfTmSDOdOG-F7DrQ0FY76zv2XSRv-iBtA5cqmemjsLq_oX-kTsAgpLu4WOnSvV3d8Pu4pqhDAPww9tU883o" />
                                    <button className="absolute bottom-2 right-2 bg-primary text-black rounded-full p-3 shadow-lg opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 flex items-center justify-center" data-nav-type="artist" data-id="drake" aria-label="Open artist">
                                        <span className="material-symbols-outlined fill-1">play_arrow</span>
                                    </button>
                                </div>
                                <h3 className="font-bold truncate">Drake</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400">Artist</p>
                            </div>
                            {/* !-- Artist Card 4 -- */}
                            <div className="bg-slate-200/50 dark:bg-white/5 p-4 rounded-xl hover:bg-slate-300/50 dark:hover:bg-white/10 transition-all group cursor-pointer text-center">
                                <div className="relative aspect-square mb-4 shadow-xl mx-auto w-full">
                                    <img className="rounded-full w-full h-full object-cover" data-alt="Portrait of Taylor Swift artist" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCpb9JJ_2WRIo8YtmagDHtQitkGJSbRxvob8VmsttspnhzAYmockO6AS0S1MyDqewYMuNrrpfUd9_i13qKUR5fuH_qGfJ4cNPdbfecQQyGZ7PO6tpOi4jDdJsMa7YL0rkK5YI-wjqtczc13sKFLT0OlF2KeOWqZKvKXG6VzMTKsWSs-V8ZVGO5ncXsITdxBD0oGmMJhsuoni0XkTJgXF33q_fdEJvU-aVyPAk8KNQWU4eiHGNoYUKxoiCo6qOAmJCIW77QVsvb8CVY" />
                                    <button className="absolute bottom-2 right-2 bg-primary text-black rounded-full p-3 shadow-lg opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 flex items-center justify-center" data-nav-type="artist" data-id="taylor-swift" aria-label="Open artist">
                                        <span className="material-symbols-outlined fill-1" >play_arrow</span>
                                    </button>
                                </div>
                                <h3 className="font-bold truncate" >Taylor Swift</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400">Artist</p>
                            </div>
                            {/* !-- Artist Card 5 -- */}
                            <div className="bg-slate-200/50 dark:bg-white/5 p-4 rounded-xl hover:bg-slate-300/50 dark:hover:bg-white/10 transition-all group cursor-pointer text-center hidden xl:block">
                                <div className="relative aspect-square mb-4 shadow-xl mx-auto w-full">
                                    <img className="rounded-full w-full h-full object-cover" data-alt="Portrait of Bad Bunny artist" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBtI_HhBJYMNLhLeiXuhQJEKAybwBl8rfqRZHD6Y50EFY9xb5f6G0-zLLQ4bVPXs2FszH276CWn9dLx6gOMBRLFdFo0AyRDn3IpebgKK9PG3Pk0KUSRr_VDpNTqOFxl_jJayNEVEfWJza-SYX8FNQc1sQB_3HrtUg3HSfwPw8cgXx91GvTuvkSRo25dakVb8ifZ2b9XFt5lRTBMgBAQAV-1iTA_dcMNCaayIIOmJ80zEVsnw-V2hNziRe8UqH0hsfcQdc27ItHqXZA" />
                                    <button className="absolute bottom-2 right-2 bg-primary text-black rounded-full p-3 shadow-lg opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 flex items-center justify-center" data-nav-type="artist" data-id="bad-bunny" aria-label="Open artist">
                                        <span className="material-symbols-outlined fill-1">play_arrow</span>
                                    </button>
                                </div>
                                <h3 className="font-bold truncate">Bad Bunny</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400">Artist</p>
                            </div>
                        </div>
                    </section><section>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold tracking-tight">Songs you might like</h2>
                            <Link className="text-sm font-bold text-slate-500 hover:underline dark:text-slate-400" to="/show_all?section=for_you">Show all</Link>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                            <div className="bg-slate-200/50 dark:bg-white/5 p-4 rounded-xl hover:bg-slate-300/50 dark:hover:bg-white/10 transition-all group cursor-pointer">
                                <div className="relative aspect-square mb-4 shadow-xl">
                                    <img className="rounded-lg w-full h-full object-cover" data-alt="Album cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCPBD59iOFxQoqwRYOeRh1KY7eX9vFqB_S3DhYFL1OVly8qRp3ltZI3pSQOKsqmpFbmzdbpiJewl77IggEGqdqD6TSoPKY_dpqsIvFd22HhsuO1HSAtdOvOdJAkFzkF0TRey42W1NWsiwnyNB6b6CRflwbiQk4uQAo8M_6pEfNUJE1hpR8ZyTvNBgLYbEvG72m4v__T_rOE2zVZv4SRVYq6WUYyIbGGJdXIKCC6igCaDEvdya-Z4WL4TAGFc3FhD4AYfmanJW6MJSM" />
                                    <button className="absolute bottom-2 right-2 bg-primary text-black rounded-full p-3 shadow-lg opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 flex items-center justify-center" data-nav-type="song" data-id="save-your-tears" aria-label="Play song">
                                        <span className="material-symbols-outlined fill-1">play_arrow</span>
                                    </button>
                                    <AddSongButton songId="save-your-tears" />
                                </div>
                                <h3 className="font-bold truncate" >Save Your Tears</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400 truncate">The Weeknd</p>
                            </div>
                            <div className="bg-slate-200/50 dark:bg-white/5 p-4 rounded-xl hover:bg-slate-300/50 dark:hover:bg-white/10 transition-all group cursor-pointer">
                                <div className="relative aspect-square mb-4 shadow-xl">
                                    <img className="rounded-lg w-full h-full object-cover" data-alt="Album cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAfdZCqIS97NUqIx6Qx7oWHm-Tkueac2WPR3IT1OnRw6-Ps84jvgWjLz31I8loIBxD3iruqInTJge_0axhCvUmZKY4usYNtL07tuXNe5gBMdNmH6oWRA3yydKpxQQF-s47e98OIQnjO8azn-pXxjK58cKSMoEI9p56cU8Asc436IdN03QcQ-uV53yLj9MTl7QOhtKZg_iybOau44u3_f5dtxYVJQUrjeggUHV87XyBieKvQsZEHKT13wownTtTKL1SBrDUyKBCfW-Q" />
                                    <button className="absolute bottom-2 right-2 bg-primary text-black rounded-full p-3 shadow-lg opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 flex items-center justify-center" data-nav-type="song" data-id="watermelon-sugar" aria-label="Play song">
                                        <span className="material-symbols-outlined fill-1">play_arrow</span>
                                    </button>
                                    <AddSongButton songId="watermelon-sugar" />
                                </div>
                                <h3 className="font-bold truncate">Watermelon Sugar</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400 truncate">Harry Styles</p>
                            </div>
                            <div className="bg-slate-200/50 dark:bg-white/5 p-4 rounded-xl hover:bg-slate-300/50 dark:hover:bg-white/10 transition-all group cursor-pointer">
                                <div className="relative aspect-square mb-4 shadow-xl">
                                    <img className="rounded-lg w-full h-full object-cover" data-alt="Album cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBGUO5pbO_MuGcnf5RQO_YOuRPzo58JaSD8-e2fSUI6YYsVUsO3IG2q9fgqikVN8TSizWp-VPrB-LU_uIxqBvMcbTqLy4xkS5Y4lFv_lhpRXyw3Lp5pmCXCOlUEtQKJScqkrQAerWzngcMAbe9a6VdjIfK6lR-LgvRERaH3YsTUyE3ZkPpXexZhlY4tQivMgAtB0OqAyZwRlY27fiyzib8f_lVrHNw96HiRunK8QaPaczxm88ZOErVqs4kkqB0dx11SyfUB_qWncUE" />
                                    <button className="absolute bottom-2 right-2 bg-primary text-black rounded-full p-3 shadow-lg opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 flex items-center justify-center" data-nav-type="song" data-id="dont-start-now" aria-label="Play song">
                                        <span className="material-symbols-outlined fill-1">play_arrow</span>
                                    </button>
                                    <AddSongButton songId="dont-start-now" />
                                </div>
                                <h3 className="font-bold truncate" >Don't Start Now</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400 truncate" >Dua Lipa</p>
                            </div>
                        </div>
                    </section><section>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold tracking-tight">Artists you might like</h2>
                            <Link className="text-sm font-bold text-slate-500 hover:underline dark:text-slate-400" to="/show_all?section=artists_suggested">Show all</Link>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                            <div className="bg-slate-200/50 dark:bg-white/5 p-4 rounded-xl hover:bg-slate-300/50 dark:hover:bg-white/10 transition-all group cursor-pointer text-center">
                                <div className="relative aspect-square mb-4 shadow-xl mx-auto w-full">
                                    <img className="rounded-full w-full h-full object-cover" data-alt="Artist portrait" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCwNZwafGFIvZGq75OE7sH44FwCvQWoHzARVAQtVvomTZAx5dt0Tu_-Zmwohn0KudjBKvfDeBdsEToDz2VFLn0Sq-CPDSPQWgGe7Pd4dXJ0NUhQFPicBOnUhFkoHzRZC1Bt-czWZaQX-3gTItHX-JUxOPu3-O16joAKbvOJ1nkdXn451di1o_G0micm8oaJDU6ZWTdPH1V916A5iuGXdPn6cdpQqaoBCxPRIEKwgb-o3EBt4Ypa5rkhYzzvL9hNEpCMmFrLIaojpH4" />
                                    <button className="absolute bottom-2 right-2 bg-primary text-black rounded-full p-3 shadow-lg opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 flex items-center justify-center" data-nav-type="artist" data-id="justin-bieber" aria-label="Open artist">
                                        <span className="material-symbols-outlined fill-1">play_arrow</span>
                                    </button>
                                </div>
                                <h3 className="font-bold truncate">Justin Bieber</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400">Artist</p>
                            </div>
                            <div className="bg-slate-200/50 dark:bg-white/5 p-4 rounded-xl hover:bg-slate-300/50 dark:hover:bg-white/10 transition-all group cursor-pointer text-center">
                                <div className="relative aspect-square mb-4 shadow-xl mx-auto w-full">
                                    <img className="rounded-full w-full h-full object-cover" data-alt="Artist portrait" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDOsvx3oCAfHFYOgpvlBXuRBG3BxStGID1LCWH74NYeuXp5ISuCuVYNPHLS7PBN8lX4JtBRV4hY_EKwF3aSEyqTlJ2yFIQLevL7txCCclC6HNMX0cdbiKN5pJfSxyS0kGOLOXMrHFveeGC1V7LKgwVXB-ARDw9e2xw_TcwefxoVxE-N8VDIJWo1NCDl1X4SdUd0qtwcFO34T8TYhvQ8vyHSYGFog3cJws2veQQjIJqmAgPuHoCJgDItkOdmhi9WR4TcmAdo7BlkoIA" />
                                    <button className="absolute bottom-2 right-2 bg-primary text-black rounded-full p-3 shadow-lg opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 flex items-center justify-center" data-nav-type="artist" data-id="olivia-rodrigo" aria-label="Open artist">
                                        <span className="material-symbols-outlined fill-1">play_arrow</span>
                                    </button>
                                </div>
                                <h3 className="font-bold truncate">Olivia Rodrigo</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400" >Artist</p>
                            </div>
                        </div>
                    </section><section>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold tracking-tight">Albums you might like</h2>
                            <Link className="text-sm font-bold text-slate-500 hover:underline dark:text-slate-400" to="/show_all?section=albums">Show all</Link>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                            <div className="bg-slate-200/50 dark:bg-white/5 p-4 rounded-xl hover:bg-slate-300/50 dark:hover:bg-white/10 transition-all group cursor-pointer">
                                <div className="relative aspect-square mb-4 shadow-xl">
                                    <img className="rounded-lg w-full h-full object-cover" data-alt="Album cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAJGfkb4-IzZX5_o22Ki9ZkYcD25P3BvsB84O20Pe8gn3CuyQPO84eH5t_sLSdNfUNNInNprst8rYfPs5N-ZvGkM3HlipCA4EB2nAs0SgRjzryuCZu9Zf7nFXpbRpBkyZO4CR98pjwXXG_VgmrOGI1auWD8ZVH_6WcRXqT4UJwBL2Zoa05M7qNjVVUJ2PagKlEdr62Gni1x-sk7wHU2aAzpfxPOCA74omFTtFXBWavgijXgS8uIZotVO86yKaIC1190pfaSdqvzUxk" />
                                    <button className="absolute bottom-2 right-2 bg-primary text-black rounded-full p-3 shadow-lg opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 flex items-center justify-center" data-nav-type="album" data-id="after-hours" aria-label="Open album">
                                        <span className="material-symbols-outlined fill-1">play_arrow</span>
                                    </button>
                                </div>
                                <h3 className="font-bold truncate">After Hours</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400 truncate">Album • The Weeknd</p>
                            </div>
                            <div className="bg-slate-200/50 dark:bg-white/5 p-4 rounded-xl hover:bg-slate-300/50 dark:hover:bg-white/10 transition-all group cursor-pointer">
                                <div className="relative aspect-square mb-4 shadow-xl">
                                    <img className="rounded-lg w-full h-full object-cover" data-alt="Album cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA_znynijA7cdnulMOZICn5F7uGfOFHfJLhYOoctlceq5jHyUx-rjmB8toM4ENB-noY33IKx5ZLACq3Xuz7XuCx6BP3IRrX8315dKy9-OAI75R92PoJa8Rvju38g9Jwj8ISxlT8lZDxHX7_l0CwPU8aD19JxoGEikYNp_Q0yRd8uNWRnoNsUEeDC5OMUV1E1ki_Zg0jCkiEpAnZF7Ri2dYNrdFL85z0mkG8PK4lOEaX1iOzELMZ8gncbx-zyn53lhV85T5upAuqlWs" />
                                    <button className="absolute bottom-2 right-2 bg-primary text-black rounded-full p-3 shadow-lg opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 flex items-center justify-center" data-nav-type="album" data-id="hollywoods-bleeding" aria-label="Open album">
                                        <span className="material-symbols-outlined fill-1" >play_arrow</span>
                                    </button>
                                </div>
                                <h3 className="font-bold truncate" >Hollywood's Bleeding</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400 truncate" >Album • Post Malone</p>
                            </div>
                        </div>
                    </section><section>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold tracking-tight" >Recommended for you</h2>
                            <Link className="text-sm font-bold text-slate-500 hover:underline dark:text-slate-400" to="/show_all?section=recommended">Show all</Link>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                            <div className="bg-slate-200/50 dark:bg-white/5 p-4 rounded-xl hover:bg-slate-300/50 dark:hover:bg-white/10 transition-all group cursor-pointer">
                                <div className="relative aspect-square mb-4 shadow-xl">
                                    <img className="rounded-lg w-full h-full object-cover" data-alt="Recommendation cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCw4oZwtGKxRHRrk99OCvAZIqla4Bb5yLqxsQTmbF2nlocrXKrmwzVpUXo_8csF-rVF6i2mpOx3RwtPCV5Bu_eY9W_limRvRhPR1HCcmqB-rzsx2WVuSyabrRjfMRnB10-xZ3UbnEhYYMcpHfjJeBF6kqu_VOqxvb20ZcCXJ0POYaL9Jyknst97GtIe6ztd8dBl2C5cGYOouN7YeVjyFwoem9YSVDvoBwR4aLo6s8bBGYC8Qxn6Hli5TAwO5USQshkq3cu4y1_mZJo" />
                                    <button className="absolute bottom-2 right-2 bg-primary text-black rounded-full p-3 shadow-lg opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 flex items-center justify-center" data-nav-type="album" data-id="chill-vibes" aria-label="Open playlist">
                                        <span className="material-symbols-outlined fill-1" >play_arrow</span>
                                    </button>
                                    <AddSongButton songId="chill-vibes" />
                                </div>
                                <h3 className="font-bold truncate">Chill Vibes</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400 truncate">Playlist</p>
                            </div>
                        </div>
                    </section>
                </div>
                {/* !-- Spacer for playback bar -- */}
            </main>
            {/* !-- Playback Bar -- */}
        </div>
    )
}