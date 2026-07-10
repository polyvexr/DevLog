import { useState, useEffect, useContext, useCallback } from "react";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";

export function useSettings() {
    const { logout, refreshUser } = useContext(AuthContext);
    const [user, setUser] = useState(null);
    const [platforms, setPlatforms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState({ type: "", message: "" });
    const [isEditing, setIsEditing] = useState(false);
    const [linking, setLinking] = useState(false);

    const [formData, setFormData] = useState({
        name: "", bio: "", location: "", website: "", socials: [],
        publicProfile: {
            showLeetCode: true,
            showCodeforces: true,
            showGitHub: true,
            showCodeChef: true,
            showAtCoder: true
        }
    });

    const showStatus = useCallback((type, message) => {
        setStatus({ type, message });
        setTimeout(() => setStatus({ type: "", message: "" }), 5000);
    }, []);

    const fetchAll = useCallback(async () => {
        try {
            setLoading(true);
            const [uRes, pRes] = await Promise.all([
                api.get("/user/profile"),
                api.get("/platforms")
            ]);

            const u = uRes.data.data.user;
            setUser(u);
            setPlatforms(pRes.data.data.platforms || []);

            setFormData(prev => ({
                ...prev,
                name: u.name || "",
                bio: u.profile?.bio || "",
                location: u.profile?.location || "",
                website: u.profile?.website || "",
                socials: u.profile?.socials || [],
                publicProfile: { ...prev.publicProfile, ...u.publicProfile }
            }));
        } catch (err) {
            showStatus("error", "Sync failure");
        } finally {
            setLoading(false);
        }
    }, [showStatus]);

    useEffect(() => {
        fetchAll();
    }, [fetchAll]);

    const handleUpdate = async (e) => {
        if (e) e.preventDefault();
        try {
            await api.put("/user/profile", {
                name: formData.name,
                bio: formData.bio,
                location: formData.location,
                website: formData.website,
                socials: formData.socials
            });
            showStatus("success", "Identity updated");
            setIsEditing(false);
            refreshUser();
            fetchAll();
        } catch (err) {
            showStatus("error", err.response?.data?.message || "Update failed");
        }
    };



    const handlePublicVisibilityToggle = async (toggle) => {
        const nextValue = !formData.publicProfile[toggle];
        const updatedPP = { ...formData.publicProfile, [toggle]: nextValue };

        setFormData(prev => ({
            ...prev,
            publicProfile: updatedPP
        }));

        try {
            await api.put("/user/profile", { publicProfile: updatedPP });
            refreshUser();
            fetchAll();
        } catch (err) {
            showStatus("error", "Failed to update visibility");
            // Rollback
            setFormData(prev => ({
                ...prev,
                publicProfile: { ...prev.publicProfile, [toggle]: !nextValue }
            }));
        }
    };

    const linkPlatform = async (newLink, resetNewLink) => {
        if (!newLink.username) return;
        setLinking(true);
        try {
            showStatus("success", `Connecting to ${newLink.platform}...`);
            const res = await api.post("/platforms/link", newLink);
            if (res.data.success) {
                showStatus("success", "Node linked successfully");
                resetNewLink();
                fetchAll();
            }
        } catch (err) {
            showStatus("error", err.response?.data?.message || "Link failed");
        } finally {
            setLinking(false);
        }
    };

    const unlinkPlatform = async (p) => {
        try {
            await api.delete(`/platforms/${p}`);
            showStatus("success", "Platform severed");
            fetchAll();
        } catch (err) {
            showStatus("error", "Unlink failed");
        }
    };

    return {
        user,
        platforms,
        loading,
        status,
        isEditing,
        setIsEditing,
        formData,
        setFormData,
        handleUpdate,
        handlePublicVisibilityToggle,
        linkPlatform,
        linking,
        unlinkPlatform,
        showStatus
    };
}
