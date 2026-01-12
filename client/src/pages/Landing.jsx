import { Link } from "react-router-dom";
import {
  FiZap,
  FiBarChart2,
  FiTrendingUp,
  FiAward,
  FiLink,
  FiCode,
  FiTarget,
  FiGlobe,
  FiStar,
  FiChevronDown,
} from "react-icons/fi";
import { SiLeetcode, SiCodeforces, SiGithub } from "react-icons/si";

export default function Landing() {
  return (
    <div className="min-h-screen overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-blob"></div>
        <div className="absolute top-40 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl animate-blob animation-delay-4000"></div>
        <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-cyan-500/8 rounded-full blur-3xl animate-blob animation-delay-3000"></div>

        {/* Floating Code Particles */}
        <div className="absolute top-1/4 left-1/4 text-blue-500/20 text-6xl font-mono animate-float-slow">
          &lt;/&gt;
        </div>
        <div className="absolute top-1/3 right-1/3 text-purple-500/20 text-4xl font-mono animate-float-slow animation-delay-1000">
          {}
        </div>
        <div className="absolute bottom-1/3 left-1/5 text-cyan-500/20 text-5xl font-mono animate-float-slow animation-delay-2000">
          ( )
        </div>
        <div className="absolute top-2/3 right-1/4 text-pink-500/20 text-3xl font-mono animate-float-slow animation-delay-3000">
          [ ]
        </div>
      </div>

      {/* Hero Section */}
      <section className="min-h-screen flex flex-col justify-center px-4 md:px-8 py-12 md:py-20 relative">
        <div className="app-container relative z-10">
          {/* Navigation */}
          <nav className="flex justify-between items-center mb-12 md:mb-20 fade-in-up">
            <div className="text-2xl md:text-3xl font-black neon-text flex items-center gap-2 group">
              <FiZap className="text-blue-400 group-hover:animate-pulse" />
              <span className="hover:scale-105 transition-transform">
                DevLog
              </span>
            </div>
            <div className="flex gap-3 md:gap-4">
              <Link
                to="/login"
                className="px-4 py-2 md:px-6 md:py-2.5 text-sm md:text-base font-semibold text-gray-300 hover:text-white transition-all hover:scale-105"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 md:px-6 md:py-2.5 text-sm md:text-base font-bold bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg hover:shadow-blue-500/50 transition-all hover:scale-105 hover:-translate-y-0.5"
              >
                Get Started
              </Link>
            </div>
          </nav>

          {/* Hero Content */}
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-sm font-medium mb-6 fade-in-up delay-50">
              <FiStar className="animate-pulse" />
              <span>Track • Analyze • Grow</span>
            </div>
            <h1 className="text-5xl sm:text-6xl md:text-8xl font-black mb-8 fade-in-up delay-100 tracking-tight">
              <span className="text-white opacity-90">Track Your</span>
              <br />
              <span className="animate-text-shine inline-block">
                Coding Journey
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-400 mb-10 md:mb-16 max-w-3xl mx-auto fade-in-up delay-200 leading-relaxed font-medium">
              The ultimate developer activity hub. Aggregate stats from{" "}
              <span className="text-blue-400">LeetCode</span>,{" "}
              <span className="text-cyan-400">Codeforces</span>,
              and <span className="text-purple-400">GitHub</span>{" "}
              into one high-performance dashboard.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center fade-in-up delay-300">
              <Link
                to="/register"
                className="group px-10 py-5 text-xl font-bold bg-blue-600 text-white rounded-2xl hover:bg-blue-500 shadow-2xl shadow-blue-500/20 transition-all duration-300 flex items-center justify-center gap-3 overflow-hidden relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                Start Free Tracking
                <FiZap className="group-hover:rotate-12 transition-transform" />
              </Link>
              <a
                href="#platforms"
                className="group px-10 py-5 text-xl font-semibold text-white bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 hover:border-white/20 transition-all duration-300 flex items-center justify-center gap-3"
              >
                Explore More
                <FiChevronDown className="group-hover:translate-y-1 transition-transform text-blue-400" />
              </a>
            </div>
          </div>

          {/* Animated Stats Preview */}
          <div className="mt-20 md:mt-32 grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-10 max-w-4xl mx-auto fade-in-up delay-400">
            <div className="glass-card-premium p-8 text-center group">
              <div className="text-4xl md:text-5xl font-black text-blue-400 mb-2 group-hover:scale-110 transition-transform">500+</div>
              <div className="text-sm font-bold uppercase tracking-widest text-gray-500">Solved</div>
            </div>
            <div className="glass-card-premium p-8 text-center group" style={{ animationDelay: "200ms" }}>
              <div className="text-4xl md:text-5xl font-black text-purple-400 mb-2 group-hover:scale-110 transition-transform">1847</div>
              <div className="text-sm font-bold uppercase tracking-widest text-gray-500">Rating</div>
            </div>
            <div className="glass-card-premium p-8 text-center group" style={{ animationDelay: "400ms" }}>
              <div className="text-4xl md:text-5xl font-black text-pink-400 mb-2 group-hover:scale-110 transition-transform">2.5K</div>
              <div className="text-sm font-bold uppercase tracking-widest text-gray-500">Commits</div>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Showcase */}
      <section id="platforms" className="py-24 md:py-32 px-4 md:px-8 relative">
        <div className="app-container relative z-10">
          <div className="text-center mb-16 md:mb-24">
            <h2 className="text-4xl md:text-6xl font-black mb-6 fade-in-up">
              Integrated Ecosystems
            </h2>
            <p className="text-gray-400 text-xl max-w-2xl mx-auto fade-in-up delay-100 italic">
              "One dashboard to rule them all. One hub to track your growth."
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
            {/* LeetCode Card */}
            <div className="glass-card-premium p-8 group">
              <div className="flex items-center gap-6 mb-8">
                <div className="w-16 h-16 rounded-2xl leetcode-gradient flex items-center justify-center text-3xl shadow-xl shadow-orange-500/20 group-hover:scale-110 transition-transform">
                  <SiLeetcode className="text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">LeetCode</h3>
                  <p className="text-blue-400 font-medium">Data Structures</p>
                </div>
              </div>
              <div className="space-y-6">
                <div className="flex justify-between items-end">
                  <span className="text-gray-400 text-lg">Global Rank</span>
                  <span className="text-3xl font-black text-white italic">Top 5%</span>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-white/5 rounded-xl p-3 border border-white/5 group-hover:border-green-500/30 transition-colors">
                    <div className="text-green-400 font-bold">312</div>
                    <div className="text-[10px] text-gray-500 uppercase font-black">Easy</div>
                  </div>
                  <div className="bg-white/5 rounded-xl p-3 border border-white/5 group-hover:border-yellow-500/30 transition-colors">
                    <div className="text-yellow-400 font-bold">420</div>
                    <div className="text-[10px] text-gray-500 uppercase font-black">Medium</div>
                  </div>
                  <div className="bg-white/5 rounded-xl p-3 border border-white/5 group-hover:border-red-500/30 transition-colors">
                    <div className="text-red-400 font-bold">115</div>
                    <div className="text-[10px] text-gray-500 uppercase font-black">Hard</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Codeforces Card */}
            <div className="glass-card-premium p-8 group">
              <div className="flex items-center gap-6 mb-8">
                <div className="w-16 h-16 rounded-2xl codeforces-gradient flex items-center justify-center text-3xl shadow-xl shadow-blue-500/20 group-hover:scale-110 transition-transform">
                  <SiCodeforces className="text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">Codeforces</h3>
                  <p className="text-blue-400 font-medium">Contest Mastery</p>
                </div>
              </div>
              <div className="space-y-6">
                <div className="flex justify-between items-end">
                  <span className="text-gray-400 text-lg">Rating</span>
                  <span className="text-3xl font-black text-cyan-400">1847</span>
                </div>
                <div className="bg-blue-600/10 border border-blue-500/20 rounded-2xl p-5 flex justify-between items-center group-hover:bg-blue-600/20 transition-all">
                  <div>
                    <div className="text-blue-400 font-black text-xl italic uppercase">Expert</div>
                    <div className="text-xs text-gray-500 uppercase font-bold">Current Rank</div>
                  </div>
                  <div className="text-right">
                    <div className="text-white font-bold text-lg">52</div>
                    <div className="text-xs text-gray-500 uppercase font-bold">Contests</div>
                  </div>
                </div>
              </div>
            </div>

            {/* GitHub Card */}
            <div className="glass-card-premium p-8 group">
              <div className="flex items-center gap-6 mb-8">
                <div className="w-16 h-16 rounded-2xl github-gradient flex items-center justify-center text-3xl shadow-xl shadow-purple-500/20 group-hover:scale-110 transition-transform">
                  <SiGithub className="text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">GitHub</h3>
                  <p className="text-blue-400 font-medium">Open Source</p>
                </div>
              </div>
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center group-hover:border-purple-500/30 transition-colors">
                    <div className="text-2xl font-black text-white">48</div>
                    <div className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Repos</div>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center group-hover:border-yellow-500/30 transition-colors">
                    <div className="text-2xl font-black text-white">2.4K</div>
                    <div className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Stars</div>
                  </div>
                </div>
                <div className="flex gap-1.5 h-10 items-end">
                  {[0.4, 0.7, 0.5, 0.9, 0.6, 0.8, 0.4].map((op, i) => (
                    <div key={i} className="flex-1 bg-purple-500 rounded-sm transition-all hover:scale-y-110 cursor-pointer" style={{ opacity: op, height: `${op * 100}%` }}></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 md:py-32 px-4 md:px-8 relative bg-white/[0.01]">
        <div className="app-container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="space-y-4 fade-in-up">
              <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center text-xl shadow-lg shadow-blue-600/20">
                <FiBarChart2 />
              </div>
              <h3 className="text-xl font-bold">Unified Insights</h3>
              <p className="text-gray-500 text-sm leading-relaxed">Holistic overview of your performance across all platforms in real-time.</p>
            </div>
            <div className="space-y-4 fade-in-up delay-100">
              <div className="w-12 h-12 rounded-xl bg-purple-600 flex items-center justify-center text-xl shadow-lg shadow-purple-600/20">
                <FiTrendingUp />
              </div>
              <h3 className="text-xl font-bold">Meta-Growth</h3>
              <p className="text-gray-500 text-sm leading-relaxed">Track trends and identify patterns in your solved problems and rating history.</p>
            </div>
            <div className="space-y-4 fade-in-up delay-200">
              <div className="w-12 h-12 rounded-xl bg-pink-600 flex items-center justify-center text-xl shadow-lg shadow-pink-600/20">
                <FiAward />
              </div>
              <h3 className="text-xl font-bold">Milestone Radar</h3>
              <p className="text-gray-500 text-sm leading-relaxed">Visualize your progress towards top-tier rankings and competitive goals.</p>
            </div>
            <div className="space-y-4 fade-in-up delay-300">
              <div className="w-12 h-12 rounded-xl bg-cyan-600 flex items-center justify-center text-xl shadow-lg shadow-cyan-600/20">
                <FiLink />
              </div>
              <h3 className="text-xl font-bold">Instant Sync</h3>
              <p className="text-gray-500 text-sm leading-relaxed">Seamlessly connect handles with zero configuration required. It just works.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 md:py-24 px-4 md:px-8 relative">
        <div className="app-container">
          <div className="text-center mb-12 md:mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pink-500/10 border border-pink-500/30 text-pink-400 text-sm font-medium mb-4 fade-in-up">
              <FiTarget className="animate-pulse" />
              <span>Quick Setup</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-black mb-4 fade-in-up">
              <span className="neon-text">How It Works</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-xl mx-auto fade-in-up delay-100">
              Get started in just 3 simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto relative">
            {/* Connecting Lines (visible on md+) */}
            <div className="hidden md:block absolute top-10 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-30"></div>

            <div className="text-center fade-in-up delay-100 group">
              <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-3xl font-black text-white mb-6 pulse-glow group-hover:scale-110 transition-transform shadow-xl shadow-blue-500/30">
                1
              </div>
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                Create Account
              </h3>
              <p className="text-gray-400">
                Sign up for free with just your email and password
              </p>
            </div>

            <div className="text-center fade-in-up delay-200 group">
              <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center text-3xl font-black text-white mb-6 pulse-glow group-hover:scale-110 transition-transform shadow-xl shadow-purple-500/30">
                2
              </div>
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">
                Link Platforms
              </h3>
              <p className="text-gray-400">
                Connect your LeetCode, Codeforces, and GitHub accounts
              </p>
            </div>

            <div className="text-center fade-in-up delay-300 group">
              <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-r from-pink-600 to-orange-600 flex items-center justify-center text-3xl font-black text-white mb-6 pulse-glow group-hover:scale-110 transition-transform shadow-xl shadow-pink-500/30">
                3
              </div>
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-pink-400 transition-colors">
                Track Progress
              </h3>
              <p className="text-gray-400">
                View your unified stats and watch your skills grow
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 px-4 md:px-8 relative">
        <div className="app-container">
          <div className="glass-card neon-border rounded-3xl p-8 md:p-16 text-center max-w-3xl mx-auto fade-in-scale relative overflow-hidden group">
            {/* Animated Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

            <div className="relative z-10">
              <h2 className="text-3xl md:text-5xl font-black mb-4">
                <span className="neon-text">Ready to Start?</span>
              </h2>
              <p className="text-gray-400 text-lg mb-8 max-w-lg mx-auto">
                Join developers who are already tracking their coding journey
                with DevLog
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/register"
                  className="group/btn px-8 py-4 text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-xl hover:shadow-blue-500/40 hover:scale-105 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  Create Free Account
                  <span className="group-hover/btn:translate-x-1 transition-transform">
                    →
                  </span>
                </Link>
                <Link
                  to="/login"
                  className="px-8 py-4 text-lg font-semibold text-gray-300 border border-gray-600 rounded-xl hover:border-blue-500 hover:text-white hover:bg-blue-500/10 transition-all duration-300"
                >
                  Sign In
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 md:px-8 border-t border-gray-800 relative">
        <div className="app-container flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-xl font-black neon-text flex items-center gap-2 group">
            <FiZap className="text-blue-400 group-hover:animate-bounce" />
            <span>DevLog</span>
          </div>
          <p className="text-gray-500 text-sm">
            © 2026 DevLog. Track your coding journey.
          </p>
          <div className="flex gap-6">
            <a
              href="#platforms"
              className="text-gray-400 hover:text-blue-400 transition-colors text-sm hover:scale-105"
            >
              Platforms
            </a>
            <Link
              to="/login"
              className="text-gray-400 hover:text-purple-400 transition-colors text-sm hover:scale-105"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="text-gray-400 hover:text-pink-400 transition-colors text-sm hover:scale-105"
            >
              Register
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
