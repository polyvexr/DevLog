import { useState } from "react";
import { Link } from "react-router-dom";
import { useSettings } from "../hooks/useSettings";
import FullPageLoader from "../components/FullPageLoader";
import PersonalInfo from "../components/settings/PersonalInfo";
import EcosystemSync from "../components/settings/EcosystemSync";
import Visibility from "../components/settings/Visibility";
import { SiLeetcode, SiCodeforces, SiGithub, SiCodechef } from "react-icons/si";

const AtCoderIcon = () => (
  <span className="font-bold text-[8px] text-[#e23e2d] bg-[#e23e2d]/10 px-1.5 py-0.5 rounded border border-[#e23e2d]/20 font-sans">
    AT
  </span>
);

const PLATFORM_META = [
  { id: "leetcode", label: "LeetCode", icon: SiLeetcode, color: "text-orange-500", toggle: "showLeetCode" },
  { id: "codeforces", label: "Codeforces", icon: SiCodeforces, color: "text-blue-500", toggle: "showCodeforces" },
  { id: "github", label: "GitHub", icon: SiGithub, color: "text-slate-200", toggle: "showGitHub" },
  { id: "codechef", label: "CodeChef", icon: SiCodechef, color: "text-amber-600", toggle: "showCodeChef" },
  { id: "atcoder", label: "AtCoder", icon: AtCoderIcon, color: "", toggle: "showAtCoder" },
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
    unlinkPlatform
  } = useSettings();

  const [newLink, setNewLink] = useState({ platform: "leetcode", username: "" });

  if (loading) return <FullPageLoader />;

  return (
    <div className="max-w-4xl mx-auto py-12 px-6 space-y-12 pb-32">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#222225]">
        <div className="space-y-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 font-mono text-[9px] uppercase tracking-wider text-slate-500 hover:text-slate-200 transition-colors"
            title="Back to Dashboard"
          >
            ← Back to Dashboard
          </Link>
          <h1 className="text-4xl md:text-5xl font-[Cormorant_Garamond] font-light italic text-white tracking-tight leading-tight">
            Workspace <br />
            <span className="text-[#e23e2d]">Settings.</span>
          </h1>
        </div>
        {status.message && (
          <div className={`px-4 py-2 border rounded font-mono text-[9px] uppercase tracking-wider ${
            status.type === "error" ? "bg-red-500/10 border-red-500/20 text-red-500" : "bg-green-500/10 border-green-500/20 text-green-500"
          }`}>
            {status.message}
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

    </div>
  );
}
