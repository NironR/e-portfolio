export default function Home() {
  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold">Your Name</h1>
        <p className="text-black/70 dark:text-white/70 max-w-prose mt-2">
          Role or tagline · Location
        </p>
      </div>
      <p className="max-w-prose">
        Welcome to my e-portfolio. Here you can find a little about me, a
        selection of projects, my experience, and ways to get in touch.
      </p>
      <div className="flex gap-3">
        <a href="/projects" className="px-4 py-2 rounded bg-foreground text-background text-sm">View Projects</a>
        <a href="/contact" className="px-4 py-2 rounded border border-black/15 dark:border-white/20 text-sm">Contact Me</a>
      </div>
    </section>
  );
}
