"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, type ComponentPropsWithoutRef } from "react";
import {
    useForm,
    type FieldErrors,
    type FieldPath,
    type UseFormRegister,
    type UseFormRegisterReturn
} from "react-hook-form";
import { submitBriefAction } from "@/app/(public)/brief/actions";
import {
    briefSchema,
    type BriefInput,
    type BudgetRange,
    type DeadlineRange,
    type PrimaryGoal,
    type ProjectType
} from "@/features/brief/brief.schema";

type Step = {
    title: string;
    description: string;
    fields: FieldPath<BriefInput>[];
};

const steps: Step[] = [
    {
        title: "Contact",
        description: "Tell me who is behind the project.",
        fields: ["name", "email", "company"]
    },
    {
        title: "Project",
        description: "Define the type of page and the primary conversion goal.",
        fields: ["projectType", "primaryGoal", "offerDescription"]
    },
    {
        title: "Audience & offer",
        description: "Clarify who the page is for and what action should happen.",
        fields: ["targetAudience", "audienceProblem", "desiredAction"]
    },
    {
        title: "Readiness & success",
        description: "Check launch readiness, constraints, and measurement.",
        fields: [
            "hasCopy",
            "hasBrandAssets",
            "hasAnalytics",
            "deadline",
            "budgetRange",
            "successMetric",
            "message"
        ]
    }
];

const projectTypeOptions = [
    { value: "landing_page", label: "Landing page" },
    { value: "marketing_site", label: "Marketing site" },
    { value: "redesign", label: "Redesign" },
    { value: "launch_page", label: "Launch page" }
] satisfies SelectOption<ProjectType>[];

const primaryGoalOptions = [
    { value: "leads", label: "Generate leads" },
    { value: "signups", label: "Drive signups" },
    { value: "bookings", label: "Book calls" },
    { value: "sales", label: "Support sales" },
    { value: "waitlist", label: "Build a waitlist" }
] satisfies SelectOption<PrimaryGoal>[];

const deadlineOptions = [
    { value: "asap", label: "As soon as possible" },
    { value: "two_four_weeks", label: "2-4 weeks" },
    { value: "one_two_months", label: "1-2 months" },
    { value: "flexible", label: "Flexible" }
] satisfies SelectOption<DeadlineRange>[];

const budgetOptions = [
    { value: "under_1000", label: "Under $1,000" },
    { value: "1000_3000", label: "$1,000-$3,000" },
    { value: "3000_7000", label: "$3,000-$7,000" },
    { value: "7000_plus", label: "$7,000+" },
    { value: "not_sure", label: "Not sure yet" }
] satisfies SelectOption<BudgetRange>[];

const defaultValues: BriefInput = {
    name: "",
    email: "",
    company: "",
    projectType: "landing_page",
    primaryGoal: "leads",
    offerDescription: "",
    targetAudience: "",
    audienceProblem: "",
    desiredAction: "",
    hasCopy: false,
    hasBrandAssets: false,
    hasAnalytics: false,
    deadline: "one_two_months",
    budgetRange: "3000_7000",
    successMetric: "",
    message: ""
};

type SelectOption<TValue extends string> = {
    value: TValue;
    label: string;
};

