/**
 * FullPageLoader - Reusable full-screen loading spinner
 * Used across route wrappers and async page loads
 */
export default function FullPageLoader() {
  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-[#e23e2d]/20 border-t-[#e23e2d] rounded-full animate-spin"></div>
    </div>
  );
}
