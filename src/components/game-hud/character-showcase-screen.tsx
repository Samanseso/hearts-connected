"use client";

import { useEffect } from "react";
import { CharacterShowcasePanel } from "@/components/game-hud/character-showcase-panel";
import type { PersisData } from "@/lib/persistents";

type CharacterShowcaseScreenProps = {
    persis: PersisData;
    onClose: () => void;
};

export function CharacterShowcaseScreen({ persis, onClose }: CharacterShowcaseScreenProps) {
    useEffect(() => {
        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                onClose();
            }
        };

        window.addEventListener("keydown", onKeyDown);

        return () => {
            window.removeEventListener("keydown", onKeyDown);
        };
    }, [onClose]);

    return (
        <div className="pointer-events-auto fixed inset-0 z-40 overflow-hidden text-[#fff7fb]">
            <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: "url('/asset/background.png')" }}
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(11,7,12,0.36),rgba(13,8,14,0.7)_34%,rgba(10,7,12,0.94))]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,198,227,0.24),transparent_24%),radial-gradient(circle_at_left_center,rgba(123,211,239,0.16),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(255,146,200,0.12),transparent_28%)]" />

            <div className="relative flex h-full flex-col p-4 sm:p-6">
                <div className="mb-4 flex items-start justify-between gap-4">
                    <div>
                        <div className="text-[11px] uppercase tracking-[0.28em] text-white/58">
                            Beyond the Screen
                        </div>
                        <h1 className="intro-title mt-2 text-[clamp(2rem,5vw,3.6rem)] leading-[0.92] text-white drop-shadow-[0_12px_30px_rgba(0,0,0,0.34)]">
                            Character Showcase
                        </h1>
                        <p className="mt-2 max-w-[720px] text-[13px] leading-6 text-white/74 sm:text-[14px]">
                            Browse unlocked route characters, swap reaction faces, and replay voice lines from completed stories.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-full border border-white/18 bg-white/88 px-5 py-3 text-[12px] font-semibold uppercase tracking-[0.16em] text-[#513746] shadow-[0_16px_36px_rgba(47,31,40,0.2)] transition-transform duration-200 hover:scale-[1.02]"
                    >
                        Back
                    </button>
                </div>

                <div className="min-h-0 flex-1 overflow-y-auto pr-1 [&::-webkit-scrollbar]:w-0">
                    <CharacterShowcasePanel persis={persis} />
                </div>
            </div>
        </div>
    );
}