export function BriefWizard() {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(0);
    const [formError, setFormError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const step = steps[currentStep];
    const isFirstStep = currentStep === 0;
    const isLastStep = currentStep === steps.length - 1;

    const {
        register,
        handleSubmit,
        trigger,
        setError,
        formState: { errors }
    } = useForm<BriefInput>({
        resolver: zodResolver(briefSchema),
        defaultValues,
        mode: "onTouched"
    });

    async function goToNextStep() {
        setFormError(null);
        const isValid = await trigger(step.fields, { shouldFocus: true });

        if (!isValid) {
            return;
        }

        setCurrentStep((value) => Math.min(value + 1, steps.length - 1));
    }

    function goToPreviousStep() {
        setFormError(null);
        setCurrentStep((value) => Math.max(value - 1, 0));
    }

    async function onSubmit(values: BriefInput) {
        setIsSubmitting(true);
        setFormError(null);

        const result = await submitBriefAction(values);

        setIsSubmitting(false);

        if (!result.ok) {
            setFormError(result.message);

            for (const [field, messages] of Object.entries(result.fieldErrors ?? {})) {
                setError(field as FieldPath<BriefInput>, {
                    type: "server",
                    message: messages[0]
                });
            }

            return;
        }

        window.sessionStorage.setItem(
            "brief-readiness-summary",
            JSON.stringify(result.data)
        );
        router.push(`/brief/success?leadId=${result.data.leadId}`);
    }

    return (
        <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
            <aside className="space-y-6">
                <div>
                    <p className="text-sm font-medium uppercase tracking-wide text-zinc-500">
                        Step {currentStep + 1} of {steps.length}
                    </p>
                    <h2 className="mt-2 text-2xl font-semibold text-zinc-950">
                        {step.title}
                    </h2>
                    <p className="mt-3 text-sm leading-6 text-zinc-600">
                        {step.description}
                    </p>
                </div>

                <ol className="space-y-3">
                    {steps.map((item, index) => {
                        const isActive = index === currentStep;
                        const isComplete = index < currentStep;

                        return (
                            <li
                                className="flex items-center gap-3 text-sm"
                                key={item.title}
                            >
                                <span
                                    className={[
                                        "flex size-8 items-center justify-center rounded-full border text-xs font-semibold",
                                        isActive
                                            ? "border-zinc-950 bg-zinc-950 text-white"
                                            : "border-zinc-200 bg-white text-zinc-500",
                                        isComplete ? "border-emerald-600 text-emerald-700" : ""
                                    ].join(" ")}
                                >
                                    {isComplete ? <CheckCircle2 className="size-4" /> : index + 1}
                                </span>
                                <span
                                    className={
                                        isActive ? "font-medium text-zinc-950" : "text-zinc-500"
                                    }
                                >
                                    {item.title}
                                </span>
                            </li>
                        );
                    })}
                </ol>
            </aside>

            <form
                className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm"
                onSubmit={handleSubmit(onSubmit)}
            >
                {currentStep === 0 ? (
                    <ContactStep errors={errors} register={register} />
                ) : null}
                {currentStep === 1 ? (
                    <ProjectStep errors={errors} register={register} />
                ) : null}
                {currentStep === 2 ? (
                    <AudienceOfferStep errors={errors} register={register} />
                ) : null}
                {currentStep === 3 ? (
                    <ReadinessSuccessStep errors={errors} register={register} />
                ) : null}

                {formError ? (
                    <p className="mt-6 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        {formError}
                    </p>
                ) : null}

                <div className="mt-8 flex items-center justify-between border-t border-zinc-100 pt-6">
                    <button
                        className="inline-flex h-10 items-center gap-2 rounded-md border border-zinc-200 bg-white px-4 text-sm font-medium text-zinc-700 disabled:cursor-not-allowed disabled:opacity-40"
                        disabled={isFirstStep || isSubmitting}
                        onClick={goToPreviousStep}
                        type="button"
                    >
                        <ArrowLeft className="size-4" />
                        Back
                    </button>

                    {isLastStep ? (
                        <button
                            className="inline-flex h-10 items-center gap-2 rounded-md bg-zinc-950 px-5 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
                            disabled={isSubmitting}
                            type="submit"
                        >
                            {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : null}
                            Submit brief
                        </button>
                    ) : (
                        <button
                            className="inline-flex h-10 items-center gap-2 rounded-md bg-zinc-950 px-5 text-sm font-medium text-white"
                            onClick={goToNextStep}
                            type="button"
                        >
                            Continue
                            <ArrowRight className="size-4" />
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
}

function ContactStep({
    errors,
    register
}: StepComponentProps) {
    return (
        <div className="space-y-5">
            <InputField
                error={errors.name?.message}
                label="Name"
                placeholder="Alex Morgan"
                registration={register("name")}
            />
            <InputField
                error={errors.email?.message}
                label="Email"
                placeholder="alex@example.com"
                registration={register("email")}
                type="email"
            />
            <InputField
                error={errors.company?.message}
                label="Company or project"
                placeholder="Northstar Analytics"
                registration={register("company")}
            />
        </div>
    );
}

function ProjectStep({ errors, register }: StepComponentProps) {
    return (
        <div className="space-y-5">
            <SelectField
                error={errors.projectType?.message}
                label="Project type"
                options={projectTypeOptions}
                registration={register("projectType")}
            />
            <SelectField
                error={errors.primaryGoal?.message}
                label="Primary goal"
                options={primaryGoalOptions}
                registration={register("primaryGoal")}
            />
            <TextareaField
                error={errors.offerDescription?.message}
                label="What are you promoting?"
                placeholder="Describe the offer, product, service, or campaign this page should support."
                registration={register("offerDescription")}
                rows={5}
            />
        </div>
    );
}

function AudienceOfferStep({ errors, register }: StepComponentProps) {
    return (
        <div className="space-y-5">
            <TextareaField
                error={errors.targetAudience?.message}
                label="Who is the target audience?"
                placeholder="Describe the segment, role, company type, or buyer context."
                registration={register("targetAudience")}
                rows={4}
            />
            <TextareaField
                error={errors.audienceProblem?.message}
                label="What problem are they trying to solve?"
                placeholder="Describe the friction, cost, risk, or missed opportunity."
                registration={register("audienceProblem")}
                rows={4}
            />
            <InputField
                error={errors.desiredAction?.message}
                label="What should visitors do next?"
                placeholder="Book a discovery call, join a waitlist, request a demo..."
                registration={register("desiredAction")}
            />
        </div>
    );
}

function ReadinessSuccessStep({ errors, register }: StepComponentProps) {
    return (
        <div className="space-y-6">
            <div className="grid gap-3 sm:grid-cols-3">
                <CheckboxField label="Copy is ready" registration={register("hasCopy")} />
                <CheckboxField
                    label="Brand assets are ready"
                    registration={register("hasBrandAssets")}
                />
                <CheckboxField
                    label="Analytics are planned"
                    registration={register("hasAnalytics")}
                />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
                <SelectField
                    error={errors.deadline?.message}
                    label="Timeline"
                    options={deadlineOptions}
                    registration={register("deadline")}
                />
                <SelectField
                    error={errors.budgetRange?.message}
                    label="Budget range"
                    options={budgetOptions}
                    registration={register("budgetRange")}
                />
            </div>

            <InputField
                error={errors.successMetric?.message}
                label="How will success be measured?"
                placeholder="Increase qualified demo requests by 20%."
                registration={register("successMetric")}
            />
            <TextareaField
                error={errors.message?.message}
                label="Anything else?"
                placeholder="Add context, constraints, or links that would help."
                registration={register("message")}
                rows={4}
            />
        </div>
    );
}

type StepComponentProps = {
    errors: FieldErrors<BriefInput>;
    register: UseFormRegister<BriefInput>;
};

type FieldProps = {
    error?: string;
    label: string;
    registration: UseFormRegisterReturn;
};

function InputField({
    error,
    label,
    registration,
    ...props
}: FieldProps & ComponentPropsWithoutRef<"input">) {
    return (
        <label className="block space-y-2">
            <span className="text-sm font-medium text-zinc-900">{label}</span>
            <input
                className="h-11 w-full rounded-md border border-zinc-200 bg-white px-3 text-sm text-zinc-950 outline-none transition focus:border-zinc-400 focus:ring-4 focus:ring-zinc-100"
                {...registration}
                {...props}
            />
            {error ? <span className="text-sm text-red-600">{error}</span> : null}
        </label>
    );
}

function TextareaField({
    error,
    label,
    registration,
    ...props
}: FieldProps & ComponentPropsWithoutRef<"textarea">) {
    return (
        <label className="block space-y-2">
            <span className="text-sm font-medium text-zinc-900">{label}</span>
            <textarea
                className="w-full resize-y rounded-md border border-zinc-200 bg-white px-3 py-3 text-sm leading-6 text-zinc-950 outline-none transition focus:border-zinc-400 focus:ring-4 focus:ring-zinc-100"
                {...registration}
                {...props}
            />
            {error ? <span className="text-sm text-red-600">{error}</span> : null}
        </label>
    );
}

function SelectField<TValue extends string>({
    error,
    label,
    options,
    registration
}: FieldProps & {
    options: SelectOption<TValue>[];
}) {
    return (
        <label className="block space-y-2">
            <span className="text-sm font-medium text-zinc-900">{label}</span>
            <select
                className="h-11 w-full rounded-md border border-zinc-200 bg-white px-3 text-sm text-zinc-950 outline-none transition focus:border-zinc-400 focus:ring-4 focus:ring-zinc-100"
                {...registration}
            >
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            {error ? <span className="text-sm text-red-600">{error}</span> : null}
        </label>
    );
}

function CheckboxField({
    label,
    registration
}: {
    label: string;
    registration: UseFormRegisterReturn;
}) {
    return (
        <label className="flex min-h-24 items-start gap-3 rounded-md border border-zinc-200 bg-zinc-50 p-4 text-sm font-medium text-zinc-800">
            <input
                className="mt-1 size-4 rounded border-zinc-300"
                type="checkbox"
                {...registration}
            />
            <span>{label}</span>
        </label>
    );
}
