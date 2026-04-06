import { GameMenu, Item, useGame } from "narraleaf-react";
import { PERSIS_NAMESPACE } from "@/lib/persistents";

function DefaultMenu({ items }: { items: number[] }) {
    const game = useGame();
    let scenario = "hub";

    try {
        scenario = game
            .getLiveGame()
            .getStorable()
            .getNamespace(PERSIS_NAMESPACE)
            .get("currentScenario");
    } catch {
        scenario = "hub";
    }

    const isHub = scenario === "hub";

    return (
        <GameMenu
            className={[
                "pointer-events-none absolute inset-0 flex h-full w-full",
                isHub ? "items-center justify-end px-4" : "items-end justify-center px-4 pb-[265px] md:px-8 md:pb-[284px]",
            ].join(" ")}
        >
            <div
                className={[
                    "pointer-events-auto w-full",
                    isHub ? "max-w-[480px] px-3" : "max-w-[520px] md:max-w-[560px]",
                ].join(" ")}
            >
                <div
                    className={[
                        "space-y-3 backdrop-blur-[10px]",
                        isHub
                            ? "rounded-[34px] border border-white/60 bg-white/24 px-3 py-4 shadow-[0_24px_50px_rgba(76,47,60,0.16)] md:px-4 max-h-[72vh] overflow-y-auto"
                            : "rounded-[34px] border shadow-[0_24px_50px_rgba(76,47,60,0.16)] backdrop-blur-[10px] border-white/55 bg-white/20 px-3 py-3",
                    ].join(" ")}
                >
                    {items.map((index) => (
                        <Item
                            key={index}
                            className={[
                                "block w-full border text-left font-semibold tracking-[0.02em] text-[#4f2f3f] transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50",
                    isHub
                        ? "rounded-[20px] border-[#f0bfd5] bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(255,233,243,0.9))] px-4 py-2 text-[15px] shadow-[0_10px_20px_rgba(91,57,73,0.14)] hover:-translate-y-0.5 hover:shadow-[0_14px_20px_rgba(91,57,73,0.18)] md:text-[16px]"
                        : "rounded-[22px] border-white/75 bg-[linear-gradient(135deg,rgba(255,255,255,0.95),rgba(255,235,245,0.92))] px-5 py-4 text-[15px] shadow-[0_12px_24px_rgba(91,57,73,0.18)] hover:-translate-y-0.5 hover:bg-[linear-gradient(135deg,rgba(255,255,255,0.98),rgba(255,223,239,0.96))] md:text-[16px]",
                            ].join(" ")}
                        />
                    ))}
                </div>
            </div>
        </GameMenu>
    );
}

export { DefaultMenu as GameMenu };
