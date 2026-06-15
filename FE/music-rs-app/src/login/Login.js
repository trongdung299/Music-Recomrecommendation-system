import Sidebar from "../appsidebar/Sidebar";
import AppHeader from "../appheader/Header";
import { useState, useMemo, useContext } from "react";
import AuthContext from "../AuthProvider";
import { Link, useNavigate } from "react-router-dom";
export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate=useNavigate();
    const {currentUser,setcurrentUser}=useContext(AuthContext);
    const canSubmit = useMemo(() => {
        return (
            email.trim().length > 3 &&
            password.length >= 6
        );
    }, [email, password]);
    const submit= async (data)=>{
        console.log(data)
        const user=JSON.stringify(data);
        const fetchOption ={
            "method":'post',
            "headers":{
                "Accept":'application/json',
                'Content-Type':'application/json',
            },
            "body":user,
        }
        try{
            const response= await fetch('http://localhost:8080/user/login',fetchOption);
            const result= await response.json();
            console.log(response)
            setcurrentUser(result);
            if(response.ok) {
                 alert(`Welcomeback ${result.user_name}`);
                if(result.favorite_genre)
                    {
                        navigate('/');
                    } else {
                        navigate('/ask_user')
                    }
            }  
            else
                alert(`Sever responses with status: ${response.status}`)
        } catch(error){
            console.error("Error when log in. Please try again",error);
            alert("Can not log in. Please check your information and try again.");
        }
    }
    return (<>
        {/* <header id="app-header"></header> */}
        <div className="flex min-h-screen w-full">
            <Sidebar />
            {/* !-- Right Side: Form Content -- lg:w-1/2*/}
            <div className="w-full  flex flex-col bg-background-dark min-h-screen ">
                <AppHeader />
                <div className="w-full max-w-md mx-auto ">
                    {/* !-- Mobile Logo -- */}
                    <div className="flex lg:hidden items-center gap-3 mb-10 justify-center">
                        <div className="bg-primary p-2 rounded-lg">
                            <span className="material-symbols-outlined text-background-dark font-bold">music_note</span>
                        </div>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">MusicStream</h1>
                    </div>
                    <div className="mb-10">
                        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Welcome back</h2>
                        <p className="text-slate-600 dark:text-slate-400">Enter your details to manage your account.</p>
                    </div>
                    {/* !-- Tabs -- */}
                    <div className="flex border-b border-white/10 mb-8">
                        <button className="flex-1 pb-4 text-sm font-bold border-b-2 border-primary text-primary transition-all">Sign In</button>
                        <a className="flex-1 pb-4 text-sm font-bold border-b-2 border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-all text-center" href="/create_account">Create Account</a>
                    </div>
                    {/* !-- Social Logins -- */}
                    <div className="grid grid-cols-2 gap-4 mb-8">
                        <button className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-slate-200 dark:border-primary/20 bg-white dark:bg-primary/5 hover:bg-slate-50 dark:hover:bg-primary/10 transition-colors">
                            <img alt="" className="w-5 h-5" data-alt="Google G Logo" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAEviuhFQ8kUaovdNWuEuvB1a_ljyuYthsJHkao2voCrWSxyi-frvAFNPA7kFasZqoeCQFreJpeRsYE7FshXVArKrEcf7H81WUCH4GLWL7Pis9MxDWx_F_bYW6SYD0LgGPHTvM_KwQtrbvIVupG4v9TkjvO7nonqhAENpFVt6bG87oz8OGwuCp3FSYZCaXhyzV5NYHxnFt7xjsgAGNqLfrtQZNy63n6ms9RzG-FLOtqEZQ8NEw2H7ak8D06nG89apVYuEliUMPiqQE" />
                            <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Google</span>
                        </button>
                        <button className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-slate-200 dark:border-primary/20 bg-white dark:bg-primary/5 hover:bg-slate-50 dark:hover:bg-primary/10 transition-colors">
                            <span className="material-symbols-outlined text-xl text-slate-900 dark:text-white">ios</span>
                            <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Apple</span>
                        </button>
                    </div>
                    <div className="relative flex items-center justify-center mb-8">
                        <div className="w-full border-t border-slate-200 dark:border-primary/10 p-4"></div>
                        <span className="absolute bg-background-light dark:bg-background-dark px-4 text-xs font-semibold text-slate-400 uppercase tracking-widest ">or continue with email</span>
                    </div>
                    {/* !-- Login Form -- */}
                    <form className="space-y-5"
                        onSubmit={(e) => {
                            e.preventDefault();
                            if (!canSubmit) return;
                            const data = {
                                'email': email,
                                'password': password
                            }
                            submit(data);
                        }}
                    >
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Email address</label>
                            <div className="relative">
                                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl">mail</span>
                                <input
                                    value={email}
                                    onChange={(e) => (setEmail(e.target.value))}
                                    className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-white/5 bg-white/5 focus:ring-1 focus:ring-primary focus:border-transparent outline-none transition-all text-white placeholder:text-slate-500" placeholder="name@example.com" type="email" />
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Password</label>
                                <a className="text-xs font-bold text-primary hover:underline" href="#">Forgot password?</a>
                            </div>
                            <div className="relative">
                                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl">lock</span>
                                <input
                                    value={password}
                                    onChange={(e) => (setPassword(e.target.value))}
                                    className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-white/5 bg-white/5 focus:ring-1 focus:ring-primary focus:border-transparent outline-none transition-all text-white placeholder:text-slate-500" placeholder="••••••••" type="password" />
                                <button className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200" type="button">
                                    <span className="material-symbols-outlined text-xl">visibility</span>
                                </button>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 py-2">
                            <input
                                className="w-4 h-4 rounded text-primary focus:ring-primary border-slate-300 dark:border-primary/30 bg-white dark:bg-transparent"
                                id="remember"
                                type="checkbox" />
                            <label
                                className="text-sm text-slate-600 dark:text-slate-400"
                                htmlFor="remember">Keep me logged in</label>
                        </div>
                        <button
                            className={
                                canSubmit
                                    ? "w-full bg-primary hover:bg-primary/90 text-black font-bold py-4 rounded-xl shadow-lg shadow-primary/10 transition-all flex items-center justify-center gap-2"
                                    : "w-full bg-primary hover:bg-primary/90 text-black font-bold py-4 rounded-xl shadow-lg shadow-primary/10 transition-all flex items-center justify-center gap-2 opacity-50 cursor-not-allowed"
                            }
                            type="submit">
                            Sign In
                            <span className="material-symbols-outlined text-xl">arrow_forward</span>
                        </button>
                    </form>
                    <div className="mt-10 text-center">
                        <p className="text-slate-600 dark:text-slate-400 text-sm">
                            Don't have an account?
                            <Link className="text-primary font-bold hover:underline ml-1" to="/create_account">Create an account for free</Link>
                        </p>
                    </div>
                </div>
                {/* !-- Help Button (Float or Footer style) -- */}
            </div>
        </div>
    </>)
}