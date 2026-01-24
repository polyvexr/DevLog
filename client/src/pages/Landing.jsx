import { Link } from "react-router-dom";
import { FiZap, FiBarChart2, FiAward, FiLink, FiTarget, FiGlobe, FiStar, FiChevronDown, FiActivity } from "react-icons/fi";
import { SiLeetcode, SiCodeforces, SiGithub } from "react-icons/si";

const NavLink = ({ to, label, primary }) => (
  <Link to={to} className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all hover:scale-105 active:scale-95 ${primary ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/20" : "text-gray-400 hover:text-white"}`}>
    {label}
  </Link>
);

export default function Landing() {
  const platforms = [
    { name: "LeetCode", icon: SiLeetcode, color: "from-orange-500 to-yellow-500", stats: [{ l: "Easy", v: 312, c: "text-green-400" }, { l: "Medium", v: 420, c: "text-yellow-400" }, { l: "Hard", v: 115, c: "text-red-400" }] },
    { name: "Codeforces", icon: SiCodeforces, color: "from-blue-600 to-cyan-500", custom: <div className="p-4 bg-blue-500/10 rounded-xl border border-blue-500/20"><div className="text-xl font-black text-blue-400 italic">EXPERT</div><div className="text-[10px] text-gray-500 uppercase font-black">1847 Rating</div></div> },
    { name: "GitHub", icon: SiGithub, color: "from-purple-600 to-pink-500", stats: [{ l: "Repos", v: 48 }, { l: "Stars", v: "2.4K" }], github: true }
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-blue-500/30">
      {/* Visual Effects */}
      <div className="fixed inset-0 pointer-events-none opacity-40">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/20 blur-[120px] animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/20 blur-[120px] animate-pulse delay-700" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <nav className="flex justify-between items-center py-10 fade-in-up">
          <div className="text-2xl font-black italic flex items-center gap-2 group cursor-pointer">
            <FiZap className="text-blue-500 group-hover:animate-bounce" /> <span>DevLog</span>
          </div>
          <div className="flex gap-2">
            <NavLink to="/login" label="Sign In" />
            <NavLink to="/register" label="Join Now" primary />
          </div>
        </nav>

        {/* Hero */}
        <section className="py-20 md:py-32 text-center space-y-10">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-widest animate-fade-in">
            <FiStar className="animate-spin-slow" /> Track • Analyze • Dominate
          </div>
          <h1 className="text-6xl md:text-9xl font-black tracking-tighter italic leading-none fade-in-up">
            Your Code. <br /> <span className="animate-text-shine">Unified.</span>
          </h1>
          <p className="text-gray-400 text-xl md:text-2xl max-w-3xl mx-auto font-medium leading-relaxed fade-in-up delay-100">
            One terminal for all your stats. Sync <span className="text-white">LeetCode</span>, <span className="text-white">Codeforces</span>, and <span className="text-white">GitHub</span> effortlessly.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center fade-in-up delay-200">
            <Link to="/register" className="px-12 py-5 bg-white text-black font-black italic rounded-2xl hover:bg-blue-500 hover:text-white transition-all shadow-xl active:scale-95">START TRACKING</Link>
            <a href="#more" className="px-12 py-5 bg-white/5 border border-white/10 font-bold rounded-2xl hover:bg-white/10 transition-all flex items-center justify-center gap-3">EXPLORE <FiChevronDown /></a>
          </div>
        </section>

        {/* Platform Display */}
        <section id="more" className="py-32 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {platforms.map((p, i) => (
            <div key={i} className="glass-card-premium p-10 group hover:-translate-y-2 transition-all duration-500">
              <div className="flex items-center gap-5 mb-10">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${p.color} flex items-center justify-center text-2xl shadow-xl shadow-white/5`}><p.icon /></div>
                <div className="text-2xl font-black italic uppercase tracking-tighter">{p.name}</div>
              </div>
              {p.stats && (
                <div className="grid grid-cols-3 gap-4">
                  {p.stats.map((s, si) => (
                    <div key={si} className="p-3 bg-white/5 rounded-xl border border-white/5 text-center">
                      <div className={`text-xl font-black ${s.c || "text-white"}`}>{s.v}</div>
                      <div className="text-[8px] font-black uppercase text-gray-500">{s.l}</div>
                    </div>
                  ))}
                </div>
              )}
              {p.custom}
              {p.github && (
                <div className="flex items-end gap-1.5 h-16 mt-6">
                  {[0.3, 0.6, 0.4, 0.9, 0.5, 0.8, 0.4].map((h, hi) => (
                    <div key={hi} className="flex-1 bg-purple-500/50 rounded-sm" style={{ height: `${h * 100}%` }} />
                  ))}
                </div>
              )}
            </div>
          ))}
        </section>

        {/* Features */}
        <section className="py-24 border-t border-white/5 grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            { i: FiBarChart2, t: "Unified Dashboard", d: "Aggregated overview of your coding activity." },
            { i: FiAward, t: "Global Rankings", d: "Track your position across world leaderboards." },
            { i: FiLink, t: "Seamless Sync", d: "One-click connection for all major platforms." }
          ].map((f, i) => (
            <div key={i} className="space-y-4">
              <f.i className="text-3xl text-blue-500" />
              <h3 className="text-xl font-black italic uppercase tracking-tighter">{f.t}</h3>
              <p className="text-gray-500 text-sm">{f.d}</p>
            </div>
          ))}
        </section>

        {/* Footer */}
        <footer className="py-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 opacity-50">
          <div className="flex items-center gap-2 font-black italic"><FiZap className="text-blue-500" /> DevLog</div>
          <div className="text-[10px] font-black uppercase tracking-widest">© 2026 Developer Activity Terminal</div>
          <div className="flex gap-8 text-[10px] font-black uppercase tracking-widest">
            <Link to="/login" className="hover:text-white transition-colors">Login</Link>
            <Link to="/register" className="hover:text-white transition-colors">Join</Link>
          </div>
        </footer>
      </div>
    </div>
  );
}
