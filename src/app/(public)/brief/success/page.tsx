export default function BriefSuccessPage() {
    return (
        <main className="mx-auto flex min-h-screen max-w-4xl flex-col px-6 py-12">
            <section className="flex flex-1 flex-col justify-center gap-6">
                <p className="text-sm font-medium uppercase tracking-wide text-zinc-500">
                    Brief submitted
                </p>
                <h1 className="max-w-3xl text-4xl font-semibold leading-tight text-zinc-950">
                    Your readiness summary will appear here.
                </h1>
                <p className="max-w-2xl text-lg leading-8 text-zinc-600">
                    Once the wizard is connected, this page will show the score, level,
                    and detected gaps returned by the server action.
                </p>
            </section>
        </main>
    );
}