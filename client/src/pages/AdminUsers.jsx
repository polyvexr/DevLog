import { useState, useEffect } from "react";
import { getAdminUsers } from "../api/axios";
import Loader from "../components/Loader";
import {
    FiUsers,
    FiMail,
    FiCalendar,
    FiShield,
    FiExternalLink,
    FiSearch,
    FiArrowLeft,
    FiMoreHorizontal,
    FiEye
} from "react-icons/fi";
import { SiLeetcode, SiCodeforces, SiGithub, SiCodechef } from "react-icons/si";
import { useNavigate } from "react-router-dom";

const AtCoderIcon = ({ className }) => (
    <span className={`font-black text-[10px] ${className}`}>AT</span>
);

export default function AdminUsers() {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [filter, setFilter] = useState("all");

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const res = await getAdminUsers();
            setUsers(res.data.data);
        } catch (error) {
            console.error("Error fetching users:", error);
            setError("Failed to retrieve user data.");
        } finally {
            setLoading(false);
        }
    };

    const platformIcons = {
        leetcode: { icon: SiLeetcode, color: "text-yellow-500" },
        codeforces: { icon: SiCodeforces, color: "text-blue-500" },
        github: { icon: SiGithub, color: "text-white" },
        codechef: { icon: SiCodechef, color: "text-amber-600" },
        atcoder: { icon: AtCoderIcon, color: "text-cyan-500" },
    };

    const filteredUsers = users.filter(user => {
        const matchesSearch =
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase());

        if (filter === "admin") return matchesSearch && user.role === "admin";
        if (filter === "user") return matchesSearch && user.role === "user";
        return matchesSearch;
    });

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#050505]"><Loader /></div>;

    return (
        <div className="min-h-screen bg-[#050505] py-12 px-4 md:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="mb-12">
                    <div className="flex items-center justify-between mb-8 fade-in-scale">
                        <button
                            onClick={() => navigate("/admin")}
                            className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white transition-all hover:bg-blue-600 hover:border-blue-500 hover:-translate-x-1 group shadow-xl active:scale-95"
                            title="Back to Admin Panel"
                        >
                            <svg
                                className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={3}
                                    d="M15 19l-7-7 7-7"
                                />
                            </svg>
                        </button>
                    </div>

                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                        <div className="fade-in-scale">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-widest mb-4">
                                <FiUsers /> Admin Control
                            </div>
                            <h1 className="text-5xl md:text-7xl font-black text-white italic tracking-tighter leading-none mb-4">
                                User <span className="animate-text-shine">Registry</span>
                            </h1>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 fade-in-up">
                            <div className="relative">
                                <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                                <input
                                    type="text"
                                    placeholder="Search users..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 w-full sm:w-64 transition-all"
                                />
                            </div>
                            <div className="flex bg-white/5 rounded-xl border border-white/10 p-1">
                                {["all", "user", "admin"].map(opt => (
                                    <button
                                        key={opt}
                                        onClick={() => setFilter(opt)}
                                        className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${filter === opt ? "bg-blue-600 text-white shadow-lg" : "text-gray-500 hover:text-gray-300"
                                            }`}
                                    >
                                        {opt}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 p-6 rounded-2xl mb-12 flex items-center gap-4 text-red-400">
                        <FiShield className="text-2xl" />
                        <span className="font-bold">{error}</span>
                    </div>
                )}

                {/* User Table */}
                <div className="glass-card-premium overflow-hidden fade-in-up border-none ring-1 ring-white/5">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-white/[0.02] border-b border-white/5">
                                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Member</th>
                                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Role</th>
                                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Connected Hubs</th>
                                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Joined</th>
                                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {filteredUsers.length > 0 ? (
                                    filteredUsers.map((user) => (
                                        <tr key={user._id} className="group hover:bg-white/[0.02] transition-colors">
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center font-black text-white shadow-lg group-hover:scale-110 transition-transform">
                                                        {user.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-white mb-0.5">{user.name}</div>
                                                        <div className="text-xs text-gray-500 flex items-center gap-1.5 font-medium">
                                                            <FiMail size={10} /> {user.email}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border ${user.role === "admin"
                                                    ? "bg-blue-500/10 border-blue-500/20 text-blue-400"
                                                    : "bg-gray-500/10 border-white/5 text-gray-500"
                                                    }`}>
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-2">
                                                    {user.platforms && user.platforms.length > 0 ? (
                                                        user.platforms.map((p, i) => {
                                                            const PConfig = platformIcons[p.platform] || { icon: FiMoreHorizontal, color: "text-gray-500" };
                                                            const PIcon = PConfig.icon;
                                                            return (
                                                                <div key={i} title={p.platform} className={`w-7 h-7 rounded-lg bg-black/40 flex items-center justify-center border border-white/5 ${PConfig.color}`}>
                                                                    <PIcon size={14} />
                                                                </div>
                                                            );
                                                        })
                                                    ) : (
                                                        <span className="text-[10px] font-bold text-gray-700 uppercase">None Linked</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="text-xs font-bold text-gray-500 flex items-center gap-2">
                                                    <FiCalendar size={12} /> {new Date(user.createdAt).toLocaleDateString()}
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <button
                                                    onClick={() => user.publicProfile?.username && window.open(`/u/${user.publicProfile.username}`, "_blank")}
                                                    disabled={!user.publicProfile?.username}
                                                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-blue-600 hover:text-white transition-all disabled:opacity-10 disabled:grayscale"
                                                >
                                                    <FiEye /> Profile
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="px-8 py-24 text-center">
                                            <div className="text-gray-600 font-bold uppercase tracking-[0.2em]">No Users Found</div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
