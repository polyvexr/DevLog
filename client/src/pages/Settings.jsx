import { useState } from "react";
import { Link } from "react-router-dom";
import { useSettings } from "../hooks/useSettings";
import FullPageLoader from "../components/FullPageLoader";
import Dialog from "../components/Dialog";
import PersonalInfo from "../components/settings/PersonalInfo";
import EcosystemSync from "../components/settings/EcosystemSync";
import Visibility from "../components/settings/Visibility";
import DangerZone from "../components/settings/DangerZone";
import { SiLeetcode, SiCodeforces, SiGithub, SiCodechef } from "react-icons/si";

const AtCoderIcon = ({ className }) => <span className={`font-black text-[10px] ${className}`}>AT</span>;

const PLATFORM_META = [
  { id: "leetcode", label: "LeetCode", icon: SiLeetcode, color: "text-yellow-500", toggle: "showLeetCode" },
  { id: "codeforces", label: "Codeforces", icon: SiCodeforces, color: "text-blue-500", toggle: "showCodeforces" },
  { id: "github", label: "GitHub", icon: SiGithub, color: "text-white", toggle: "showGitHub" },
  { id: "codechef", label: "CodeChef", icon: SiCodechef, color: "text-amber-600", toggle: "showCodeChef" },
  { id: "atcoder", label: "AtCoder", icon: AtCoderIcon, color: "text-cyan-500", toggle: "showAtCoder" },
];

export default function Settings() {
  const {
    platforms,
    loading,
    status,
    isEditing,
    setIsEditing,
    formData,
    setFormData,
    uploading,
    handleUpdate,
    handleAvatarUpload,
    handlePublicVisibilityToggle,
    linkPlatform,
    unlinkPlatform,
    deleteAccount
  } = useSettings();

  const [dialog, setDialog] = useState({ open: false });
  const [newLink, setNewLink] = useState({ platform: "leetcode", username: "" });

  if (loading) return <FullPageLoader />;

  return (
    <div className="max-w-4xl mx-auto py-12 px-6 space-y-12 pb-32">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 fade-in-scale">
        <div className="flex gap-4 items-center">
          <Link
            to="/"
            className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white transition-all hover:bg-blue-600 hover:border-blue-500 hover:-translate-x-1 group shadow-xl active:scale-95"
            title="Back to Dashboard"
          >
            <svg className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <h1 className="text-4xl font-black text-white italic tracking-tighter">System<span className="animate-text-shine">Settings</span></h1>
        </div>
        {status.message && (
          <div className={`p-4 rounded-xl flex items-center gap-3 glass-card-premium border-none ring-1 ${status.type === "error" ? "ring-red-500/30 text-red-400" : "ring-green-500/30 text-green-400"}`}>
            <span className="text-[9px] font-black uppercase tracking-widest">{status.message}</span>
          </div>
        )}
      </div>

      <PersonalInfo
        isEditing={isEditing}
        setIsEditing={setIsEditing}
        formData={formData}
        setFormData={setFormData}
        handleUpdate={handleUpdate}
        handleAvatarUpload={handleAvatarUpload}
        uploading={uploading}
      />

      <EcosystemSync
        platforms={platforms}
        platformMeta={PLATFORM_META}
        newLink={newLink}
        setNewLink={setNewLink}
        linkPlatform={(e) => {
          e.preventDefault();
          linkPlatform(newLink, () => setNewLink({ ...newLink, username: "" }));
        }}
        unlinkPlatform={unlinkPlatform}
      />

      <Visibility
        platformMeta={PLATFORM_META}
        formData={formData}
        handlePublicVisibilityToggle={handlePublicVisibilityToggle}
      />

      <DangerZone onDeleteClick={() => setDialog({ open: true })} />

      <Dialog
        open={dialog.open}
        title="Erase Record?"
        message="All platform stats, contest history, and identity data will be purged. This action is terminal."
        confirmText="Purge Now"
        cancelText="Abort"
        onConfirm={deleteAccount}
        onCancel={() => setDialog({ open: false })}
      />
    </div>
  );
}

