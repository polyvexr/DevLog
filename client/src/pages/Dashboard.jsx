import Navbar from "../components/Navbar";
import Loader from "../components/Loader";
import { useEffect, useState } from "react";
import api from "../api/axios";

export default function Dashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get("/stats/all")
      .then((res) => setStats(res.data.stats))
      .catch(() => setStats([]));
  }, []);

  return (
    <div>
      <Navbar />

      <div className="p-6">
        <h1 className="text-3xl font-bold mb-4">Dashboard</h1>

        {!stats ? (
          <Loader />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            {stats.map((item) => (
              <div key={item._id} className="p-4 border rounded shadow bg-white">
                <h2 className="text-xl font-semibold capitalize">{item.platform}</h2>
                <p className="text-gray-500">{item.username}</p>

                <pre className="mt-2 bg-gray-100 p-2 rounded text-sm overflow-auto">
                  {JSON.stringify(item.stats, null, 2)}
                </pre>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
