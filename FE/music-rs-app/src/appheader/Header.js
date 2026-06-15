import { useContext } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../AuthProvider";
import Search from "../searchpage/Search";

export default function AppHeader(){
    const {currentUser,setcurrentUser}=useContext(AuthContext);
    return(
    <header className="sticky top-0 z-10 flex items-center justify-between px-8 py-4 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md">
      <div className="flex gap-4"></div>

      <div className="flex items-center gap-4">
        <div className="relative group">
          <Search/>
        </div>

        <button className="bg-slate-200 dark:bg-white/10 rounded-full p-2 hover:bg-slate-300 dark:hover:bg-white/20 transition-colors relative" type="button">
          <span className="material-symbols-outlined text-xl">notifications</span>
          <span className="absolute top-2 right-2.5 w-2 h-2 bg-primary rounded-full"></span>
        </button>

        <Link className="h-10 w-10 rounded-full bg-slate-300 dark:bg-slate-700 overflow-hidden border-2 border-transparent hover:border-white/20 transition-all" to={currentUser ? "/user" :'/login'} aria-label="Profile">
          <img
            className="w-full h-full object-cover"
            alt="User avatar"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCwNZwafGFIvZGq75OE7sH44FwCvQWoHzARVAQtVvomTZAx5dt0Tu_-Zmwohn0KudjBKvfDeBdsEToDz2VFLn0Sq-CPDSPQWgGe7Pd4dXJ0NUhQFPicBOnUhFkoHzRZC1Bt-czWZaQX-3gTItHX-JUxOPu3-O16joAKbvOJ1nkdXn451di1o_G0micm8oaJDU6ZWTdPH1V916A5iuGXdPn6cdpQqaoBCxPRIEKwgb-o3EBt4Ypa5rkhYzzvL9hNEpCMmFrLIaojpH4"
          />
        </Link>
      </div>
    </header>)
}