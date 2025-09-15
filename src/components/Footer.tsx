export default function Footer() {
  return (
    <footer className="border-t border-black/10 dark:border-white/15 mt-16">
      <div className="max-w-5xl mx-auto px-4 py-6 text-sm text-center text-black/70 dark:text-white/70">
        © {new Date().getFullYear()} Your Name. All rights reserved.
      </div>
    </footer>
  );
}
