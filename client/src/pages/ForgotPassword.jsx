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
            <h2 className="text-4xl font-black text-white mb-4 italic">Reset Link Sent</h2>
            <p className="text-gray-400 text-lg mb-10 leading-relaxed">
              If an account exists for <span className="text-blue-400 font-bold">{email}</span>,
              we've sent a password reset link to your email.
            </p>
            <div className="flex justify-center mt-12">
              <Link
                to="/login"
                className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white transition-all hover:bg-blue-600 hover:border-blue-500 hover:-translate-x-1 group shadow-xl active:scale-95 duration-500"
                title="Back to Login"
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
              </Link>
            </div>
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
            <h2 className="text-4xl md:text-5xl font-black text-white mb-3 italic tracking-tight">Reset <span className="animate-text-shine">Password</span></h2>
            <p className="text-gray-500 font-medium">Enter your email to receive a password reset link</p>
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

            <div className="flex justify-center pt-10">
              <Link
                to="/login"
                className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white transition-all hover:bg-blue-600 hover:border-blue-500 hover:-translate-x-1 group shadow-xl active:scale-95 duration-500"
                title="Return to Login"
              >
                <svg
                  className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform"
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
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
