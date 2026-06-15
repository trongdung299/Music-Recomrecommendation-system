import { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
import HomeV2 from "./home/HomeV2";
import Login from "./login/Login";
import PlayList from "./playlist/Playlist";
import Play from "./play/Play";
import User from "./user/User";
import AskUser from "./askuser/AskUser";
import CreateAccount from "./createaccount/CreateAccount";
import AuthContext from "./AuthProvider";
import ShowAll from "./showall/ShowAll";
import PlaySongContext from "./context/PlaySongContext";
import SelectedPlayItemContext from "./context/SelectedPlayItemContext";
import SearchPage from "./searchpage/SearchPage";

export default function AppLayout() {
  const [currentUser,setcurrentUser]=useState();
  const [playSong,setplaySong]=useState();
  const [selectedPlayItem,setSelectedPlayItem]=useState();
  return (
    <AuthContext.Provider value={{currentUser,setcurrentUser}}>
      <PlaySongContext.Provider value={{playSong,setplaySong}}>
        <SelectedPlayItemContext.Provider value={{selectedPlayItem,setSelectedPlayItem}}>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomeV2 />} />
        <Route path="/login" element={<Login />} />
        <Route path="/playlist" element={<PlayList />} />
        <Route path="/play" element={<Play />} />
        <Route path="/user" element={<User />} />
        <Route path="/ask_user" element={<AskUser />} />
        <Route path="/create_account" element={<CreateAccount />} />
        <Route path="/creataccount" element={<CreateAccount />} />
        <Route path="/show_all" element={<ShowAll/>}/>
        <Route path="/search" element={<SearchPage/>}></Route>
      </Routes>
    </BrowserRouter>
    </SelectedPlayItemContext.Provider>
    </PlaySongContext.Provider>
    </AuthContext.Provider>
  );
}