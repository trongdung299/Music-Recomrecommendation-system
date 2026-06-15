import { useState } from "react";


const subtleIconBtn =
  "flex size-7 shrink-0 items-center justify-center rounded-full border border-white/20 bg-black/35 text-emerald-200/90 shadow-sm backdrop-blur-[2px] transition-all duration-200 hover:border-emerald-400/50 hover:bg-emerald-500/12 hover:text-white active:scale-[0.96]";

const layoutClasses = {
  card: `absolute bottom-2 left-2 z-10 ${subtleIconBtn} opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200`,
  "card-shifted": `absolute bottom-16 left-6 z-10 ${subtleIconBtn} opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200`,
  inline: `inline-flex ${subtleIconBtn}`,
};

/** Stops propagation so global [data-nav-type] navigation does not fire. */
export default function AddSongButton({ song,setSong,setisOpen, className, layout = "card" }) {
  const merged = className || layoutClasses[layout] || layoutClasses.card;
  return (
    <button
      type="button"
      aria-label="Add to playlist"
      title="Add to playlist"
      className={merged}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setisOpen(true);
        setSong(song)
      }}
    >
      <span
        className="material-symbols-outlined select-none text-[15px] leading-none"
        style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 20" }}
      >
        add
      </span>
    </button>
  );
}
