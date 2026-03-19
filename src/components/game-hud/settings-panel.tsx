import { QuickButton } from "@/components/game-hud/quick-button";
import type { HudSnapshot, SpeedMode } from "@/components/game-hud/types";

type SettingsPanelProps = {
    snapshot: HudSnapshot;
    onSave: () => void;
    onLoad: () => void;
    onRestart: () => void;
    onToggleAutoForward: () => void;
    onSetSpeed: (mode: SpeedMode) => void;
};

export function SettingsPanel({
    snapshot,
    onSave,
    onLoad,
    onRestart,
    onToggleAutoForward,
    onSetSpeed,
}: SettingsPanelProps) {
    return (
        <div
            className="w-[min(360px,calc(100vw-2rem))] rounded-[28px] p-5 text-[#513746] shadow-[0_24px_60px_rgba(52,29,40,0.22)] bg-white/60 backdrop-blur-[2px]"
        >
            <div className="mb-4 flex items-start justify-between gap-4">
                <div>
                    <div className="text-[12px] uppercase tracking-[0.16em] text-[#8a6072]">
                        Accessibility & Utility
                    </div>
                    <div className="text-[24px] font-semibold mt-1">Play Controls</div>
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
                        <QuickButton onClick={onRestart}>Restart</QuickButton>
                    </div>
                </div>

                <div className="rounded-[20px] bg-white/72 px-4 py-3 shadow-[0_8px_20px_rgba(92,54,75,0.12)]">
                    <div className="text-[12px] uppercase tracking-[0.16em] text-[#8a6072]">
                        Reading Flow
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                        <QuickButton
                            onClick={onToggleAutoForward}
                            active={snapshot.autoForward}
                        >
                            Auto {snapshot.autoForward ? "On" : "Off"}
                        </QuickButton>
                    </div>
                    <div className="mt-4 text-[12px] uppercase tracking-[0.16em] text-[#8a6072]">
                        Text Speed
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                        <QuickButton
                            onClick={() => onSetSpeed("slow")}
                            active={snapshot.cps <= 18}
                        >
                            Slow
                        </QuickButton>
                        <QuickButton
                            onClick={() => onSetSpeed("normal")}
                            active={snapshot.cps > 18 && snapshot.cps < 40}
                        >
                            Normal
                        </QuickButton>
                        <QuickButton
                            onClick={() => onSetSpeed("fast")}
                            active={snapshot.cps >= 40}
                        >
                            Fast
                        </QuickButton>
                    </div>
                </div>
            </div>
        </div>
    );
}
