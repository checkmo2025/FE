export default function MobileMockup() {
  return (
    <div className="relative h-[480px] w-[240px] overflow-hidden rounded-[40px] border-4 border-Gray-3 bg-white shadow-2xl">
      {/* Notch */}
      <div className="absolute left-1/2 top-0 z-10 h-5 w-20 -translate-x-1/2 rounded-b-2xl bg-Gray-3" />

      {/* Screen */}
      <div className="flex h-full flex-col bg-background pt-6">
        {/* App header */}
        <div className="flex h-10 items-center justify-between bg-primary-1 px-4">
          <div className="h-4 w-12 rounded bg-white/40" />
          <div className="flex gap-2">
            <div className="h-4 w-4 rounded-full bg-white/40" />
            <div className="h-4 w-4 rounded-full bg-white/40" />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden p-3">
          <div className="mb-3 h-4 w-24 rounded bg-Gray-2" />

          {/* Member list */}
          {[1, 2, 3].map((i) => (
            <div key={i} className="mb-2 flex items-center gap-2 rounded-lg bg-white p-2.5">
              <div className="h-8 w-8 shrink-0 rounded-full bg-primary-2/40" />
              <div className="flex flex-col gap-1">
                <div className="h-2.5 w-20 rounded bg-Gray-2" />
                <div className="h-2 w-14 rounded bg-Gray-1" />
              </div>
            </div>
          ))}

          <div className="mt-3 mb-2 h-4 w-20 rounded bg-Gray-2" />

          {/* Notice card */}
          <div className="rounded-lg bg-white p-3">
            <div className="mb-1.5 h-3 w-full rounded bg-Gray-2" />
            <div className="mb-1 h-2.5 w-4/5 rounded bg-Gray-1" />
            <div className="h-2.5 w-3/5 rounded bg-Gray-1" />
          </div>

          {/* Vote card */}
          <div className="mt-2 rounded-lg bg-primary-1/10 p-3">
            <div className="mb-2 h-3 w-24 rounded bg-primary-2/50" />
            {[1, 2].map((i) => (
              <div key={i} className="mb-1.5 flex items-center gap-2">
                <div className="h-3.5 w-3.5 rounded-full border-2 border-primary-2" />
                <div className="h-2.5 flex-1 rounded bg-Gray-2" />
              </div>
            ))}
          </div>
        </div>

        {/* Bottom tab bar */}
        <div className="flex h-12 items-center justify-around border-t border-Gray-1 bg-white px-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-5 w-5 rounded bg-Gray-2" />
          ))}
        </div>
      </div>
    </div>
  );
}
