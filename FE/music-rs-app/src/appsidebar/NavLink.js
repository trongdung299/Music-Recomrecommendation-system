import { Link } from "react-router-dom";

export default function  NavLink({ href, icon, label, key })
 {
  function normalizePathname(pathname) {
  return (pathname || "").replace(/\\/g, "/");
}
  function currentPageKey() {
  const p = normalizePathname(window.location.pathname).toLowerCase();
  if (p.endsWith("/")) return "home";
  if (p.endsWith("/playlist")) return "playlist";
  if (p.endsWith("/play")) return "play";
  if (p.endsWith("/user")) return "user";
  if (p.endsWith("/ask_user")) return "ask_user";
  if (p.endsWith("/login")) return "login";
  return "";
}
  const active =currentPageKey() === key;
  const base =
    "flex items-center gap-4 px-3 py-2 rounded-lg transition-colors";
  const klass = active
    ? `${base} nav-active`
    : `${base} hover:bg-slate-200 dark:hover:bg-white/10 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white`;

  return (<>
  <Link  className={klass} to={href}>
      <span className={`material-symbols-outlined ${active ? "fill-1" : ""}`}>{icon}</span>
      <span className="font-semibold text-sm">{label}</span>
    </Link>
  </>)
    
}