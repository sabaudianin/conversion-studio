export default function BriefPage() {
    return (
        <main className="mx-auto flex min-h-screen max-w-4xl flex-col px-6 py-12">
            <section className="flex flex-1 flex-col justify-center gap-6">
                <p className="text-sm font-medium uppercase tracking-wide text-zinc-500">
                    Project brief
                </p>
                <h1 className="max-w-3xl text-4xl font-semibold leading-tight text-zinc-950">
                    Start with a focused landing page brief.
                </h1>
                <p className="max-w-2xl text-lg leading-8 text-zinc-600">
                    The next step is a four-part form that captures the offer, audience,
                    readiness, and success criteria before creating a scored lead.
                </p>
            </section>
        </main>
    );
}