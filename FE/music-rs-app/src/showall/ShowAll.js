import { Link, useSearchParams } from "react-router-dom";
import AppHeader from "../appheader/Header";
import Sidebar from "../appsidebar/Sidebar";
import AddSongButton from "../components/AddSongButton";
import { ALBUMS, ARTISTS, SHOW_SECTIONS, SONGS } from "../data/catalog";
import PersonalizeShowAll from "./PersonalizeShowAll";

export default function ShowAll() {
  const [params] = useSearchParams();
  const section = params.get("section") || "trending";

  if (section.startsWith("personalize_")) {
    return <PersonalizeShowAll />;
  }

  const config = SHOW_SECTIONS[section] || SHOW_SECTIONS.trending;

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 flex flex-col bg-background-light dark:bg-background-dark overflow-y-auto custom-scrollbar relative">
        <AppHeader />
        <div className="px-8 py-6 max-w-6xl mx-auto w-full">
          <div className="flex items-center gap-4 mb-8">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-primary"
            >
              <span className="material-symbols-outlined text-lg">arrow_back</span>
              Home
            </Link>
          </div>
          <h1 className="text-3xl font-black tracking-tight mb-8 text-slate-900 dark:text-white">
            {config.title}
          </h1>

          {config.kind === "songs" && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {config.ids.map((id) => {
                const s = SONGS[id];
                if (!s || !s.cover) return null;
                return (
                  <div
                    key={id}
                    className="bg-slate-200/50 dark:bg-white/5 p-4 rounded-xl hover:bg-slate-300/50 dark:hover:bg-white/10 transition-all group cursor-pointer"
                  >
                    <div className="relative aspect-square mb-4 shadow-xl">
                      <img
                        className="rounded-lg w-full h-full object-cover"
                        alt=""
                        src={s.cover}
                      />
                      <button
                        type="button"
                        className="absolute bottom-2 right-2 bg-primary text-black rounded-full p-3 shadow-lg opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 flex items-center justify-center"
                        data-nav-type="song"
                        data-id={id}
                        aria-label="Play"
                      >
                        <span className="material-symbols-outlined fill-1">play_arrow</span>
                      </button>
                      <AddSongButton songId={id} />
                    </div>
                    <h3 className="font-bold truncate text-slate-900 dark:text-white">{s.title}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 truncate">{s.artist}</p>
                  </div>
                );
              })}
            </div>
          )}

          {config.kind === "artists" && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {config.ids.map((id) => {
                const a = ARTISTS[id];
                if (!a) return null;
                return (
                  <div
                    key={id}
                    className="bg-slate-200/50 dark:bg-white/5 p-4 rounded-xl hover:bg-slate-300/50 dark:hover:bg-white/10 transition-all group cursor-pointer text-center"
                  >
                    <div className="relative aspect-square mb-4 shadow-xl mx-auto w-full">
                      <img
                        className="rounded-full w-full h-full object-cover"
                        alt=""
                        src={a.cover}
                      />
                      <button
                        type="button"
                        className="absolute bottom-2 right-2 bg-primary text-black rounded-full p-3 shadow-lg opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 flex items-center justify-center"
                        data-nav-type="artist"
                        data-id={id}
                        aria-label="Open artist"
                      >
                        <span className="material-symbols-outlined fill-1">play_arrow</span>
                      </button>
                    </div>
                    <h3 className="font-bold truncate text-slate-900 dark:text-white">{a.name}</h3>
                    <p className="text-sm text-slate-500">Artist</p>
                  </div>
                );
              })}
            </div>
          )}

          {config.kind === "albums" && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {config.ids.map((id) => {
                const al = ALBUMS[id];
                if (!al) return null;
                return (
                  <div
                    key={id}
                    className="bg-slate-200/50 dark:bg-white/5 p-4 rounded-xl hover:bg-slate-300/50 dark:hover:bg-white/10 transition-all group cursor-pointer"
                  >
                    <div className="relative aspect-square mb-4 shadow-xl">
                      <img
                        className="rounded-lg w-full h-full object-cover"
                        alt=""
                        src={al.cover}
                      />
                      <button
                        type="button"
                        className="absolute bottom-2 right-2 bg-primary text-black rounded-full p-3 shadow-lg opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 flex items-center justify-center"
                        data-nav-type="album"
                        data-id={id}
                        aria-label="Open album"
                      >
                        <span className="material-symbols-outlined fill-1">play_arrow</span>
                      </button>
                    </div>
                    <h3 className="font-bold truncate text-slate-900 dark:text-white">{al.title}</h3>
                    <p className="text-sm text-slate-500 truncate">Album · {al.subtitle}</p>
                  </div>
                );
              })}
            </div>
          )}

          {config.kind === "playlists" && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {config.ids.map((id) => {
                const s = SONGS[id];
                if (!s || !s.cover) return null;
                return (
                  <div
                    key={id}
                    className="bg-slate-200/50 dark:bg-white/5 p-4 rounded-xl hover:bg-slate-300/50 dark:hover:bg-white/10 transition-all group cursor-pointer"
                  >
                    <div className="relative aspect-square mb-4 shadow-xl">
                      <img
                        className="rounded-lg w-full h-full object-cover"
                        alt=""
                        src={s.cover}
                      />
                      <button
                        type="button"
                        className="absolute bottom-2 right-2 bg-primary text-black rounded-full p-3 shadow-lg opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 flex items-center justify-center"
                        data-nav-type="album"
                        data-id={id}
                        aria-label="Open playlist"
                      >
                        <span className="material-symbols-outlined fill-1">play_arrow</span>
                      </button>
                      <AddSongButton songId={id} />
                    </div>
                    <h3 className="font-bold truncate text-slate-900 dark:text-white">{s.title}</h3>
                    <p className="text-sm text-slate-500 truncate">Playlist</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
