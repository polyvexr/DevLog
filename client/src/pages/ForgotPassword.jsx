import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import { FiMail, FiArrowLeft, FiCheckCircle } from "react-icons/fi";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await api.post("/auth/forgot-password", { email });
      setSubmitted(true);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen relative flex items-center justify-center px-4 py-8 overflow-hidden">
        {/* Background blobs for depth */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-600/10 rounded-full blur-[100px] animate-blob"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-600/10 rounded-full blur-[100px] animate-blob animation-delay-2000"></div>

        <div className="w-full max-w-lg relative z-10">
          <div className="glass-card-premium p-10 md:p-12 text-center fade-in-scale">
            <div className="w-24 h-24 bg-green-500/10 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-green-500/20">
              <FiCheckCircle className="text-5xl text-green-500" />
            </div>
            <h2 className="text-4xl font-black text-white mb-4 italic">Neural Link Sent</h2>
            <p className="text-gray-400 text-lg mb-10 leading-relaxed">
              If an account exists for <span className="text-blue-400 font-bold">@{email.split('@')[0]}</span>, 
              the reset authorization has been dispatched.
            </p>
            <Link 
              to="/login"
              className="inline-flex items-center gap-3 text-blue-400 hover:text-blue-300 font-black uppercase tracking-widest text-xs transition-all group"
            >
              <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" /> Back to Authorization
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center px-4 py-8 overflow-hidden">
      {/* Background blobs for depth */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-600/10 rounded-full blur-[100px] animate-blob"></div>
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-600/10 rounded-full blur-[100px] animate-blob animation-delay-2000"></div>

      <div className="w-full max-w-lg relative z-10">
        <form onSubmit={handleSubmit} className="glass-card-premium p-10 md:p-12 fade-in-scale">
          <div className="text-center mb-10">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-3 italic tracking-tight">Recover <span className="animate-text-shine">Identity</span></h2>
            <p className="text-gray-500 font-medium">Initiate password reset protocol</p>
          </div>

          <div className="space-y-8">
            {error && (
              <div className="p-5 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-sm font-bold flex items-center gap-4 animate-shake">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                {error}
              </div>
            )}

            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">E-Mail Address</label>
              <div className="relative group">
                <FiMail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-500 transition-colors" />
                <input
                  type="email"
                  required
                  className="w-full pl-14 pr-6 py-5 bg-white/5 border border-white/5 rounded-2xl text-white font-bold placeholder-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:bg-white/10 transition-all"
                  placeholder="name@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-10 py-5 bg-blue-600 hover:bg-blue-500 text-white font-black text-lg rounded-2xl shadow-xl shadow-blue-500/20 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : "Dispatch Reset Link →"}
            </button>

            <div className="text-center">
              <Link 
                to="/login"
                className="inline-flex items-center gap-3 text-gray-500 hover:text-white font-black uppercase tracking-widest text-[10px] transition-all group pt-6"
              >
                <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" /> Return to Login
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
