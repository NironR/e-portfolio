import Link from "next/link";

export default function Navbar() {
  return (
    <header className="border-b border-black/10 dark:border-white/15 sticky top-0 bg-background/80 backdrop-blur z-50">
      <nav className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="font-semibold text-lg">E-Portfolio</Link>
        <ul className="flex gap-4 text-sm">
          <li><Link href="/about" className="hover:underline">About</Link></li>
          <li><Link href="/projects" className="hover:underline">Projects</Link></li>
          <li><Link href="/experience" className="hover:underline">Experience</Link></li>
          <li><Link href="/contact" className="hover:underline">Contact</Link></li>
        </ul>
      </nav>
    </header>
  );
}
