"use client";

import type { PlayerGender } from "@/lib/persistents";

type LandingScreenProps = {
    ready: boolean;
    selectedGender: PlayerGender;
    completedCount: number;
    endingsFound: number;
    onGenderChange: (gender: PlayerGender) => void;
    onStart: () => void;
};

function IntroChip({ label }: { label: string }) {
    return (
        <div className="rounded-full border border-white/18 bg-black/18 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/78 backdrop-blur-md">
            {label}
        </div>
    );
}

function PerspectiveButton({
    active,
    label,
    description,
    onClick,
}: {
    active: boolean;
    label: string;
    description: string;
    onClick: () => void;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={[
                "rounded-[24px] border px-4 py-4 text-left transition-all duration-200",
                active
                    ? "border-[#ffd8ea] bg-[linear-gradient(180deg,rgba(255,214,236,0.22),rgba(255,255,255,0.12))] shadow-[0_18px_32px_rgba(10,6,14,0.36)]"
                    : "border-white/12 bg-black/16 hover:-translate-y-0.5 hover:bg-white/10",
            ].join(" ")}
        >
            <div className="flex items-center justify-between gap-3">
                <div className="text-[11px] uppercase tracking-[0.18em] text-white/60">Perspective</div>
                <span
                    className={[
                        "h-3 w-3 rounded-full border transition-all duration-200",
                        active ? "border-[#ffd8ea] bg-[#ffd8ea] shadow-[0_0_0_5px_rgba(255,216,234,0.12)]" : "border-white/35 bg-transparent",
                    ].join(" ")}
                />
            </div>
            <div className="mt-3 text-[22px] font-semibold text-white">{label}</div>
            <div className="mt-1 text-[13px] leading-6 text-white/72">{description}</div>
        </button>
    );
}

export function LandingScreen({
    ready,
    selectedGender,
    completedCount,
    endingsFound,
    onGenderChange,
    onStart,
}: LandingScreenProps) {
    const hasProgress = completedCount > 0 || endingsFound > 0;

    return (
        <div className="absolute inset-0 z-40 overflow-hidden text-[#fff7fb]">
            <div
                className="absolute inset-0 scale-[1.04] bg-cover bg-center"
                style={{ backgroundImage: "url('/asset/HomeScreen/HomeScreenBackground.jpg')" }}
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(14,8,14,0.18),rgba(20,10,18,0.58)_44%,rgba(20,9,16,0.9))]" />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(10,7,11,0.78),rgba(10,7,11,0.26)_50%,rgba(10,7,11,0.78))]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,189,223,0.28),transparent_28%),radial-gradient(circle_at_left_center,rgba(101,210,240,0.18),transparent_34%)]" />

            <div className="relative flex h-full flex-col justify-between p-5 sm:p-7 lg:px-10">
                

                <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
                    <div className="max-w-[720px] space-y-5 text-white">
                        <div className="intro-rise text-[12px] uppercase tracking-[0.34em] text-[#f8cedf]" style={{ animationDelay: "80ms" }}>
                            Beyond the Screen
                        </div>
                        <h1
                            className="intro-title intro-rise text-[clamp(3.3rem,8vw,6.6rem)] leading-[0.92] tracking-[0.02em] text-white drop-shadow-[0_10px_34px_rgba(0,0,0,0.35)]"
                            style={{ animationDelay: "140ms" }}
                        >
                            Beyond the Screen
                        </h1>
                        <p className="intro-rise max-w-[620px] text-[17px] leading-8 text-white/80 md:text-[19px]" style={{ animationDelay: "220ms" }}>
                            Modern love under the glow of notifications. Step into a short anthology about
                            jealousy, comparison, peer pressure, commitment, and emotional availability among
                            college-age partners.
                        </p>

                        <div className="intro-rise flex flex-wrap gap-3" style={{ animationDelay: "280ms" }}>
                            <IntroChip label="7 branching case studies" />
                            <IntroChip label="Reflective endings" />
                            <IntroChip label="Local progress save" />
                        </div>
                    </div>

                    <div className="lg:justify-self-end max-w-lg intro-rise relative rounded-[34px] border border-white/14 bg-[linear-gradient(180deg,rgba(27,15,24,0.74),rgba(18,12,21,0.92))] p-5 shadow-[0_30px_70px_rgba(0,0,0,0.38)] backdrop-blur-xl md:p-6" style={{ animationDelay: "340ms" }}>
                        <div className="intro-float absolute right-5 top-5 rounded-full border border-[#ffd5e8]/28 bg-[#ffd5e8]/12 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#ffdceb]">
                            {hasProgress ? "Continue File" : "New Run"}
                        </div>

                        <div className="max-w-[460px]">
                            <div className="text-[12px] uppercase tracking-[0.24em] text-white/56">
                                Start Session
                            </div>
                            <h2 className="mt-3 text-[32px] font-semibold leading-tight text-white">
                                Enter the story hub
                            </h2>
                            <p className="mt-3 text-[14px] leading-7 text-white/70">
                                Choose your perspective before you begin. Research notes, characters,
                                achievement board, and credits live in the dashboard once you enter.
                            </p>

                            <div className="mt-6 grid gap-3 sm:grid-cols-2">
                                <PerspectiveButton
                                    active={selectedGender === "girl"}
                                    label="Girl"
                                    description="Frames introspective lines from a girl perspective."
                                    onClick={() => onGenderChange("girl")}
                                />
                                <PerspectiveButton
                                    active={selectedGender === "boy"}
                                    label="Boy"
                                    description="Frames introspective lines from a boy perspective."
                                    onClick={() => onGenderChange("boy")}
                                />
                            </div>

                            <div className="mt-5 rounded-[24px] border border-white/12 bg-white/8 px-5 py-4 shadow-[0_16px_28px_rgba(0,0,0,0.18)]">
                                <div className="flex items-center justify-between gap-4">
                                    <div>
                                        <div className="text-[11px] uppercase tracking-[0.18em] text-white/54">
                                            Save Data
                                        </div>
                                        <div className="mt-1 text-[20px] font-semibold text-white">
                                            {hasProgress ? "Resume your anthology run" : "Fresh start ready"}
                                        </div>
                                    </div>
                                    <div className="rounded-full border border-white/12 bg-black/18 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/62">
                                        Browser Save
                                    </div>
                                </div>

                                <div className="mt-4 grid grid-cols-2 gap-3">
                                    <div className="rounded-[18px] border border-white/8 bg-black/16 px-4 py-3">
                                        <div className="text-[11px] uppercase tracking-[0.16em] text-white/50">
                                            Routes
                                        </div>
                                        <div className="mt-1 text-[24px] font-semibold text-white">
                                            {completedCount}
                                        </div>
                                    </div>
                                    <div className="rounded-[18px] border border-white/8 bg-black/16 px-4 py-3">
                                        <div className="text-[11px] uppercase tracking-[0.16em] text-white/50">
                                            Endings
                                        </div>
                                        <div className="mt-1 text-[24px] font-semibold text-white">
                                            {endingsFound}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={onStart}
                                disabled={!ready}
                                className="mt-6 flex w-full items-center justify-center rounded-[26px] bg-[linear-gradient(135deg,#ffd3e8,#f5accd_48%,#ffc6dd)] px-5 py-4 text-[18px] font-semibold text-[#412633] shadow-[0_20px_40px_rgba(242,145,190,0.28)] transition-all duration-200 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {ready ? (hasProgress ? "Continue to Dashboard" : "Start the Story") : "Preparing story..."}
                            </button>

                            <p className="mt-3 text-center text-[12px] leading-6 text-white/56">
                                You can switch perspective any time before starting a new session.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

