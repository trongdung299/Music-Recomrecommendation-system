import { useContext, useEffect, useMemo, useState } from "react";
import { SONGS } from "../data/catalog";
import AuthContext from "../AuthProvider";

/** Emerald shades only — matches green + black app chrome */
const ROW_TINTS = [
  "from-emerald-600 to-emerald-900",
  "from-teal-600 to-emerald-950",
  "from-emerald-700 to-black",
  "from-cyan-700 to-emerald-950",
  "from-emerald-500 to-teal-900",
];

export default function AddSongsToPlaylistModal({ open, onClose, track }) {
  const [target, setTarget] = useState({});
  const [playlists,setPlaylists]=useState([])
  const {currentUser,setcurrentUser}=useContext(AuthContext);
  useEffect(()=>{
    if (!open) return;
    const fetchData=async ()=>{
      if(currentUser){
        const data={
          'userid':currentUser.user_id,
        }
         const dt=JSON.stringify(data);
        const fetchOption={
          method:"post",
          headers:{
            'Accept':'application/json',
            'Content-Type':'application/json',
          },
          body:dt,
        }
        try{
        const response=await fetch('http://localhost:8080/playlist/playlist-by-user',fetchOption)
        if(response.ok){
          console.log("Get playlist for this user successfully!");
        }
        const result=await response.json()
        setPlaylists(result)

      } catch(error){
        console.error("Error when getting playlist by user",error);
      }
      }
      
    }
    fetchData();
  },[open])
  if (!open) return null;
  const canAdd = Boolean(target && track);
  const insert=async(data_)=>{
    const _data=JSON.stringify(data_);
    const fetchOption={
      method:'post',
      headers:{
        'Accept':'application/json',
        'Content-Type':'application/json',
      },
      body:_data,
    }
    try{
      const response=await fetch("http://localhost:8080/playlist/add-track-to-playlist",fetchOption);
      if (response.ok){
        console.log("Add track to playlist successfully");
      } 
    } catch(err){
      console.log("An error occur when add track to playlist",err)
    }
  }
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-pl-title"
    >
      <div className="w-full max-w-md max-h-[88vh] overflow-hidden flex flex-col rounded-2xl border border-emerald-500/25 bg-background-dark shadow-2xl shadow-black">
        <div className="px-5 pt-5 pb-4 border-b border-emerald-500/20 bg-black/40">
          <h2
            id="add-pl-title"
            className="text-lg font-bold text-white"
          >
            Add to playlist
          </h2>
          { track ? (
            <p className="text-sm text-emerald-200/70 mt-1.5">
              <span className="text-primary font-semibold">{track.track_name}</span>{" "}
            </p>
          ) : (
            <p className="text-sm text-emerald-400/90 mt-1.5">
              Tap + on a song first, then pick a playlist below.
            </p>
          )}
        </div>

        <div className="px-4 py-4 overflow-y-auto custom-scrollbar flex-1 min-h-0 space-y-2 bg-black/30">
          <p className="text-[11px] font-bold uppercase tracking-widest text-emerald-500/70 px-1">
            Choose playlist
          </p>
          {playlists.length === 0 ? (
            <p className="text-sm text-emerald-200/50 px-2 py-2">
              No playlists yet. Create one on the Playlist page.
            </p>
          ) : (
            playlists.map((pl, i) => {
              const grad = ROW_TINTS[i % ROW_TINTS.length];
              const selected = target.playlistid === pl.playlistid;
              return (
                <button
                  key={pl.playlistid}
                  type="button"
                  onClick={() => setTarget(pl)}
                  className={
                    selected
                      ? `w-full text-left rounded-xl px-4 py-3.5 bg-gradient-to-r ${grad} text-white shadow-lg shadow-black/40 ring-2 ring-primary transition-all`
                      : `w-full text-left rounded-xl px-4 py-3.5 bg-gradient-to-r ${grad} text-emerald-100/95 shadow-md hover:brightness-110 border border-emerald-500/20 transition-all`
                  }
                >
                  <span className="block font-bold truncate">{pl.name}</span>
                  <span className="text-xs text-emerald-200/80 font-medium">
                    {pl.total_tracks} tracks
                  </span>
                </button>
              );
            })
          )}
        </div>

        <div className="px-4 py-3 flex justify-end gap-2 border-t border-emerald-500/30 bg-black">
          <button
            type="button"
            className="rounded-full px-4 py-2 text-sm font-semibold text-primary hover:bg-emerald-500/10 border border-transparent hover:border-emerald-500/30"
            onClick={()=>{
              onClose(false)
            }}
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={!canAdd}
            className="rounded-full px-5 py-2 text-sm font-bold bg-primary text-background-dark hover:bg-primary/90 shadow-md shadow-emerald-900/50 disabled:opacity-30 disabled:shadow-none"
            onClick={() => {
              if (!canAdd) return;
              //addSongsToPlaylist(targetId, validPrefill);
              const dt={
                'trackid':track.trackid,
                'playlistid':target.playlistid,
                'total_tracks': target.total_tracks+1
              }
              insert(dt);
              onClose(false);
            }}
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
