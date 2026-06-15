import { useContext, useState } from "react";
import AuthContext from "../AuthProvider";

export default function CreatePlaylistModal({ open, onClose }) {
  const create= async(data)=>{
    const playlist=JSON.stringify(data);
    const fetchOption={
      method:'post',
      headers:{
        'Accept':'application/json',
        'Content-Type':'application/json',
      },
      body:playlist,
    }
    try{
      const response=await fetch('http://localhost:8080/playlist/add-playlist',fetchOption);
      if (response.ok){
        alert("You have created playlist successfully!");
      }
    } catch(error){
      console.log('Error when create new playlis',error);
      alert("Can't create playlist. Please try again.");
    }
  }
  const {currentUser,setCurrentUser}=useContext(AuthContext);
  const [name, setName] = useState("");

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="create-pl-title"
    >
      <div className="w-full max-w-md rounded-2xl border border-emerald-500/25 bg-background-light dark:bg-background-dark p-6 shadow-2xl">
        <h2 id="create-pl-title" className="text-xl font-bold text-slate-900 dark:text-white mb-2">
          New playlist
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
          Name your playlist. You can add tracks from Liked songs or another playlist afterward.
        </p>
        <input
          className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary mb-4"
          placeholder="Playlist name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoFocus
        />
        <div className="flex justify-end gap-2 border-t border-white/10 pt-4">
          <button
            type="button"
            className="rounded-full px-4 py-2 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-white/10"
            onClick={() => {
              setName("");
              onClose();
            }}
          >
            Cancel
          </button>
          <button
            type="button"
            className="rounded-full px-5 py-2 text-sm font-bold bg-gradient-to-r from-emerald-500 to-primary text-background-dark disabled:opacity-50"
            disabled={!name.trim()}
            onClick={() => {
              if (currentUser){
                const data={
                  'userid':currentUser.user_id,
                  'playlistname':name.trim()
                }
                create(data);
              }
              setName("");
              onClose();
            }}
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
}
