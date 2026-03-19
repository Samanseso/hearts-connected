import type { ScenarioMeta } from "@/lib/game-data";
import type { PersisData } from "@/lib/persistents";
import { STAT_LABELS, STAT_ORDER } from "@/components/game-hud/constants";
import { ScenarioChecklist } from "@/components/game-hud/scenario-checklist";
import { StatBar } from "@/components/game-hud/stat-bar";

type StoryInfoPanelProps = {
    currentMeta: ScenarioMeta | null;
    persis: PersisData;
    completedCount: number;
    endingsFound: number;
    title: string;
    icon: string;
};

export function StoryInfoPanel({
    currentMeta,
    persis,
    completedCount,
    endingsFound,
    title,
    icon,
}: StoryInfoPanelProps) {
    return (
        <div className="w-[min(360px,calc(100vw-2rem))] sm:w-[min(400px,calc(100vw-6.5rem))] backdrop-blur-[2px]">
            <div
                className="rounded-[30px] p-5 text-[#513746] shadow-[0_22px_60px_rgba(61,34,48,0.18)] bg-white/60"

            >
                <div className="mb-4 flex items-start justify-between gap-4">
                    <div>
                        <div className="text-[11px] uppercase tracking-[0.26em] text-[#956779]">
                            Hearts Connected
                        </div>
                        <h2 className="text-[24px] font-semibold leading-tight">
                            {title}
                        </h2>
                    </div>
                    <div
                        className="mt-1 h-10 w-10 shrink-0 bg-contain bg-center bg-no-repeat"
                        style={{ backgroundImage: `url('${icon}')` }}
                    />
                </div>

                {currentMeta ? (
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <div className="text-[15px] font-semibold leading-tight">
                                {persis.currentScenarioTitle}
                            </div>
                            <div className="text-[12px] uppercase tracking-[0.16em] text-[#8c6476]">
                                {persis.currentScenarioTheme}
                            </div>
                            <div className="rounded-[18px] bg-white/70 px-3 py-2 text-[12px] text-[#6f4b5c] shadow-[0_8px_20px_rgba(92,54,75,0.12)]">
                                Content Note: {persis.currentContentWarning}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-3">
                            {STAT_ORDER.map((key, index) => (
                                <StatBar
                                    key={key}
                                    label={STAT_LABELS[key]}
                                    value={persis[key]}
                                    tone={index % 2 === 0 ? "pink" : "blue"}
                                />
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="rounded-[20px] bg-white/72 px-4 py-3 shadow-[0_8px_20px_rgba(92,54,75,0.12)]">
                            <div className="text-[12px] uppercase tracking-[0.16em] text-[#8a6072]">
                                Progress
                            </div>
                            <div className="mt-2 flex items-end justify-between gap-4">
                                <div>
                                    <div className="text-[28px] font-semibold leading-none">
                                        {completedCount}/5
                                    </div>
                                    <div className="text-[13px] text-[#6d4a5b]">
                                        Core scenarios completed
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-[22px] font-semibold leading-none">
                                        {endingsFound}/15
                                    </div>
                                    <div className="text-[13px] text-[#6d4a5b]">
                                        Endings discovered
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-[20px] bg-white/72 px-4 py-3 shadow-[0_8px_20px_rgba(92,54,75,0.12)]">
                            <div className="flex items-center justify-between gap-4">
                                <div>
                                    <div className="text-[12px] uppercase tracking-[0.16em] text-[#8a6072]">
                                        Bonus Unlock
                                    </div>
                                    <div className="mt-1 text-[15px] font-semibold">
                                        Reflection Mode
                                    </div>
                                </div>
                                <div className="text-right text-[13px] text-[#6d4a5b]">
                                    {persis.reflectionUnlocked ? "Unlocked" : "Finish all five stories"}
                                </div>
                            </div>
                        </div>

                        <ScenarioChecklist completedScenarios={persis.completedScenarios} />
                    </div>
                )}
            </div>
        </div>
    );
}
