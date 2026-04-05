"use client";

type LandingScreenProps = {
    ready: boolean;
    completedCount: number;
    endingsFound: number;
    onStart: () => void;
};

export function LandingScreen({
    ready,
    completedCount,
    endingsFound,
    onStart,
}: LandingScreenProps) {
    const hasProgress = completedCount > 0 || endingsFound > 0;

    return (
        <div className="absolute inset-0 z-40 overflow-auto text-[#fff7fb]">
            <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: "url('/asset/background.png')" }}
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(11,7,12,0.18),rgba(13,8,14,0.5)_44%,rgba(10,7,12,0.92))]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,198,227,0.28),transparent_24%),radial-gradient(circle_at_left_center,rgba(123,211,239,0.18),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(255,146,200,0.16),transparent_26%)]" />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(8,5,9,0.74),rgba(8,5,9,0.24)_52%,rgba(8,5,9,0.8))]" />

            <div className="relative flex min-h-full items-center justify-center p-3 sm:p-4 md:p-8">
                <div className="grid w-full max-w-[1120px] items-end gap-4 sm:grid-cols-[minmax(0,1fr)_minmax(280px,350px)] sm:gap-5 lg:gap-9">
                    <div className="max-w-[620px] space-y-3 text-white sm:pb-2">
                       
                        <h1 className="intro-title intro-rise text-[clamp(2.5rem,8vw,6.3rem)] leading-[0.88] tracking-[0.02em] text-white drop-shadow-[0_12px_30px_rgba(0,0,0,0.34)]">
                            Beyond the Screen
                        </h1>
                        <p className="intro-rise max-w-[420px] text-[14px] leading-6 text-white/70 sm:text-[16px]">
                            Love, pressure, and quiet decisions beneath the glow of a screen.
                        </p>

                       
                    </div>

                    <div className="intro-rise rounded-[28px] border border-white/14 bg-[linear-gradient(180deg,rgba(24,14,23,0.56),rgba(16,10,19,0.9))] p-4 shadow-[0_30px_70px_rgba(0,0,0,0.38)] backdrop-blur-xl sm:p-5">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <div className="text-[10px] uppercase tracking-[0.24em] text-white/42">
                                    {hasProgress ? "Return" : "Begin"}
                                </div>
                                <div className="mt-2 text-[23px] font-semibold text-white sm:text-[27px]">
                                    {hasProgress ? "Continue" : "New Session"}
                                </div>
                            </div>
                        </div>


                        <div className="mt-4 grid grid-cols-2 gap-2 text-white">
                            <div className="rounded-[18px] border border-white/10 bg-black/16 px-4 py-3">
                                <div className="text-[10px] uppercase tracking-[0.18em] text-white/42">Routes</div>
                                <div className="mt-1 text-[21px] font-semibold">{completedCount}</div>
                            </div>
                            <div className="rounded-[18px] border border-white/10 bg-black/16 px-4 py-3">
                                <div className="text-[10px] uppercase tracking-[0.18em] text-white/42">Endings</div>
                                <div className="mt-1 text-[21px] font-semibold">{endingsFound}</div>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={onStart}
                            disabled={!ready}
                            className="mt-5 flex w-full items-center justify-center rounded-[24px] bg-[linear-gradient(135deg,#ffe1ef,#f6b7d4_48%,#ffcfe1)] px-5 py-4 text-[16px] font-semibold text-[#412633] shadow-[0_20px_40px_rgba(242,145,190,0.28)] transition-all duration-200 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {ready ? "Start Game" : "Preparing..."}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
