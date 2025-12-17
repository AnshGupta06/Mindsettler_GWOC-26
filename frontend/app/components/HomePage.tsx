import Image from "next/image";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black flex items-center justify-center">
      <main className="w-full max-w-4xl px-8 py-24 text-center sm:text-left">
        {/* Logo / Brand */}
        <div className="mb-10 flex items-center gap-3">
          <Image
            src="/next.svg"
            alt="MindSettler logo"
            width={40}
            height={40}
            className="dark:invert"
          />
          <span className="text-xl font-semibold text-black dark:text-white">
            MindSettler
          </span>
        </div>

        {/* Heading */}
        <h1 className="text-4xl font-bold leading-tight tracking-tight text-black dark:text-white sm:text-5xl">
          A safe space to <br /> understand your mind
        </h1>

        {/* Sub text */}
        <p className="mt-6 max-w-2xl text-lg text-zinc-600 dark:text-zinc-400">
          MindSettler is a psycho-education and mental well-being platform focused
          on awareness, clarity, and guided support.
        </p>

        {/* CTA */}
        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <button className="rounded-full bg-black px-6 py-3 text-white transition hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200">
            Book a Session
          </button>

          <button className="rounded-full border border-black/10 px-6 py-3 text-black transition hover:bg-black/5 dark:border-white/20 dark:text-white dark:hover:bg-white/10">
            Learn More
          </button>
        </div>

        {/* Footer note */}
        <div className="mt-16 border-t border-zinc-200 pt-6 dark:border-zinc-800">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Built by <span className="font-medium">Pratham Patadiya</span> •
            GWOC 2026
          </p>
        </div>
      </main>
    </div>
  );
}
