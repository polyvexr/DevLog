import { Link } from "react-router-dom";
import { FiZap, FiChevronDown, FiSearch, FiShield, FiCpu, FiGlobe } from "react-icons/fi";
import { SiLeetcode, SiCodeforces, SiGithub, SiCodechef } from "react-icons/si";

const NavLink = ({ to, label, primary }) => (
  <Link
    to={to}
    className={`px-4 py-2 rounded-lg text-xs font-mono tracking-wider uppercase transition-all duration-200 ${
      primary
        ? "bg-[#e23e2d] hover:bg-[#cf2e2e] text-white shadow-lg shadow-red-600/10"
        : "text-slate-400 hover:text-slate-100"
    }`}
  >
    {label}
  </Link>
);

export default function Landing() {
  const platforms = [
    {
      name: "LeetCode",
      icon: SiLeetcode,
      color: "text-orange-500",
      stats: [{ l: "Simple", v: "400+" }, { l: "Moderate", v: "500+" }, { l: "Advanced", v: "150+" }]
    },
    {
      name: "Codeforces",
      icon: SiCodeforces,
      color: "text-blue-500",
      stats: [{ l: "Score", v: "1984" }, { l: "Rank", v: "Skilled" }]
    },
    {
      name: "GitHub",
      icon: SiGithub,
      color: "text-slate-200",
      stats: [{ l: "Repositories", v: "72" }, { l: "Stars Earned", v: "8.1K" }]
    },
    {
      name: "CodeChef",
      icon: SiCodechef,
      color: "text-amber-600",
      stats: [{ l: "Score", v: "2140" }, { l: "Stars", v: "5★" }, { l: "Rank", v: "#142" }]
    },
    {
      name: "AtCoder",
      icon: () => <span className="font-bold text-[9px] text-indigo-400 bg-indigo-500/10 px-1.5 py-0.5 rounded border border-indigo-500/20">AT</span>,
      color: "",
      stats: [{ l: "Score", v: "1420" }, { l: "Color", v: "Cyan" }]
    }
  ];

  return (
    <div className="min-h-screen bg-[#0c0c0c] text-slate-200 selection:bg-red-500/20 overflow-x-hidden">
      <div className="w-full max-w-[1440px] mx-auto px-6 md:px-12 xl:px-16">
        <nav className="flex justify-between items-center py-6 border-b border-[#222225]">
          <div className="text-lg font-[Cormorant_Garamond] font-semibold italic tracking-tight flex items-center gap-2 text-white">
            <FiZap className="text-[#e23e2d] text-base" />
            <span>DevLog™</span>
          </div>
          <div className="flex items-center gap-2">
            <NavLink to="/login" label="Sign In" />
            <NavLink to="/register" label="Join Now" primary />
          </div>
        </nav>

        {/* Simplified Centered Hero */}
        <section className="py-24 md:py-32 text-center max-w-2xl mx-auto space-y-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#e23e2d]/10 border border-[#e23e2d]/20 text-[#e23e2d] font-mono text-[9px] font-semibold uppercase tracking-wider">
            <span>Centralize • Analyze • Elevate</span>
          </div>
          <h1 className="text-4xl md:text-5xl xl:text-6xl font-[Cormorant_Garamond] font-light italic text-white leading-tight tracking-tight">
            Your coding stats. <br />
            <span className="text-[#e23e2d]">All in one place.</span>
          </h1>
          <p className="text-slate-400 text-sm md:text-base leading-relaxed">
            Track progress, monitor ratings, and analyze pattern updates across LeetCode, Codeforces, GitHub, AtCoder, and CodeChef in one unified workspace.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <Link to="/register" className="px-6 py-3 bg-[#e23e2d] hover:bg-[#cf2e2e] text-white font-mono text-xs tracking-wider uppercase rounded transition-colors text-center font-semibold">Get Started Now</Link>
            <a href="#services" className="px-6 py-3 bg-[#121214] border border-[#222225] hover:bg-[#1c1c1f] text-slate-200 font-mono text-xs tracking-wider uppercase rounded transition-colors text-center flex items-center justify-center gap-2">Explore Services <FiChevronDown className="text-slate-500" /></a>
          </div>
        </section>

        <section id="services" className="py-24 border-t border-[#222225]">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
            <div>
              <h2 className="text-xs font-mono font-semibold uppercase tracking-widest text-[#e23e2d] mb-2">Supported Services</h2>
              <p className="text-2xl md:text-3xl font-[Cormorant_Garamond] italic text-slate-200">Consolidated platform integrations.</p>
            </div>
            <p className="text-slate-400 text-sm max-w-md leading-relaxed">Automated syncing fetches your profiles, scores, and contributions directly from official platform APIs.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {platforms.map((p, i) => (
              <div
                key={i}
                className="bg-[#121214] border border-[#222225] hover:border-neutral-700 rounded-xl p-5 flex flex-col justify-between min-h-[180px] transition-all"
              >
                <div>
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-9 h-9 rounded bg-[#0c0c0c] border border-[#222225] flex items-center justify-center text-lg">
                      <p.icon className={p.color} />
                    </div>
                    <h3 className="text-sm font-[Cormorant_Garamond] font-semibold italic text-slate-100">{p.name}</h3>
                  </div>
                  <div className="space-y-2 font-mono">
                    {p.stats.map((s, idx) => (
                      <div key={idx} className="flex justify-between text-[10px]">
                        <span className="text-slate-500">{s.l}</span>
                        <span className="font-bold text-slate-200">{s.v}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="py-20 border-t border-[#222225] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { i: FiCpu, t: "Regular Syncing", d: "Your progress metrics are automatically matched to show your latest active coding logs." },
            { i: FiSearch, t: "Shared Profiles", d: "Beautiful shareable pages that showcase your professional journey milestones to the world." },
            { i: FiShield, t: "Trusted Statistics", d: "All statistics are fetched directly from the authorized services for complete transparency." },
            { i: FiGlobe, t: "Consolidated Summary", d: "Get a clear picture of where you stand with consolidated measurements from all accounts." }
          ].map((f, i) => (
            <div key={i} className="space-y-3">
              <div className="w-10 h-10 rounded bg-[#121214] border border-[#222225] flex items-center justify-center"><f.i className="text-xl text-slate-400" /></div>
              <h3 className="text-sm font-[Cormorant_Garamond] font-semibold italic text-slate-200 tracking-tight">{f.t}</h3>
              <p className="text-slate-400 text-xs leading-relaxed">{f.d}</p>
            </div>
          ))}
        </section>

        <footer className="py-16 border-t border-[#222225]">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
            <div className="space-y-3">
              <div className="text-lg font-[Cormorant_Garamond] font-semibold italic tracking-tight flex items-center gap-2 text-white">
                <FiZap className="text-[#e23e2d] text-base" /> DevLog™
              </div>
              <p className="text-slate-500 text-xs max-w-xs leading-relaxed">Connecting the dots of your coding journey across every platform.</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-12 sm:gap-16 font-mono text-xs">
              {[
                { title: "Platform", links: ["Dashboard", "Explorer", "API"] },
                { title: "Community", links: ["Twitter", "Discord", "GitHub"] }
              ].map((g, i) => (
                <div key={i} className="space-y-3">
                  <div className="text-[9px] font-semibold uppercase tracking-wider text-slate-500">{g.title}</div>
                  <div className="flex flex-col gap-2 text-slate-400">
                    {g.links.map((l, li) => <a key={li} href="#" className="hover:text-slate-200 transition-colors">{l}</a>)}
                  </div>
                </div>
              ))}
              <div className="space-y-3 col-span-2 sm:col-span-1">
                <div className="text-[9px] font-semibold uppercase tracking-wider text-slate-500">Access</div>
                <div className="flex gap-2">
                  <Link to="/login" className="px-3 py-1.5 bg-[#121214] border border-[#222225] rounded text-[9px] font-medium hover:bg-[#1c1c1f] text-slate-300 transition-all uppercase tracking-wider">Login</Link>
                  <Link to="/register" className="px-3 py-1.5 bg-[#e23e2d] text-white rounded text-[9px] font-semibold hover:bg-[#cf2e2e] transition-all uppercase tracking-wider">Join</Link>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-16 pt-8 border-t border-[#222225] flex flex-col sm:flex-row justify-between items-center gap-4 font-mono text-[9px] text-slate-600 font-medium">
            <div>© {new Date().getFullYear()} DevLog Tracker. All rights reserved.</div>
            <div>Built for Developers</div>
          </div>
        </footer>
      </div>
    </div>
  );
}
