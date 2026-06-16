import { ReadinessSummary } from '@/components/brief/readines-summary'

export default function BriefSuccessPage() {
    return (
        <main className="mx-auto flex min-h-screen max-w-4xl flex-col px-6 py-12">

            <section className="mb-10 space-y-5">
                <p className="text-sm font-medium uppercase tracking-wide text-zinc-500">
                    Brief submitted
                </p>

                <h1 className="text-4xl font-semibold leading-tight text-zinc-950">
                    Your readiness summary is ready.
                </h1>
                <p className="max-w-2xl text-lg leading-8 text-zinc-600">
                    Once the wizard is connected, this page will show the score, level,
                    and detected gaps returned by the server action.
                </p>
                <p className="text-lg leading-8 text-zinc-600">
                    This score is based on your current brief. It helps identify whether
                    the project is ready for build or needs more shaping first.
                </p>
            </section>

            <ReadinessSummary />
        </main>
    );
}