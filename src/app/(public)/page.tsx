export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-6xl flex-col px-6 py-12">
      <section className="flex flex-1 flex-col justify-center gap-8">
        <div className="max-w-3xl space-y-6">
          <p className="text-sm font-medium uppercase tracking-wide text-zinc-500">
            Portfolio Conversion Studio
          </p>
          <h1 className="text-5xl font-semibold leading-tight text-zinc-950">
            Conversion-focused websites for teams that need clarity, speed, and
            measurable outcomes.
          </h1>
          <p className="max-w-2xl text-lg leading-8 text-zinc-600">
            A professional product engineering portfolio with a real lead intake
            workflow, readiness scoring, and an admin CRM.
          </p>
        </div>
      </section>
    </main>
  );
}
