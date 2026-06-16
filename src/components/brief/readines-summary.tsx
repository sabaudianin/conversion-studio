"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { SubmitBriefResult } from "@/app/(public)/brief/actions";

const levelLabels: Record<
    SubmitBriefResult["readinessScore"]["level"],
    string
> = {
    ready_for_build: "Ready for build",
    strong_start: "Strong start",
    needs_shaping: "Needs shaping",
    discovery_first: "Discovery first"
};

const breakdownLabels: Record<
    keyof SubmitBriefResult["readinessScore"]["breakdown"],
    string
> = {
    goalClarity: "Goal clarity",
    offerClarity: "Offer clarity",
    audienceClarity: "Audience clarity",
    assetReadiness: "Asset readiness",
    timelineFit: "Timeline fit",
    budgetFit: "Budget fit",
    measurementReadiness: "Measurement readiness"
};

const breakdownMaxScores: Record<
    keyof SubmitBriefResult["readinessScore"]["breakdown"],
    number
> = {
    goalClarity: 20,
    offerClarity: 20,
    audienceClarity: 20,
    assetReadiness: 15,
    timelineFit: 10,
    budgetFit: 10,
    measurementReadiness: 5
};

export function ReadinessSummary() {
    const [summary, setSummary] = useState<SubmitBriefResult | null>(null);

    useEffect(() => {
        const storedSummary = window.sessionStorage.getItem(
            "brief-readiness-summary"
        );

        if (storedSummary) {
            // avoid synchronous setState inside effect to prevent cascading renders
            const parsed = JSON.parse(storedSummary) as SubmitBriefResult;
            // schedule state update after current render cycle
            const t = window.setTimeout(() => setSummary(parsed), 0);
            return () => window.clearTimeout(t);
        }
    }, []);

    if (!summary) {
        return (
            <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
                <h2 className="text-xl font-semibold text-zinc-950">
                    No summary found
                </h2>
                <p className="mt-3 text-sm leading-6 text-zinc-600">
                    Submit the project brief first to generate a readiness summary.
                </p>
                <Link
                    className="mt-6 inline-flex h-10 items-center rounded-md bg-zinc-950 px-4 text-sm font-medium text-white"
                    href={{ pathname: "/brief" }}
                >
                    Start brief
                </Link>
            </div>
        );
    }

    const { readinessScore } = summary;

    return (
        <div className="space-y-6">
            <section className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
                <p className="text-sm font-medium uppercase tracking-wide text-zinc-500">
                    Readiness score
                </p>
                <div className="mt-4 flex flex-wrap items-end gap-4">
                    <p className="text-6xl font-semibold text-zinc-950">
                        {readinessScore.total}
                    </p>
                    <div className="pb-2">
                        <p className="text-sm text-zinc-500">out of 100</p>
                        <p className="text-lg font-medium text-zinc-950">
                            {levelLabels[readinessScore.level]}
                        </p>
                    </div>
                </div>
            </section>

            <section className="grid gap-4 md:grid-cols-2">
                {Object.entries(readinessScore.breakdown).map(([key, value]) => {
                    const breakdownKey =
                        key as keyof SubmitBriefResult["readinessScore"]["breakdown"];
                    const percentage = Math.round(
                        (value / breakdownMaxScores[breakdownKey]) * 100
                    );

                    return (
                        <div
                            className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm"
                            key={key}
                        >
                            <div className="flex items-center justify-between gap-4">
                                <p className="text-sm font-medium text-zinc-900">
                                    {breakdownLabels[breakdownKey]}
                                </p>
                                <p className="text-sm font-semibold text-zinc-950">
                                    {value}/{breakdownMaxScores[breakdownKey]}
                                </p>
                            </div>
                            <div className="mt-3 h-2 rounded-full bg-zinc-100">
                                <div
                                    className="h-2 rounded-full bg-emerald-600"
                                    style={{ width: `${percentage}%` }}
                                />
                            </div>
                        </div>
                    );
                })}
            </section>

            <section className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
                <h2 className="text-xl font-semibold text-zinc-950">Detected gaps</h2>
                {readinessScore.detectedGaps.length > 0 ? (
                    <ul className="mt-4 space-y-3">
                        {readinessScore.detectedGaps.map((gap) => (
                            <li
                                className="rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-900"
                                key={gap}
                            >
                                {gap}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="mt-3 text-sm leading-6 text-zinc-600">
                        No major gaps were detected. I will review the brief and follow up
                        with next steps.
                    </p>
                )}
            </section>
        </div>
    );
}