export default function ContactPage() {
  return (
    <section>
      <h1 className="text-3xl font-bold mb-4">Contact</h1>
      <p className="text-black/80 dark:text-white/80 mb-4">Feel free to reach out via any of the channels below:</p>
      <ul className="space-y-2 list-disc list-inside">
        <li>Email: <a href="mailto:you@example.com" className="text-blue-600 dark:text-blue-400 hover:underline">you@example.com</a></li>
        <li>LinkedIn: <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline">your-profile</a></li>
        <li>GitHub: <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline">@yourhandle</a></li>
      </ul>
    </section>
  );
}
