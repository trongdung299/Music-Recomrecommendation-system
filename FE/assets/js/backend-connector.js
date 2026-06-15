/*
  Backend connector for MusicRS frontend.
  - Uses real backend when BASE_URL is available.
  - Falls back to frontend-contract.json for local/dev.
*/

(function () {
  const DEFAULT_BASE_URL = "";
  const CONTRACT_PATH = "../assets/data/frontend-contract.json";

  async function readJson(url) {
    const res = await fetch(url, {
      headers: { Accept: "application/json" }
    });
    if (!res.ok) {
      throw new Error("Request failed: " + res.status + " " + url);
    }
    return res.json();
  }

  async function getContractData() {
    return readJson(CONTRACT_PATH);
  }

  function buildUrl(path, baseUrl) {
    if (!baseUrl) return null;
    return baseUrl.replace(/\/+$/, "") + "/" + path.replace(/^\/+/, "");
  }

  async function getData(path, contractFallbackSelector, options) {
    const baseUrl =
      (options && options.baseUrl) ||
      window.MUSICRS_API_BASE_URL ||
      DEFAULT_BASE_URL;

    const apiUrl = buildUrl(path, baseUrl);

    if (apiUrl) {
      return readJson(apiUrl);
    }

    const contract = await getContractData();
    return contractFallbackSelector(contract);
  }

  const BackendConnector = {
    getHomeData(options) {
      return getData("/api/home", (c) => c.home, options);
    },
    getPlaylistPageData(options) {
      return getData("/api/playlist-page", (c) => c.playlistPage, options);
    },
    getPlayPageData(options) {
      return getData("/api/play-page", (c) => c.playPage, options);
    },
    getUserPageData(options) {
      return getData("/api/user-page", (c) => c.userPage, options);
    },
    getAuthSchema(options) {
      return getData("/api/auth/schema", (c) => c.auth, options);
    },
    getRawContract(options) {
      return getData("/api/frontend-contract", (c) => c, options);
    }
  };

  window.BackendConnector = BackendConnector;
})();

