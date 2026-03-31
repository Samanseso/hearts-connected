import { PLAYABLE_SCENARIO_IDS, SCENARIO_META, type PlayableScenarioId } from "@/lib/game-data";
import { GRADE_LABELS, type RouteGrade } from "@/lib/route-grading";

type ScenarioChecklistProps = {
    completedScenarios: PlayableScenarioId[];
    bestScenarioScores: Record<PlayableScenarioId, number>;
    bestScenarioGrades: Record<PlayableScenarioId, RouteGrade>;
};

export function ScenarioChecklist({
    completedScenarios,
    bestScenarioScores,
    bestScenarioGrades,
}: ScenarioChecklistProps) {
    return (
        <div className="space-y-2">
            {PLAYABLE_SCENARIO_IDS.map((scenarioId) => {
                const complete = completedScenarios.includes(scenarioId);
                const meta = SCENARIO_META[scenarioId];
                const grade = bestScenarioGrades[scenarioId];
                const score = bestScenarioScores[scenarioId];

                return (
                    <div
                        key={scenarioId}
                        className="flex items-center gap-3 rounded-[18px] bg-white/70 px-3 py-3 text-[13px] text-[#503848] shadow-[0_8px_20px_rgba(92,54,75,0.12)]"
                    >
                        <div
                            className="h-7 w-7 shrink-0 bg-contain bg-center bg-no-repeat"
                            style={{
                                backgroundImage: complete
                                    ? "url('/asset/Icons/Checkmark.png')"
                                    : "url('/asset/Icons/BlueHeart.png')",
                            }}
                        />
                        <div className="min-w-0 flex-1">
                            <div className="truncate font-semibold">{meta.shortLabel}</div>
                            <div className="truncate text-[11px] uppercase tracking-[0.16em] text-[#8b6274]">
                                {meta.theme}
                            </div>
                        </div>
                        <div className="shrink-0 text-right">
                            <div className="rounded-full bg-[#f7d8ea] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#6a4254]">
                                {grade === "none" ? "Not Cleared" : `${grade} ${GRADE_LABELS[grade]}`}
                            </div>
                            <div className="mt-1 text-[11px] text-[#7a5567]">
                                {complete ? `${score}/100` : "No score yet"}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
