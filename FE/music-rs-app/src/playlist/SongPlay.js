export default function Playing({track}){
    console.log(track)
    return (<>
    {/* them hidden de an di */}
    <div className="w-80 border-l border-primary/10 bg-background-light dark:bg-background-dark  2xl:flex flex-col p-6">
<h3 className="text-lg font-bold mb-6">Now Playing</h3>
<div className="flex flex-col items-center">
<img className="size-64 rounded-xl shadow-2xl mb-6 object-cover border border-primary/10" data-alt="Currently playing track large album art" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCsy1zwO53O-uppfqU6nfUZjJmkmyGYeQ8U6n7Fr4G55r-uCfF0VwxgUi2hzQBiktgpbkrRMNWXlkBCQsxiyDVKVwmrJZ1RAOVu4LEE-6lSUKWrMRJckzSrbJo2OvlGCgL7XB1RMEDT669Ti8_Bvf9rwZ8vNQ-P-pyadcPPCuo2V2EXKJdfarEIYAwKiSECDtFxco7X9B_lip6Lqfp6s4KiXWp_F3xGFVC8A-zzt82iQugUDgWZ9dqC13F63l6AdIITuigrUdYY1Jg"/>
<div className="text-center mb-8">
<h4 className="text-xl font-bold">{track && track.track_name}</h4>
<p className="text-primary text-sm font-medium">{track && track.t_name}</p>
</div>
<div className="w-full mb-8">
<div className="flex items-center justify-between text-xs text-slate-500 mb-2">
<span>0:00</span>
{track && <span>{Math.round(track.duration_ms/60000)}:{('0'+Math.round(((track.duration_ms)%60000)/1000)).slice(-2)}</span>}
</div>
<div className="w-full h-1 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
<div className="h-full bg-primary" style={{width:"45%"}}></div>
</div>
</div>
<div className="flex items-center justify-center gap-6">
<button className="text-slate-400 hover:text-primary transition-colors">
<span className="material-symbols-outlined">shuffle</span>
</button>
<button className="text-slate-900 dark:text-slate-100 hover:text-primary transition-colors">
<span className="material-symbols-outlined text-3xl">skip_previous</span>
</button>
<button className="size-14 rounded-full bg-primary text-background-dark flex items-center justify-center shadow-lg shadow-primary/20 hover:scale-105 transition-transform">
<span className="material-symbols-outlined text-4xl fill-1">pause</span>
</button>
<button className="text-slate-900 dark:text-slate-100 hover:text-primary transition-colors">
<span className="material-symbols-outlined text-3xl">skip_next</span>
</button>
<button className="text-slate-400 hover:text-primary transition-colors">
<span className="material-symbols-outlined">repeat</span>
</button>
</div>
</div>
</div>
    </>)
}