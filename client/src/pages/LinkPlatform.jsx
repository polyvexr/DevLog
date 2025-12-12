import Navbar from "../components/Navbar";
import { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function LinkPlatform() {
  const navigate = useNavigate();
  const [platform, setPlatform] = useState("leetcode");
  const [username, setUsername] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    await api.post("/platforms/link", { platform, username });
    navigate("/");
  };

  return (
    <div>
      <Navbar />

      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">Link New Platform</h2>

        <form onSubmit={submit} className="max-w-sm">
          <select className="border p-2 w-full mb-3" value={platform} onChange={(e) => setPlatform(e.target.value)}>
            <option value="leetcode">LeetCode</option>
            <option value="codeforces">CodeForces</option>
            <option value="github">GitHub</option>
          </select>

          <input
            type="text"
            placeholder="Enter Username"
            className="border p-2 w-full mb-3"
            onChange={(e) => setUsername(e.target.value)}
          />

          <button className="bg-blue-600 text-white p-2 w-full rounded">
            Link
          </button>
        </form>
      </div>
    </div>
  );
}
