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
        <GameMenu className="pointer-events-none absolute inset-0 flex h-full w-full items-center justify-center">
            <div className="pointer-events-auto relative w-full max-w-5xl px-4 md:px-8">
                <div className="space-y-4 px-4 py-8 md:px-10">
                    {items.map((index) => (
                        <Item
                            key={index}
                            className="mx-auto block min-h-[68px] w-full max-w-[780px] px-8 py-4 text-center text-[15px] font-semibold tracking-[0.04em] text-[#4f2f3f] transition-transform duration-200 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50 md:text-[17px]"
                            style={{
                                backgroundImage: isHub
                                    ? "url('/asset/HomeScreen/Button.png')"
                                    : "url('/asset/Dialogue/ReplyBtn.png')",
                                backgroundSize: "100% 100%",
                                backgroundPosition: "center",
                                backgroundRepeat: "no-repeat",
                                filter: "drop-shadow(0 12px 20px rgba(77, 46, 59, 0.22))",
                            }}
                        />
                    ))}
                </div>
            </div>
        </GameMenu>
    );
}

export { DefaultMenu as GameMenu };
