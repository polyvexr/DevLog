import React from "react";
import Dialog from "./Dialog";

export default function DisconnectDialog({ open, platform, onConfirm, onCancel }) {
  const platformNames = {
    leetcode: "LeetCode",
    codeforces: "Codeforces",
    github: "GitHub",
    codechef: "CodeChef",
    atcoder: "AtCoder",
  };

  const name = platformNames[platform] || "Platform";

  return (
    <Dialog
      open={open}
      title={`Disconnect ${name}`}
      message={`Are you sure you want to disconnect your ${name} profile? Your stats will stop syncing.`}
      type="warning"
      confirmText="Disconnect"
      cancelText="Keep Connected"
      onConfirm={onConfirm}
      onCancel={onCancel}
    />
  );
}
