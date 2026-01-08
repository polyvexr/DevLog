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
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-black mb-6 fade-in-up delay-100">
              <span className="neon-text">Track Your</span>
              <br />
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent gradient-animate inline-block">
                Coding Journey
              </span>
            </h1>
            <p className="text-lg md:text-xl text-gray-400 mb-8 md:mb-12 max-w-2xl mx-auto fade-in-up delay-200 leading-relaxed">
              Aggregate your coding stats from{" "}
              <span className="text-orange-400 font-semibold">LeetCode</span>,{" "}
              <span className="text-cyan-400 font-semibold">Codeforces</span>,
              and <span className="text-purple-400 font-semibold">GitHub</span>{" "}
              in one beautiful dashboard. Monitor your progress, track your
              rankings, and visualize your growth.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center fade-in-up delay-300">
              <Link
                to="/register"
                className="group px-8 py-4 text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-xl hover:shadow-blue-500/40 hover:scale-105 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2"
              >
                Start Tracking Free
                <span className="group-hover:translate-x-1 transition-transform">
                  →
                </span>
              </Link>
              <a
                href="#platforms"
                className="group px-8 py-4 text-lg font-semibold text-gray-300 border border-gray-600 rounded-xl hover:border-blue-500 hover:text-white hover:bg-blue-500/10 transition-all duration-300 flex items-center justify-center gap-2"
              >
                Learn More
                <FiChevronDown className="group-hover:translate-y-1 transition-transform" />
              </a>
            </div>
          </div>

          {/* Animated Stats Preview */}
          <div className="mt-16 md:mt-24 grid grid-cols-3 gap-4 md:gap-8 max-w-2xl mx-auto fade-in-up delay-400">
            <div className="glass-card p-4 md:p-6 rounded-xl text-center float-anim hover:scale-105 transition-transform cursor-default group">
              <div className="stat-value-lg group-hover:scale-110 transition-transform">
                500+
              </div>
              <div className="stat-label mt-2">Problems Solved</div>
            </div>
            <div
              className="glass-card p-4 md:p-6 rounded-xl text-center float-anim hover:scale-105 transition-transform cursor-default group"
              style={{ animationDelay: "1s" }}
            >
              <div className="stat-value-lg group-hover:scale-110 transition-transform">
                1847
              </div>
              <div className="stat-label mt-2">Rating</div>
            </div>
            <div
              className="glass-card p-4 md:p-6 rounded-xl text-center float-anim hover:scale-105 transition-transform cursor-default group"
              style={{ animationDelay: "2s" }}
            >
              <div className="stat-value-lg group-hover:scale-110 transition-transform">
                2.5K
              </div>
              <div className="stat-label mt-2">Contributions</div>
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce fade-in-up delay-500">
            <FiChevronDown className="text-gray-500 text-2xl" />
          </div>
        </div>
      </section>

      {/* Platform Showcase */}
      <section id="platforms" className="py-16 md:py-24 px-4 md:px-8 relative">
        <div className="app-container relative z-10">
          <div className="text-center mb-12 md:mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 text-sm font-medium mb-4 fade-in-up">
              <FiGlobe className="animate-spin-slow" />
              <span>Multi-Platform Support</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-black mb-4 fade-in-up">
              <span className="neon-text">All Your Platforms</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-xl mx-auto fade-in-up delay-100">
              Connect your coding accounts and see your stats unified in one
              place
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {/* LeetCode Card */}
            <div className="glass-card-hover rounded-2xl overflow-hidden fade-in-up delay-100 group">
              <div className="leetcode-gradient h-2 group-hover:h-3 transition-all"></div>
              <div className="p-6 md:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl leetcode-gradient flex items-center justify-center text-2xl group-hover:scale-110 transition-transform shadow-lg shadow-orange-500/20">
                    <SiLeetcode className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">LeetCode</h3>
                    <p className="text-sm text-gray-400">Problem Solving</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Total Solved</span>
                    <span className="text-2xl font-bold text-orange-400 group-hover:scale-110 transition-transform">
                      847
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="bg-green-500/10 rounded-lg p-2 hover:bg-green-500/20 transition-colors">
                      <div className="text-green-400 font-bold">312</div>
                      <div className="text-xs text-gray-500">Easy</div>
                    </div>
                    <div className="bg-yellow-500/10 rounded-lg p-2 hover:bg-yellow-500/20 transition-colors">
                      <div className="text-yellow-400 font-bold">420</div>
                      <div className="text-xs text-gray-500">Medium</div>
                    </div>
                    <div className="bg-red-500/10 rounded-lg p-2 hover:bg-red-500/20 transition-colors">
                      <div className="text-red-400 font-bold">115</div>
                      <div className="text-xs text-gray-500">Hard</div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-500">Progress</span>
                      <span className="text-gray-400">28%</span>
                    </div>
                    <div className="progress-bar">
                      <div
                        className="progress-bar-fill"
                        style={{ width: "28%" }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Codeforces Card */}
            <div className="glass-card-hover rounded-2xl overflow-hidden fade-in-up delay-200 group">
              <div className="codeforces-gradient h-2 group-hover:h-3 transition-all"></div>
              <div className="p-6 md:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl codeforces-gradient flex items-center justify-center text-2xl group-hover:scale-110 transition-transform shadow-lg shadow-blue-500/20">
                    <SiCodeforces className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Codeforces</h3>
                    <p className="text-sm text-gray-400">
                      Competitive Programming
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Current Rating</span>
                    <span className="text-2xl font-bold text-cyan-400 group-hover:scale-110 transition-transform">
                      1847
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-blue-500/10 rounded-lg p-3 text-center hover:bg-blue-500/20 transition-colors">
                      <div className="text-blue-400 font-bold text-lg">
                        Expert
                      </div>
                      <div className="text-xs text-gray-500">Rank</div>
                    </div>
                    <div className="bg-purple-500/10 rounded-lg p-3 text-center hover:bg-purple-500/20 transition-colors">
                      <div className="text-purple-400 font-bold text-lg">
                        52
                      </div>
                      <div className="text-xs text-gray-500">Contests</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-green-400 flex items-center gap-1">
                      <FiTrendingUp className="text-xs" /> +127
                    </span>
                    <span className="text-gray-500">from last contest</span>
                  </div>
                </div>
              </div>
            </div>

            {/* GitHub Card */}
            <div className="glass-card-hover rounded-2xl overflow-hidden fade-in-up delay-300 sm:col-span-2 lg:col-span-1 group">
              <div className="github-gradient h-2 group-hover:h-3 transition-all"></div>
              <div className="p-6 md:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl github-gradient flex items-center justify-center text-2xl group-hover:scale-110 transition-transform shadow-lg shadow-purple-500/20">
                    <SiGithub className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">GitHub</h3>
                    <p className="text-sm text-gray-400">Open Source</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-purple-500/10 rounded-lg p-3 text-center hover:bg-purple-500/20 transition-colors">
                      <div className="text-purple-400 font-bold text-lg">
                        48
                      </div>
                      <div className="text-xs text-gray-500">Repositories</div>
                    </div>
                    <div className="bg-yellow-500/10 rounded-lg p-3 text-center hover:bg-yellow-500/20 transition-colors">
                      <div className="text-yellow-400 font-bold text-lg">
                        2.4K
                      </div>
                      <div className="text-xs text-gray-500">Stars</div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Followers</span>
                    <span className="text-xl font-bold text-purple-400 group-hover:scale-110 transition-transform">
                      1,247
                    </span>
                  </div>
                  <div className="flex gap-1">
                    {[...Array(7)].map((_, i) => (
                      <div
                        key={i}
                        className="flex-1 h-8 rounded hover:scale-110 transition-transform cursor-pointer"
                        style={{
                          background: `rgba(139, 92, 246, ${
                            0.2 + Math.random() * 0.6
                          })`,
                        }}
                      ></div>
                    ))}
                  </div>
                  <div className="text-xs text-gray-500 text-center">
                    Weekly Activity
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 px-4 md:px-8 relative">
        <div className="app-container">
          <div className="text-center mb-12 md:mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-sm font-medium mb-4 fade-in-up">
              <FiCode className="animate-pulse" />
              <span>Everything You Need</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-black mb-4 fade-in-up">
              <span className="neon-text">Powerful Features</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-xl mx-auto fade-in-up delay-100">
              Everything you need to track and improve your coding skills
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-4xl mx-auto">
            <div className="glass-card p-6 md:p-8 rounded-2xl fade-in-up delay-100 group hover:scale-105 transition-all duration-300">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all shadow-lg shadow-blue-500/25">
                <FiBarChart2 className="text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                Unified Dashboard
              </h3>
              <p className="text-gray-400">
                See all your coding stats from multiple platforms in one
                beautiful, organized dashboard.
              </p>
            </div>

            <div className="glass-card p-6 md:p-8 rounded-2xl fade-in-up delay-200 group hover:scale-105 transition-all duration-300">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all shadow-lg shadow-purple-500/25">
                <FiTrendingUp className="text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">
                Progress Tracking
              </h3>
              <p className="text-gray-400">
                Monitor your growth over time with detailed statistics and
                visual progress indicators.
              </p>
            </div>

            <div className="glass-card p-6 md:p-8 rounded-2xl fade-in-up delay-300 group hover:scale-105 transition-all duration-300">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-r from-orange-500 to-yellow-500 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all shadow-lg shadow-orange-500/25">
                <FiAward className="text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-orange-400 transition-colors">
                Rating & Rankings
              </h3>
              <p className="text-gray-400">
                Track your competitive programming ratings, contest performance,
                and global rankings.
              </p>
            </div>

            <div className="glass-card p-6 md:p-8 rounded-2xl fade-in-up delay-400 group hover:scale-105 transition-all duration-300">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all shadow-lg shadow-green-500/25">
                <FiLink className="text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-green-400 transition-colors">
                Easy Integration
              </h3>
              <p className="text-gray-400">
                Simply enter your usernames to connect your accounts. No API
                keys or complex setup required.
              </p>
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
