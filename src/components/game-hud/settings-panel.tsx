import { QuickButton } from "@/components/game-hud/quick-button";
import type { HudSnapshot, SpeedMode } from "@/components/game-hud/types";

type SettingsPanelProps = {
    snapshot: HudSnapshot;
    onSave: () => void;
    onLoad: () => void;
    onRestart: () => void;
    onClearData: () => void;
    onToggleAutoForward: () => void;
    onSetSpeed: (mode: SpeedMode) => void;
};

export function SettingsPanel({
    snapshot,
    onSave,
    onLoad,
    onRestart,
    onClearData,
    onToggleAutoForward,
    onSetSpeed,
}: SettingsPanelProps) {
    return (
        <div className="w-[min(360px,calc(100vw-2rem))] rounded-[28px] bg-white/60 p-5 text-[#513746] shadow-[0_24px_60px_rgba(52,29,40,0.22)] backdrop-blur-[2px]">
            <div className="mb-4 flex items-start justify-between gap-4">
                <div>
                    <div className="text-[12px] uppercase tracking-[0.16em] text-[#8a6072]">
                        Accessibility & Utility
                    </div>
                    <div className="mt-1 text-[24px] font-semibold">Play Controls</div>
                </div>
                <div className="text-right text-[12px] text-[#775364]">
                    Web quick save
                </div>
            </div>

            <div className="space-y-4">
                <div className="rounded-[20px] bg-white/72 px-4 py-3 shadow-[0_8px_20px_rgba(92,54,75,0.12)]">
                    <div className="text-[12px] uppercase tracking-[0.16em] text-[#8a6072]">
                        Quick Save
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                        <QuickButton onClick={onSave}>Save</QuickButton>
                        <QuickButton onClick={onLoad} disabled={!snapshot.hasSave}>
                            Load
                        </QuickButton>
                        <QuickButton onClick={onRestart}>Start Screen</QuickButton>
                    </div>
                </div>

                <div className="rounded-[20px] bg-white/72 px-4 py-3 shadow-[0_8px_20px_rgba(92,54,75,0.12)]">
                    <div className="text-[12px] uppercase tracking-[0.16em] text-[#8a6072]">
                        Reading Flow
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                        <QuickButton onClick={onToggleAutoForward} active={snapshot.autoForward}>
                            Auto {snapshot.autoForward ? "On" : "Off"}
                        </QuickButton>
                    </div>
                    <div className="mt-4 text-[12px] uppercase tracking-[0.16em] text-[#8a6072]">
                        Text Speed
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                        <QuickButton onClick={() => onSetSpeed("slow")} active={snapshot.cps <= 18}>
                            Slow
                        </QuickButton>
                        <QuickButton onClick={() => onSetSpeed("normal")} active={snapshot.cps > 18 && snapshot.cps < 40}>
                            Normal
                        </QuickButton>
                        <QuickButton onClick={() => onSetSpeed("fast")} active={snapshot.cps >= 40}>
                            Fast
                        </QuickButton>
                    </div>
                </div>

                <div className="rounded-[20px] bg-white/72 px-4 py-3 shadow-[0_8px_20px_rgba(92,54,75,0.12)]">
                    <div className="text-[12px] uppercase tracking-[0.16em] text-[#8a6072]">
                        Save Data
                    </div>
                    <p className="mt-2 text-[13px] leading-6 text-[#6d4a5b]">
                        Clears local progress, ending discoveries, and quick save data, then returns to the title screen.
                    </p>
                    <button
                        type="button"
                        onClick={onClearData}
                        className="mt-4 w-full rounded-[22px] border border-[#e8afc8] bg-[linear-gradient(135deg,#fff4f8,#ffdfe9_46%,#ffd0e0)] px-4 py-3 text-[14px] font-semibold text-[#6b3148] shadow-[0_12px_24px_rgba(125,71,96,0.16)] transition-all duration-200 hover:-translate-y-0.5"
                    >
                        Clear Game Data
                    </button>
                </div>
            </div>
        </div>
    );
}
