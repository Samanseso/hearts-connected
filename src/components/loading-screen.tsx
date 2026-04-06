"use client";

import { useEffect, useState } from "react";

type LoadingScreenProps = {
    title: string;
    detail: string;
    durationMs?: number;
};

const EXPONENTIAL_SHARPNESS = 5;

function getExponentialProgress(elapsedMs: number, durationMs: number) {
    const normalizedTime = Math.min(Math.max(elapsedMs / durationMs, 0), 1);
    const numerator = 1 - Math.exp(-EXPONENTIAL_SHARPNESS * normalizedTime);
    const denominator = 1 - Math.exp(-EXPONENTIAL_SHARPNESS);
    return numerator / denominator;
}

export function LoadingScreen({ title, detail, durationMs = 3000 }: LoadingScreenProps) {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        let frame = 0;
        const startedAt = performance.now();

        const tick = (now: number) => {
            const nextProgress = getExponentialProgress(now - startedAt, durationMs);
            setProgress(nextProgress);

            if (nextProgress < 1) {
                frame = window.requestAnimationFrame(tick);
            }
        };

        setProgress(0);
        frame = window.requestAnimationFrame(tick);

        return () => {
            window.cancelAnimationFrame(frame);
        };
    }, [durationMs, title, detail]);

    const percentage = Math.min(100, Math.round(progress * 100));

    return (
        <div className="fixed inset-0 z-[100] overflow-hidden text-[#fff7fb]">
            <div
                className="loading-backdrop-shift absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: "url('/asset/background.png')" }}
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,5,9,0.06),rgba(8,5,9,0.2)_38%,rgba(7,4,8,0.82))]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_10%,rgba(8,5,9,0.18)_58%,rgba(7,4,8,0.58)_100%)]" />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(8,5,9,0.28),transparent_26%,transparent_72%,rgba(8,5,9,0.34))]" />

            <div className="relative h-full w-full">
                <div className="absolute right-4 top-4 text-right sm:right-8 sm:top-7">
                    <div className="text-[10px] font-semibold uppercase tracking-[0.42em] text-white/68 sm:text-[11px]">
                        Beyond the Screen
                    </div>
                    <div className="loading-title-glow intro-title mt-2 text-[clamp(2.2rem,6vw,4.6rem)] leading-[0.88] text-white drop-shadow-[0_12px_30px_rgba(0,0,0,0.34)]">
                        Loading
                    </div>
                </div>

                <div className="absolute inset-x-0 bottom-[7vh] px-4 sm:px-8">
                    <div className="mx-auto w-full max-w-[760px]">
                        <div className="flex items-center justify-between gap-4 text-white drop-shadow-[0_8px_24px_rgba(0,0,0,0.42)]">
                            <div className="text-[16px] font-semibold sm:text-[22px]">{title}</div>
                            <div className="text-[15px] font-semibold uppercase tracking-[0.18em] text-white/82 sm:text-[18px]">
                                {percentage}%
                            </div>
                        </div>

                        <div className="mt-4 rounded-full border border-white/18 bg-[linear-gradient(180deg,rgba(10,7,12,0.82),rgba(0,0,0,0.58))] p-1.5 shadow-[0_24px_44px_rgba(0,0,0,0.36)]">
                            <div className="h-3 overflow-hidden rounded-full bg-white/10">
                                <div
                                    className="h-full rounded-full bg-[linear-gradient(90deg,#f08bc3,#ffd8ea,#8edcf0,#f08bc3)] shadow-[0_0_24px_rgba(255,180,222,0.4)] transition-[width] duration-75"
                                    style={{ width: percentage + "%" }}
                                />
                            </div>
                        </div>

                        <div className="mt-3 text-center text-[16px] font-semibold uppercase tracking-[0.24em] text-white/82 sm:text-[18px]">
                            Preparing Scene
                        </div>
                        <p className="mx-auto mt-2 max-w-[620px] text-center text-[13px] leading-6 text-white/72 sm:text-[14px]">
                            {detail}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
