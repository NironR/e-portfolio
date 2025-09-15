type Experience = {
  role: string;
  company: string;
  period: string;
  summary: string;
};

const sampleExperience: Experience[] = [
  { role: "Software Engineer", company: "Tech Co.", period: "2023 — Present", summary: "Building web apps with Next.js and TypeScript." },
  { role: "Intern", company: "Startup Inc.", period: "2022 — 2023", summary: "Worked on frontend features and testing." },
];

export default function ExperiencePage() {
  return (
    <section>
      <h1 className="text-3xl font-bold mb-4">Experience</h1>
      <ul className="space-y-4">
        {sampleExperience.map((e) => (
          <li key={e.role + e.company} className="border border-black/10 dark:border-white/15 rounded-lg p-4">
            <div className="flex items-baseline justify-between gap-4">
              <h2 className="text-xl font-semibold">{e.role} · {e.company}</h2>
              <span className="text-xs text-black/60 dark:text-white/60">{e.period}</span>
            </div>
            <p className="text-sm text-black/70 dark:text-white/70">{e.summary}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
