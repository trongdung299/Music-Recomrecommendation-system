import { useMemo, useState } from "react";
import AppHeader from "../appheader/Header";
import Sidebar from "../appsidebar/Sidebar";
import { Link, useNavigate } from "react-router-dom";

export default function CreateAccount() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate=useNavigate();
  const canSubmit = useMemo(() => {
    return (
      fullName.trim().length > 1 &&
      email.trim().length > 3 &&
      password.length >= 6 &&
      confirmPassword === password
    );
  }, [fullName, email, password, confirmPassword]);
  const submit= async(data)=>{
    const user=JSON.stringify(data);
    const fetchOption ={
      method:'post',
      headers:{
        'Accept':'application/json',
        'Content-Type':'application/json',
      },
      body:user,
    }
    try{
      const response= await fetch('http://localhost:8080/user/signup',fetchOption);
      if(response.ok) {
        alert("You have signup successfully. Now you can login");
        navigate('/login')
      }

    } catch (error){
      console.error("Error when creating new user",error);
      alert("Can not sign up. Please try again.");
    }
  }
  return (
    <>
      <div className="flex min-h-screen w-full">
        <Sidebar />
        <div className="w-full flex flex-col bg-background-dark min-h-screen">
          <AppHeader />
          <div className="w-full max-w-md mx-auto px-4 pb-10 pt-6">
            <div className="flex lg:hidden items-center gap-3 mb-6 justify-center">
              <div className="bg-primary p-2 rounded-lg">
                <span className="material-symbols-outlined text-background-dark font-bold">
                  music_note
                </span>
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                MusicStream
              </h1>
            </div>

            <div className="mb-6">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                Create account
              </h2>
              <p className="text-slate-600 dark:text-slate-400">
                Sign up to personalize your feed and play music.
              </p>
            </div>

            <div className="flex border-b border-white/10 mb-8">
              <a
                className="flex-1 pb-4 text-sm font-bold border-b-2 border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-all text-center"
                href="/login"
              >
                Sign In
              </a>
              <div className="flex-1 pb-4 text-sm font-bold border-b-2 border-primary text-primary transition-all text-center">
                Create Account
              </div>
            </div>

            <form
              className="space-y-5"
              onSubmit={(e) => {
                e.preventDefault();
                if (!canSubmit) return;
                const data={
                  'user_name':fullName,
                  'email':email,
                  'password':password
                }
                submit(data);
              }}
            >
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Full name
                </label>
                <input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-4 pr-4 py-3.5 rounded-xl border border-white/5 bg-white/5 focus:ring-1 focus:ring-primary focus:border-transparent outline-none transition-all text-white placeholder:text-slate-500"
                  placeholder="Your name"
                  type="text"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Email address
                </label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-4 pr-4 py-3.5 rounded-xl border border-white/5 bg-white/5 focus:ring-1 focus:ring-primary focus:border-transparent outline-none transition-all text-white placeholder:text-slate-500"
                  placeholder="name@example.com"
                  type="email"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Password
                </label>
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-4 pr-4 py-3.5 rounded-xl border border-white/5 bg-white/5 focus:ring-1 focus:ring-primary focus:border-transparent outline-none transition-all text-white placeholder:text-slate-500"
                  placeholder="At least 6 characters"
                  type="password"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Confirm password
                </label>
                <input
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-4 pr-4 py-3.5 rounded-xl border border-white/5 bg-white/5 focus:ring-1 focus:ring-primary focus:border-transparent outline-none transition-all text-white placeholder:text-slate-500"
                  placeholder="Re-type password"
                  type="password"
                />
              </div>

              <button
                className={
                  canSubmit
                    ? "w-full bg-primary hover:bg-primary/90 text-black font-bold py-4 rounded-xl shadow-lg shadow-primary/10 transition-all flex items-center justify-center gap-2"
                    : "w-full bg-primary hover:bg-primary/90 text-black font-bold py-4 rounded-xl shadow-lg shadow-primary/10 transition-all flex items-center justify-center gap-2 opacity-50 cursor-not-allowed"
                }
                type="submit"
                disabled={!canSubmit}
              >
                Create Account
                <span className="material-symbols-outlined text-xl">
                  arrow_forward
                </span>
              </button>
            </form>

            <div className="mt-10 text-center">
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                Already have an account?{" "}
                <Link className="text-primary font-bold hover:underline ml-1" to="/login">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

