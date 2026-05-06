import { Link } from "react-router-dom";
import { FiZap, FiBarChart2, FiAward, FiLink, FiTarget, FiGlobe, FiStar, FiChevronDown, FiActivity, FiSearch, FiShield, FiCpu } from "react-icons/fi";
import { SiLeetcode, SiCodeforces, SiGithub, SiCodechef } from "react-icons/si";

const NavLink = ({ to, label, primary }) => (
  <Link to={to} className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all hover:scale-105 active:scale-95 ${primary ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/20" : "text-gray-400 hover:text-white"}`}>
    {label}
  </Link>
);

// AtCoder component
const AtCoderIcon = () => <span className="font-black text-sm">AT</span>;

export default function Landing() {
  const platforms = [
    { name: "LeetCode", icon: SiLeetcode, color: "from-orange-500 to-yellow-500", stats: [{ l: "Simple", v: "400+", c: "text-green-400" }, { l: "Moderate", v: "500+", c: "text-yellow-400" }, { l: "Advanced", v: "150+", c: "text-red-400" }] },
    { name: "Codeforces", icon: SiCodeforces, color: "from-blue-600 to-cyan-500", custom: <div className="p-4 bg-blue-500/10 rounded-xl border border-blue-500/20"><div className="text-xl font-black text-blue-400 italic">SKILLED PRACTITIONER</div><div className="text-[10px] text-gray-500 uppercase font-black">1984 Score</div></div> },
    { name: "GitHub", icon: SiGithub, color: "from-purple-600 to-pink-500", stats: [{ l: "Projects", v: 72 }, { l: "Stars", v: "8.1K" }], github: true },
    { name: "CodeChef", icon: SiCodechef, color: "from-amber-800 to-amber-600", stats: [{ l: "Score", v: "2140" }, { l: "Stars", v: "5★" }, { l: "Rank", v: "#142" }] },
    { name: "AtCoder", icon: AtCoderIcon, color: "from-gray-700 to-gray-900", stats: [{ l: "Score", v: "1420" }, { l: "Color", v: "Cyan" }, { l: "Events", v: 24 }] },
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
          <div className="text-2xl font-black italic flex items-center gap-2 group cursor-pointer text-white">
            <FiZap className="text-blue-500 group-hover:animate-bounce" /> <span>DEVLOG</span>
          </div>
          <div className="flex gap-2">
            <NavLink to="/login" label="Sign In" />
            <NavLink to="/register" label="Join Now" primary />
          </div>
        </nav>

        {/* Hero */}
        <section className="py-20 md:py-32 text-center space-y-10">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-widest animate-fade-in shadow-[0_0_20px_rgba(59,130,246,0.1)]">
            <FiStar className="animate-spin-slow" /> Centralize • Analyze • Elevate
          </div>
          <h1 className="text-6xl md:text-9xl font-black tracking-tighter italic leading-none fade-in-up">
            Your Coding <br /> <span className="animate-text-shine">Journey.</span>
          </h1>
          <p className="text-gray-400 text-xl md:text-2xl max-w-3xl mx-auto font-medium leading-relaxed fade-in-up delay-100">
            The all-in-one tracker for your professional progress. Link your services from <span className="text-white">LeetCode</span>, <span className="text-white">Codeforces</span>, <span className="text-white">GitHub</span>, <span className="text-white">AtCoder</span>, and <span className="text-white">CodeChef</span>.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center fade-in-up delay-200">
            <Link to="/register" className="px-12 py-5 bg-white text-black font-black italic rounded-2xl hover:bg-blue-600 hover:text-white transition-all shadow-xl active:scale-95 group">
              GET STARTED NOW <span className="inline-block group-hover:translate-x-1 transition-transform ml-1">→</span>
            </Link>
            <a href="#more" className="px-12 py-5 bg-white/5 border border-white/10 font-bold rounded-2xl hover:bg-white/10 transition-all flex items-center justify-center gap-3">
              LEARN MORE <FiChevronDown />
            </a>
          </div>
        </section>

        {/* Platform Display */}
        <section id="more" className="py-32">
          <div className="flex flex-col items-center mb-16 text-center">
            <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-500 mb-4">Supported Services</h2>
            <div className="text-4xl font-black italic tracking-tight">One System. Multiple Information Sources.</div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {platforms.map((p, i) => (
              <div key={i} className="glass-card-premium p-8 group hover:-translate-y-2 transition-all duration-500 border-none ring-1 ring-white/5">
                <div className="flex items-center gap-4 mb-8">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${p.color} flex items-center justify-center text-xl shadow-xl shadow-white/5`}><p.icon /></div>
                  <div className="text-lg font-black italic uppercase tracking-tighter">{p.name}</div>
                </div>
                {p.stats && (
                  <div className="flex flex-col gap-3">
                    {p.stats.map((s, si) => (
                      <div key={si} className="flex justify-between items-center py-2 border-b border-white/5">
                        <span className="text-[8px] font-black uppercase text-gray-500">{s.l}</span>
                        <span className={`text-sm font-black ${s.c || "text-white"}`}>{s.v}</span>
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
          </div>
        </section>

        {/* Features */}
        <section className="py-24 border-t border-white/5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {[
            { i: FiCpu, t: "Regular Information Matching", d: "Your progress information is automatically updated to show your latest activity." },
            { i: FiSearch, t: "Shared Profile Pages", d: "Beautiful shareable pages that showcase your professional journey milestones to the world." },
            { i: FiShield, t: "Trusted Information", d: "All statistics are fetched directly from the authorized services for accuracy." },
            { i: FiGlobe, t: "Consolidated Summary", d: "Get a clear picture of where you stand with consolidated measurements from all information points." }
          ].map((f, i) => (
            <div key={i} className="space-y-4 group">
              <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-blue-600/10 transition-colors">
                <f.i className="text-2xl text-blue-500" />
              </div>
              <h3 className="text-lg font-black italic uppercase tracking-tighter">{f.t}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{f.d}</p>
            </div>
          ))}
        </section>

        {/* Footer */}
        <footer className="py-20 border-t border-white/5">
          <div className="flex flex-col md:flex-row justify-between items-center gap-12">
            <div className="space-y-4 text-center md:text-left">
              <div className="text-2xl font-black italic flex items-center gap-2 justify-center md:justify-start">
                <FiZap className="text-blue-500" /> DEVLOG
              </div>
              <p className="text-gray-500 text-sm max-w-xs">Connecting the dots of your coding journey across every platform.</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-16 text-center md:text-left">
              <div className="space-y-4">
                <div className="text-[10px] font-black uppercase tracking-widest text-white">Platform</div>
                <div className="flex flex-col gap-2 text-gray-500 text-xs font-bold">
                  <a href="#" className="hover:text-blue-500 transition-colors">Dashboard</a>
                  <a href="#" className="hover:text-blue-500 transition-colors">Explorer</a>
                  <a href="#" className="hover:text-blue-500 transition-colors">API</a>
                </div>
              </div>
              <div className="space-y-4">
                <div className="text-[10px] font-black uppercase tracking-widest text-white">Community</div>
                <div className="flex flex-col gap-2 text-gray-500 text-xs font-bold">
                  <a href="#" className="hover:text-blue-500 transition-colors">Twitter</a>
                  <a href="#" className="hover:text-blue-500 transition-colors">Discord</a>
                  <a href="#" className="hover:text-blue-500 transition-colors">GitHub</a>
                </div>
              </div>
              <div className="space-y-4 col-span-2 sm:col-span-1 border-t border-white/5 sm:border-none pt-8 sm:pt-0">
                <div className="text-[10px] font-black uppercase tracking-widest text-white">Access</div>
                <div className="flex gap-4 justify-center md:justify-start">
                  <Link to="/login" className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all">Login</Link>
                  <Link to="/register" className="px-6 py-3 bg-blue-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/20">Join</Link>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-20 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 opacity-30">
            <div className="text-[8px] font-black uppercase tracking-[0.4em]">© 2026 DevLog Tracker</div>
            <div className="text-[8px] font-black uppercase tracking-[0.4em]">Built for Developers</div>
          </div>
        </footer>
      </div>
    </div>
  );
}
