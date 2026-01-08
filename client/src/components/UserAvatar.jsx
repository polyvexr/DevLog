import React from "react";

// Generate a consistent color based on the name
const getAvatarColor = (name) => {
  const colors = [
    "linear-gradient(135deg, #4d8af0, #6ac9ff)",
    "linear-gradient(135deg, #8b5cf6, #a78bfa)",
    "linear-gradient(135deg, #ec4899, #f472b6)",
    "linear-gradient(135deg, #06b6d4, #22d3ee)",
    "linear-gradient(135deg, #10b981, #34d399)",
    "linear-gradient(135deg, #f59e0b, #fbbf24)",
    "linear-gradient(135deg, #ef4444, #f87171)",
    "linear-gradient(135deg, #6366f1, #818cf8)",
  ];

  if (!name) return colors[0];

  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }

  return colors[Math.abs(hash) % colors.length];
};

// Get initials from name
const getInitials = (name) => {
  if (!name) return "?";

  const parts = name.trim().split(" ").filter(Boolean);

  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase();
  }

  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};

const UserAvatar = ({ name, size = "default", className = "" }) => {
  const initials = getInitials(name);
  const background = getAvatarColor(name);

  const sizeClasses = {
    small: "w-8 h-8 text-xs",
    default: "w-10 h-10 text-sm",
    large: "w-12 h-12 text-base",
  };

  return (
    <div
      className={`rounded-full flex items-center justify-center font-semibold text-white ${sizeClasses[size]} ${className}`}
      style={{ background }}
      title={name}
    >
      {initials}
    </div>
  );
};

export default UserAvatar;
