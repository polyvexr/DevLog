import React from "react";
import {
  FiUser,
  FiMoon,
  FiBell,
  FiTarget,
  FiLock,
  FiSave,
} from "react-icons/fi";

export default function Settings() {
  return (
    <>
      <div className="mb-8 fade-in-scale">
        <h1 className="text-4xl font-black mb-3 text-[var(--text-primary)]">
          Settings
        </h1>
        <p className="text-[var(--text-secondary)] text-lg">
          Customize your DevLog experience
        </p>
      </div>

      <div className="grid gap-6">
        {/* Profile Section */}
        <div className="platform-card">
          <div className="p-6 border-b border-[var(--border-color)]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[var(--accent-blue)]/20 flex items-center justify-center">
                <FiUser className="text-[var(--accent-blue)]" size={20} />
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-[var(--text-primary)]">
                  Profile
                </h2>
                <p className="text-sm text-[var(--text-secondary)]">
                  Manage your personal information
                </p>
              </div>
              <span className="coming-soon-badge">Coming Soon</span>
            </div>
          </div>
          <div className="p-6 space-y-4 opacity-50 pointer-events-none">
            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                Name
              </label>
              <input
                type="text"
                disabled
                placeholder="Your name"
                className="w-full px-4 py-2 rounded-lg bg-[var(--bg-card-inner)] border border-[var(--border-color)] text-[var(--text-primary)]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                Email
              </label>
              <input
                type="email"
                disabled
                placeholder="your@email.com"
                className="w-full px-4 py-2 rounded-lg bg-[var(--bg-card-inner)] border border-[var(--border-color)] text-[var(--text-primary)]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                Bio
              </label>
              <textarea
                disabled
                placeholder="Tell us about yourself..."
                rows={3}
                className="w-full px-4 py-2 rounded-lg bg-[var(--bg-card-inner)] border border-[var(--border-color)] text-[var(--text-primary)] resize-none"
              />
            </div>
          </div>
        </div>

        {/* Password Section */}
        <div className="platform-card">
          <div className="p-6 border-b border-[var(--border-color)]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[var(--accent-purple)]/20 flex items-center justify-center">
                <FiLock className="text-[var(--accent-purple)]" size={20} />
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-[var(--text-primary)]">
                  Password
                </h2>
                <p className="text-sm text-[var(--text-secondary)]">
                  Update your password
                </p>
              </div>
              <span className="coming-soon-badge">Coming Soon</span>
            </div>
          </div>
          <div className="p-6 space-y-4 opacity-50 pointer-events-none">
            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                Current Password
              </label>
              <input
                type="password"
                disabled
                placeholder="••••••••"
                className="w-full px-4 py-2 rounded-lg bg-[var(--bg-card-inner)] border border-[var(--border-color)] text-[var(--text-primary)]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                New Password
              </label>
              <input
                type="password"
                disabled
                placeholder="••••••••"
                className="w-full px-4 py-2 rounded-lg bg-[var(--bg-card-inner)] border border-[var(--border-color)] text-[var(--text-primary)]"
              />
            </div>
          </div>
        </div>

        {/* Theme Section */}
        <div className="platform-card">
          <div className="p-6 border-b border-[var(--border-color)]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[var(--accent-cyan)]/20 flex items-center justify-center">
                <FiMoon className="text-[var(--accent-cyan)]" size={20} />
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-[var(--text-primary)]">
                  Theme
                </h2>
                <p className="text-sm text-[var(--text-secondary)]">
                  Choose your preferred appearance
                </p>
              </div>
              <span className="coming-soon-badge">Coming Soon</span>
            </div>
          </div>
          <div className="p-6 opacity-50 pointer-events-none">
            <div className="flex gap-4">
              {["Light", "Dark", "System"].map((theme) => (
                <label
                  key={theme}
                  className="flex items-center gap-2 cursor-not-allowed"
                >
                  <input
                    type="radio"
                    name="theme"
                    disabled
                    checked={theme === "Dark"}
                    className="w-4 h-4"
                  />
                  <span className="text-[var(--text-primary)]">{theme}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Notifications Section */}
        <div className="platform-card">
          <div className="p-6 border-b border-[var(--border-color)]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[var(--accent-pink)]/20 flex items-center justify-center">
                <FiBell className="text-[var(--accent-pink)]" size={20} />
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-[var(--text-primary)]">
                  Notifications
                </h2>
                <p className="text-sm text-[var(--text-secondary)]">
                  Configure email notifications
                </p>
              </div>
              <span className="coming-soon-badge">Coming Soon</span>
            </div>
          </div>
          <div className="p-6 space-y-4 opacity-50 pointer-events-none">
            <label className="flex items-center justify-between cursor-not-allowed">
              <span className="text-[var(--text-primary)]">
                Weekly progress summary
              </span>
              <input type="checkbox" disabled className="w-5 h-5" />
            </label>
            <label className="flex items-center justify-between cursor-not-allowed">
              <span className="text-[var(--text-primary)]">
                Contest reminders
              </span>
              <input type="checkbox" disabled className="w-5 h-5" />
            </label>
            <label className="flex items-center justify-between cursor-not-allowed">
              <span className="text-[var(--text-primary)]">
                Achievement notifications
              </span>
              <input type="checkbox" disabled className="w-5 h-5" />
            </label>
          </div>
        </div>

        {/* Progress Milestones Section */}
        <div className="platform-card">
          <div className="p-6 border-b border-[var(--border-color)]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[var(--accent-yellow)]/20 flex items-center justify-center">
                <FiTarget className="text-[var(--accent-yellow)]" size={20} />
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-[var(--text-primary)]">
                  Progress Milestones
                </h2>
                <p className="text-sm text-[var(--text-secondary)]">
                  Set custom targets for each platform
                </p>
              </div>
              <span className="coming-soon-badge">Coming Soon</span>
            </div>
          </div>
          <div className="p-6 space-y-4 opacity-50 pointer-events-none">
            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                LeetCode Problems Target
              </label>
              <input
                type="number"
                disabled
                placeholder="500"
                className="w-full px-4 py-2 rounded-lg bg-[var(--bg-card-inner)] border border-[var(--border-color)] text-[var(--text-primary)]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                Codeforces Rating Target
              </label>
              <input
                type="number"
                disabled
                placeholder="1500"
                className="w-full px-4 py-2 rounded-lg bg-[var(--bg-card-inner)] border border-[var(--border-color)] text-[var(--text-primary)]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                GitHub Repos Target
              </label>
              <input
                type="number"
                disabled
                placeholder="100"
                className="w-full px-4 py-2 rounded-lg bg-[var(--bg-card-inner)] border border-[var(--border-color)] text-[var(--text-primary)]"
              />
            </div>
          </div>
        </div>

        {/* Save Button (Disabled) */}
        <div className="flex justify-end">
          <button
            disabled
            className="btn-primary opacity-50 cursor-not-allowed"
          >
            <FiSave size={16} />
            Save Changes
          </button>
        </div>
      </div>
    </>
  );
}
