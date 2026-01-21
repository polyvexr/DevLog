/**
 * FullPageLoader - Reusable full-screen loading spinner
 * Used across route wrappers and async page loads
 */
export default function FullPageLoader() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
    </div>
  );
}
