type Project = {
  title: string;
  description: string;
  link?: string;
};

const sampleProjects: Project[] = [
  { title: "Portfolio Boilerplate", description: "This site. A minimal Next.js starter for your e-portfolio.", link: "#" },
  { title: "Awesome App", description: "A brief description of a cool project you built.", link: "#" },
];

export default function ProjectsPage() {
  return (
    <section>
      <h1 className="text-3xl font-bold mb-4">Projects</h1>
      <ul className="grid gap-4 sm:grid-cols-2">
        {sampleProjects.map((p) => (
          <li key={p.title} className="border border-black/10 dark:border-white/15 rounded-lg p-4">
            <h2 className="text-xl font-semibold">{p.title}</h2>
            <p className="text-sm text-black/70 dark:text-white/70 mb-2">{p.description}</p>
            {p.link && (
              <a href={p.link} className="text-blue-600 dark:text-blue-400 hover:underline text-sm">View project →</a>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
