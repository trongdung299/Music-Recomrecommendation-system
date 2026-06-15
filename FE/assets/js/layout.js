function normalizePathname(pathname) {
  return (pathname || "").replace(/\\/g, "/");
}

// Force the app to always use the original "dark" tone,
// independent from OS/browser preferred color scheme.
try {
  document.documentElement.classList.add("dark");
} catch (_) {
  // ignore
}

function computePageBase() {
  const p = normalizePathname(window.location.pathname);
  const inPages = p.includes("/pages/");
  return inPages ? "./" : "./pages/";
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

function navLink({ href, icon, label, key }) {
  const active = currentPageKey() === key;
  const base =
    "flex items-center gap-4 px-3 py-2 rounded-lg transition-colors";
  const klass = active
    ? `${base} nav-active`
    : `${base} hover:bg-slate-200 dark:hover:bg-white/10 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white`;

  return `
    <a class="${klass}" href="${href}" data-nav-key="${key}">
      <span class="material-symbols-outlined ${active ? "fill-1" : ""}">${icon}</span>
      <span class="font-semibold text-sm">${label}</span>
    </a>
  `;
}

function renderSidebar({ pageBase }) {
  const links = [
    { key: "home", href: `${pageBase}home.html`, icon: "home", label: "Home" },
    {
      key: "playlist",
      href: `${pageBase}playlist.html`,
      icon: "library_music",
      label: "Your Playlist",
    },
    {
      key: "play",
      href: `${pageBase}play.html`,
      icon: "play_circle",
      label: "Now Playing",
    },
    {
      key: "user",
      href: `${pageBase}user.html`,
      icon: "account_circle",
      label: "Profile",
    },
    {
      key: "ask_user",
      href: `${pageBase}ask_user.html`,
      icon: "tune",
      label: "Personalize",
    },
  ];

  return `
    <aside class="w-64 flex-shrink-0 flex flex-col bg-slate-100 dark:bg-black p-4 gap-6">
      <a class="flex items-center gap-3 px-2" href="${pageBase}home.html" aria-label="Go to home">
        <div class="bg-primary rounded-full p-1 flex items-center justify-center">
          <span class="material-symbols-outlined text-black text-2xl">music_note</span>
        </div>
        <h1 class="text-xl font-bold tracking-tight">MusicStream</h1>
      </a>

      <nav class="flex flex-col gap-2">
        ${links.map(navLink).join("")}
      </nav>

      <div class="flex flex-col gap-2 mt-4">
        <a
          class="flex items-center gap-4 px-3 py-2 rounded-lg hover:bg-slate-200 dark:hover:bg-white/10 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
          href="${pageBase}login.html"
          data-nav-key="login"
        >
          <span class="material-symbols-outlined bg-gradient-to-br from-indigo-600 to-blue-300 p-1 rounded-sm text-sm text-white">login</span>
          <span class="font-semibold text-sm">Login</span>
        </a>
      </div>
    </aside>
  `;
}

function renderHeader({ pageBase }) {
  return `
    <header class="sticky top-0 z-10 flex items-center justify-between px-8 py-4 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md">
      <div class="flex gap-4"></div>

      <div class="flex items-center gap-4">
        <div class="relative group">
          <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
          <input
            class="bg-slate-200 dark:bg-white/10 border-none rounded-full pl-10 pr-4 py-2 text-sm w-64 focus:ring-2 focus:ring-primary focus:outline-none placeholder:text-slate-500"
            placeholder="Search for songs, artists..."
            type="text"
          />
        </div>

        <button class="bg-slate-200 dark:bg-white/10 rounded-full p-2 hover:bg-slate-300 dark:hover:bg-white/20 transition-colors relative" type="button">
          <span class="material-symbols-outlined text-xl">notifications</span>
          <span class="absolute top-2 right-2.5 w-2 h-2 bg-primary rounded-full"></span>
        </button>

        <a class="h-10 w-10 rounded-full bg-slate-300 dark:bg-slate-700 overflow-hidden border-2 border-transparent hover:border-white/20 transition-all" href="${pageBase}user.html" aria-label="Profile">
          <img
            class="w-full h-full object-cover"
            alt="User avatar"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCwNZwafGFIvZGq75OE7sH44FwCvQWoHzARVAQtVvomTZAx5dt0Tu_-Zmwohn0KudjBKvfDeBdsEToDz2VFLn0Sq-CPDSPQWgGe7Pd4dXJ0NUhQFPicBOnUhFkoHzRZC1Bt-czWZaQX-3gTItHX-JUxOPu3-O16joAKbvOJ1nkdXn451di1o_G0micm8oaJDU6ZWTdPH1V916A5iuGXdPn6cdpQqaoBCxPRIEKwgb-o3EBt4Ypa5rkhYzzvL9hNEpCMmFrLIaojpH4"
          />
        </a>
      </div>
    </header>
  `;
}

function mountLayout() {
  const layoutMode = (document.body?.dataset?.layout || "app").toLowerCase();
  const pageBase = computePageBase();

  const sidebarHost =
    document.querySelector("[data-app-sidebar]") ||
    document.getElementById("app-sidebar");
  const headerHost =
    document.querySelector("[data-app-header]") ||
    document.getElementById("app-header");

  if (layoutMode !== "auth" && sidebarHost) {
    sidebarHost.outerHTML = renderSidebar({ pageBase });
  }

  if (headerHost) {
    headerHost.outerHTML = renderHeader({ pageBase });
  }

  try {
    // Let the initial styles apply, then fade in.
    requestAnimationFrame(() => {
      document.documentElement.classList.remove("layout-loading");
    });
  } catch (_) {
    // ignore
  }
}

function mountEntityNavigation() {
  const pageBase = computePageBase();

  document.addEventListener("click", (e) => {
    const target = e.target;
    if (!(target instanceof Element)) return;

    // Only navigate when clicking an explicit play/navigation control.
    const el = target.closest("[data-nav-type][data-id]");
    if (!el) return;

    const type = el.getAttribute("data-nav-type");
    const id = el.getAttribute("data-id");
    if (!type || !id) return;

    const next =
      type === "song"
        ? "play.html"
        : type === "album"
          ? "playlist.html"
          : type === "artist"
            ? "user.html"
            : null;
    if (!next) return;

    e.preventDefault();
    const url = `${pageBase}${next}?type=${encodeURIComponent(type)}&id=${encodeURIComponent(id)}`;
    window.location.href = url;
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    mountLayout();
    mountEntityNavigation();
  });
} else {
  mountLayout();
  mountEntityNavigation();
}

function normalizePathname(pathname) {
  return (pathname || "").replace(/\\/g, "/");
}

// Force the app to always use the original "dark" tone,
// independent from OS/browser preferred color scheme.
try {
  document.documentElement.classList.add("dark");
} catch (_) {
  // ignore
}

function computePageBase() {
  const p = normalizePathname(window.location.pathname);
  const inPages = p.includes("/pages/");
  return inPages ? "./" : "./pages/";
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

function navLink({ href, icon, label, key }) {
  const active = currentPageKey() === key;
  const base =
    "flex items-center gap-4 px-3 py-2 rounded-lg transition-colors";
  const klass = active
    ? `${base} nav-active`
    : `${base} hover:bg-slate-200 dark:hover:bg-white/10 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white`;

  return `
    <a class="${klass}" href="${href}" data-nav-key="${key}">
      <span class="material-symbols-outlined ${active ? "fill-1" : ""}">${icon}</span>
      <span class="font-semibold text-sm">${label}</span>
    </a>
  `;
}

function renderSidebar({ pageBase }) {
  const links = [
    { key: "home", href: `${pageBase}home.html`, icon: "home", label: "Home" },
    {
      key: "playlist",
      href: `${pageBase}playlist.html`,
      icon: "library_music",
      label: "Your Playlist",
    },
    {
      key: "play",
      href: `${pageBase}play.html`,
      icon: "play_circle",
      label: "Now Playing",
    },
    {
      key: "user",
      href: `${pageBase}user.html`,
      icon: "account_circle",
      label: "Profile",
    },
    {
      key: "ask_user",
      href: `${pageBase}ask_user.html`,
      icon: "tune",
      label: "Personalize",
    },
  ];

  return `
    <aside class="w-64 flex-shrink-0 flex flex-col bg-slate-100 dark:bg-black p-4 gap-6">
      <a class="flex items-center gap-3 px-2" href="${pageBase}home.html" aria-label="Go to home">
        <div class="bg-primary rounded-full p-1 flex items-center justify-center">
          <span class="material-symbols-outlined text-black text-2xl">music_note</span>
        </div>
        <h1 class="text-xl font-bold tracking-tight">MusicStream</h1>
      </a>

      <nav class="flex flex-col gap-2">
        ${links.map(navLink).join("")}
      </nav>

      <div class="flex flex-col gap-2 mt-4">
        <a
          class="flex items-center gap-4 px-3 py-2 rounded-lg hover:bg-slate-200 dark:hover:bg-white/10 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
          href="${pageBase}login.html"
          data-nav-key="login"
        >
          <span class="material-symbols-outlined bg-gradient-to-br from-indigo-600 to-blue-300 p-1 rounded-sm text-sm text-white">login</span>
          <span class="font-semibold text-sm">Login</span>
        </a>
      </div>
    </aside>
  `;
}

function renderHeader({ pageBase }) {
  return `
    <header class="sticky top-0 z-10 flex items-center justify-between px-8 py-4 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md">
      <div class="flex gap-4"></div>

      <div class="flex items-center gap-4">
        <div class="relative group">
          <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
          <input
            class="bg-slate-200 dark:bg-white/10 border-none rounded-full pl-10 pr-4 py-2 text-sm w-64 focus:ring-2 focus:ring-primary focus:outline-none placeholder:text-slate-500"
            placeholder="Search for songs, artists..."
            type="text"
          />
        </div>

        <button class="bg-slate-200 dark:bg-white/10 rounded-full p-2 hover:bg-slate-300 dark:hover:bg-white/20 transition-colors relative" type="button">
          <span class="material-symbols-outlined text-xl">notifications</span>
          <span class="absolute top-2 right-2.5 w-2 h-2 bg-primary rounded-full"></span>
        </button>

        <a class="h-10 w-10 rounded-full bg-slate-300 dark:bg-slate-700 overflow-hidden border-2 border-transparent hover:border-white/20 transition-all" href="${pageBase}user.html" aria-label="Profile">
          <img
            class="w-full h-full object-cover"
            alt="User avatar"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCwNZwafGFIvZGq75OE7sH44FwCvQWoHzARVAQtVvomTZAx5dt0Tu_-Zmwohn0KudjBKvfDeBdsEToDz2VFLn0Sq-CPDSPQWgGe7Pd4dXJ0NUhQFPicBOnUhFkoHzRZC1Bt-czWZaQX-3gTItHX-JUxOPu3-O16joAKbvOJ1nkdXn451di1o_G0micm8oaJDU6ZWTdPH1V916A5iuGXdPn6cdpQqaoBCxPRIEKwgb-o3EBt4Ypa5rkhYzzvL9hNEpCMmFrLIaojpH4"
          />
        </a>
      </div>
    </header>
  `;
}

function mountLayout() {
  const layoutMode = (document.body?.dataset?.layout || "app").toLowerCase();
  const pageBase = computePageBase();

  const sidebarHost =
    document.querySelector("[data-app-sidebar]") ||
    document.getElementById("app-sidebar");
  const headerHost =
    document.querySelector("[data-app-header]") ||
    document.getElementById("app-header");

  if (layoutMode !== "auth" && sidebarHost) {
    sidebarHost.outerHTML = renderSidebar({ pageBase });
  }

  if (headerHost) {
    headerHost.outerHTML = renderHeader({ pageBase });
  }

  try {
    // Let the initial styles apply, then fade in.
    requestAnimationFrame(() => {
      document.documentElement.classList.remove("layout-loading");
    });
  } catch (_) {
    // ignore
  }
}

function mountEntityNavigation() {
  const pageBase = computePageBase();

  document.addEventListener("click", (e) => {
    const target = e.target;
    if (!(target instanceof Element)) return;

    // Only navigate when clicking an explicit play/navigation control.
    const el = target.closest("[data-nav-type][data-id]");
    if (!el) return;

    const type = el.getAttribute("data-nav-type");
    const id = el.getAttribute("data-id");
    if (!type || !id) return;

    const next =
      type === "song"
        ? "play.html"
        : type === "album"
          ? "playlist.html"
          : type === "artist"
            ? "user.html"
            : null;
    if (!next) return;

    e.preventDefault();
    const url = `${pageBase}${next}?type=${encodeURIComponent(type)}&id=${encodeURIComponent(id)}`;
    window.location.href = url;
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    mountLayout();
    mountEntityNavigation();
  });
} else {
  mountLayout();
  mountEntityNavigation();
}

