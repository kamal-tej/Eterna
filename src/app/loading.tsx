export default function Loading() {
  return (
    <div className="flex flex-col h-screen bg-black">
      <div className="h-16 bg-zinc-950 border-b border-zinc-900 flex items-center px-4">
        <div className="w-8 h-8 bg-zinc-800 rounded animate-pulse" />
      </div>
      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 border-r border-zinc-900 p-4 space-y-4">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="h-12 bg-zinc-900/50 rounded animate-pulse" />
          ))}
        </div>
        <div className="flex-1 border-r border-zinc-900 p-4 space-y-4 hidden md:block">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="h-12 bg-zinc-900/50 rounded animate-pulse" />
          ))}
        </div>
        <div className="flex-1 p-4 space-y-4 hidden lg:block">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="h-12 bg-zinc-900/50 rounded animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  );
}
