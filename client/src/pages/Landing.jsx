import { Link } from "react-router-dom";
import {
  FiZap,
  FiBarChart2,
  FiTrendingUp,
  FiAward,
  FiLink,
} from "react-icons/fi";
import { SiLeetcode, SiCodeforces, SiGithub } from "react-icons/si";

export default function Landing() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="min-h-screen flex flex-col justify-center px-4 md:px-8 py-12 md:py-20">
        <div className="app-container">
          {/* Navigation */}
          <nav className="flex justify-between items-center mb-12 md:mb-20 fade-in-up">
            <div className="text-2xl md:text-3xl font-black neon-text flex items-center gap-2">
              <FiZap className="text-blue-400" /> DevLog
            </div>
            <div className="flex gap-3 md:gap-4">
              <Link
                to="/login"
                className="px-4 py-2 md:px-6 md:py-2.5 text-sm md:text-base font-semibold text-gray-300 hover:text-white transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 md:px-6 md:py-2.5 text-sm md:text-base font-bold bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg hover:shadow-blue-500/50 transition-all"
              >
                Get Started
              </Link>
            </div>
          </nav>

          {/* Hero Content */}
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-black mb-6 fade-in-up delay-100">
              <span className="neon-text">Track Your</span>
              <br />
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent gradient-animate">
                Coding Journey
              </span>
            </h1>
            <p className="text-lg md:text-xl text-gray-400 mb-8 md:mb-12 max-w-2xl mx-auto fade-in-up delay-200">
              Aggregate your coding stats from LeetCode, Codeforces, and GitHub
              in one beautiful dashboard. Monitor your progress, track your
              rankings, and visualize your growth.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center fade-in-up delay-300">
              <Link
                to="/register"
                className="px-8 py-4 text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-xl hover:shadow-blue-500/40 hover:scale-105 transition-all duration-300"
              >
                Start Tracking Free →
              </Link>
              <a
                href="#platforms"
                className="px-8 py-4 text-lg font-semibold text-gray-300 border border-gray-600 rounded-xl hover:border-blue-500 hover:text-white transition-all duration-300"
              >
                Learn More
              </a>
            </div>
          </div>

          {/* Animated Stats Preview */}
          <div className="mt-16 md:mt-24 grid grid-cols-3 gap-4 md:gap-8 max-w-2xl mx-auto fade-in-up delay-400">
            <div className="glass-card p-4 md:p-6 rounded-xl text-center float-anim">
              <div className="stat-value-lg">500+</div>
              <div className="stat-label mt-2">Problems Solved</div>
            </div>
            <div
              className="glass-card p-4 md:p-6 rounded-xl text-center float-anim"
              style={{ animationDelay: "1s" }}
            >
              <div className="stat-value-lg">1847</div>
              <div className="stat-label mt-2">Rating</div>
            </div>
            <div
              className="glass-card p-4 md:p-6 rounded-xl text-center float-anim"
              style={{ animationDelay: "2s" }}
            >
              <div className="stat-value-lg">2.5K</div>
              <div className="stat-label mt-2">Contributions</div>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Showcase */}
      <section id="platforms" className="py-16 md:py-24 px-4 md:px-8">
        <div className="app-container">
          <div className="text-center mb-12 md:mb-16">
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
            <div className="glass-card-hover rounded-2xl overflow-hidden fade-in-up delay-100">
              <div className="leetcode-gradient h-2"></div>
              <div className="p-6 md:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl leetcode-gradient flex items-center justify-center text-2xl">
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
                    <span className="text-2xl font-bold text-orange-400">
                      847
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="bg-green-500/10 rounded-lg p-2">
                      <div className="text-green-400 font-bold">312</div>
                      <div className="text-xs text-gray-500">Easy</div>
                    </div>
                    <div className="bg-yellow-500/10 rounded-lg p-2">
                      <div className="text-yellow-400 font-bold">420</div>
                      <div className="text-xs text-gray-500">Medium</div>
                    </div>
                    <div className="bg-red-500/10 rounded-lg p-2">
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
            <div className="glass-card-hover rounded-2xl overflow-hidden fade-in-up delay-200">
              <div className="codeforces-gradient h-2"></div>
              <div className="p-6 md:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl codeforces-gradient flex items-center justify-center text-2xl">
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
                    <span className="text-2xl font-bold text-cyan-400">
                      1847
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-blue-500/10 rounded-lg p-3 text-center">
                      <div className="text-blue-400 font-bold text-lg">
                        Expert
                      </div>
                      <div className="text-xs text-gray-500">Rank</div>
                    </div>
                    <div className="bg-purple-500/10 rounded-lg p-3 text-center">
                      <div className="text-purple-400 font-bold text-lg">
                        52
                      </div>
                      <div className="text-xs text-gray-500">Contests</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-green-400">↑ 127</span>
                    <span className="text-gray-500">from last contest</span>
                  </div>
                </div>
              </div>
            </div>

            {/* GitHub Card */}
            <div className="glass-card-hover rounded-2xl overflow-hidden fade-in-up delay-300 sm:col-span-2 lg:col-span-1">
              <div className="github-gradient h-2"></div>
              <div className="p-6 md:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl github-gradient flex items-center justify-center text-2xl">
                    <SiGithub className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">GitHub</h3>
                    <p className="text-sm text-gray-400">Open Source</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-purple-500/10 rounded-lg p-3 text-center">
                      <div className="text-purple-400 font-bold text-lg">
                        48
                      </div>
                      <div className="text-xs text-gray-500">Repositories</div>
                    </div>
                    <div className="bg-yellow-500/10 rounded-lg p-3 text-center">
                      <div className="text-yellow-400 font-bold text-lg">
                        2.4K
                      </div>
                      <div className="text-xs text-gray-500">Stars</div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Followers</span>
                    <span className="text-xl font-bold text-purple-400">
                      1,247
                    </span>
                  </div>
                  <div className="flex gap-1">
                    {[...Array(7)].map((_, i) => (
                      <div
                        key={i}
                        className="flex-1 h-8 rounded"
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
      <section className="py-16 md:py-24 px-4 md:px-8">
        <div className="app-container">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-5xl font-black mb-4 fade-in-up">
              <span className="neon-text">Powerful Features</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-xl mx-auto fade-in-up delay-100">
              Everything you need to track and improve your coding skills
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-4xl mx-auto">
            <div className="glass-card p-6 md:p-8 rounded-2xl fade-in-up delay-100">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center text-2xl mb-4">
                <FiBarChart2 className="text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                Unified Dashboard
              </h3>
              <p className="text-gray-400">
                See all your coding stats from multiple platforms in one
                beautiful, organized dashboard.
              </p>
            </div>

            <div className="glass-card p-6 md:p-8 rounded-2xl fade-in-up delay-200">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-2xl mb-4">
                <FiTrendingUp className="text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                Progress Tracking
              </h3>
              <p className="text-gray-400">
                Monitor your growth over time with detailed statistics and
                visual progress indicators.
              </p>
            </div>

            <div className="glass-card p-6 md:p-8 rounded-2xl fade-in-up delay-300">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-r from-orange-500 to-yellow-500 flex items-center justify-center text-2xl mb-4">
                <FiAward className="text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                Rating & Rankings
              </h3>
              <p className="text-gray-400">
                Track your competitive programming ratings, contest performance,
                and global rankings.
              </p>
            </div>

            <div className="glass-card p-6 md:p-8 rounded-2xl fade-in-up delay-400">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center text-2xl mb-4">
                <FiLink className="text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
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
      <section className="py-16 md:py-24 px-4 md:px-8">
        <div className="app-container">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-5xl font-black mb-4 fade-in-up">
              <span className="neon-text">How It Works</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-xl mx-auto fade-in-up delay-100">
              Get started in just 3 simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center fade-in-up delay-100">
              <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-3xl font-black text-white mb-6 pulse-glow">
                1
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                Create Account
              </h3>
              <p className="text-gray-400">
                Sign up for free with just your email and password
              </p>
            </div>

            <div className="text-center fade-in-up delay-200">
              <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center text-3xl font-black text-white mb-6 pulse-glow">
                2
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                Link Platforms
              </h3>
              <p className="text-gray-400">
                Connect your LeetCode, Codeforces, and GitHub accounts
              </p>
            </div>

            <div className="text-center fade-in-up delay-300">
              <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-r from-pink-600 to-orange-600 flex items-center justify-center text-3xl font-black text-white mb-6 pulse-glow">
                3
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
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
      <section className="py-16 md:py-24 px-4 md:px-8">
        <div className="app-container">
          <div className="glass-card neon-border rounded-3xl p-8 md:p-16 text-center max-w-3xl mx-auto fade-in-scale">
            <h2 className="text-3xl md:text-5xl font-black mb-4">
              <span className="neon-text">Ready to Start?</span>
            </h2>
            <p className="text-gray-400 text-lg mb-8 max-w-lg mx-auto">
              Join developers who are already tracking their coding journey with
              DevLog
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="px-8 py-4 text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-xl hover:shadow-blue-500/40 hover:scale-105 transition-all duration-300"
              >
                Create Free Account
              </Link>
              <Link
                to="/login"
                className="px-8 py-4 text-lg font-semibold text-gray-300 border border-gray-600 rounded-xl hover:border-blue-500 hover:text-white transition-all duration-300"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 md:px-8 border-t border-gray-800">
        <div className="app-container flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-xl font-black neon-text flex items-center gap-2">
            <FiZap className="text-blue-400" /> DevLog
          </div>
          <p className="text-gray-500 text-sm">
            © 2026 DevLog. Track your coding journey.
          </p>
          <div className="flex gap-6">
            <a
              href="#platforms"
              className="text-gray-400 hover:text-white transition-colors text-sm"
            >
              Platforms
            </a>
            <Link
              to="/login"
              className="text-gray-400 hover:text-white transition-colors text-sm"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="text-gray-400 hover:text-white transition-colors text-sm"
            >
              Register
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
