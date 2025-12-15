export default function Loader() {
  return (
    <div className="flex flex-col justify-center items-center h-60" role="status" aria-live="polite">
      <div className="relative">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-transparent border-t-blue-500 border-r-purple-500" />
        <div className="absolute top-0 left-0 animate-spin rounded-full h-16 w-16 border-4 border-transparent border-b-pink-500 border-l-cyan-500" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
      </div>
      <div className="mt-4 text-gray-400 font-semibold text-sm tracking-wide">Loading your stats...</div>
      <span className="sr-only">Loading...</span>
    </div>
  );
}
