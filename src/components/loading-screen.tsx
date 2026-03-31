"use client";

type LoadingScreenProps = {
    title: string;
    detail: string;
};

export function LoadingScreen({ title, detail }: LoadingScreenProps) {
    return (
        <div className="absolute inset-0 z-50 overflow-hidden text-[#fff7fb]">
            <div
                className="absolute inset-0 scale-[1.04] bg-cover bg-center"
                style={{ backgroundImage: "url('/asset/HomeScreen/HomeScreenBackground.jpg')" }}
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(14,8,14,0.22),rgba(20,10,18,0.62)_44%,rgba(20,9,16,0.92))]" />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(10,7,11,0.82),rgba(10,7,11,0.3)_50%,rgba(10,7,11,0.82))]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,189,223,0.28),transparent_28%),radial-gradient(circle_at_left_center,rgba(101,210,240,0.18),transparent_34%)]" />

            <div className="relative flex h-full items-center justify-center p-6 md:p-10">
                <div className="w-full max-w-[560px] rounded-[34px] border border-white/14 bg-[linear-gradient(180deg,rgba(27,15,24,0.74),rgba(18,12,21,0.92))] p-8 text-center shadow-[0_30px_70px_rgba(0,0,0,0.38)] backdrop-blur-xl md:p-10">
                    <div className="loading-ring mx-auto flex h-24 w-24 items-center justify-center rounded-full border border-[#ffd7e9]/35 bg-[radial-gradient(circle,rgba(255,214,236,0.2),rgba(255,255,255,0.02))]">
                        <div className="h-10 w-10 rounded-full bg-[#ffd7e9]/80 shadow-[0_0_40px_rgba(255,215,233,0.35)]" />
                    </div>

                    <div className="mt-6 text-[12px] uppercase tracking-[0.34em] text-[#f8cedf]">
                        Beyond the Screen
                    </div>
                    <h2 className="intro-title mt-3 text-[clamp(2.3rem,5vw,3.5rem)] leading-[0.96] text-white">
                        {title}
                    </h2>
                    <p className="mx-auto mt-3 max-w-[420px] text-[15px] leading-7 text-white/72">
                        {detail}
                    </p>

                    <div className="mt-7 rounded-full border border-white/10 bg-black/18 p-2">
                        <div className="h-2 overflow-hidden rounded-full bg-white/8">
                            <div className="loading-bar h-full rounded-full bg-[linear-gradient(90deg,#ffd8ea,#f6accd,#8fd9ef)]" />
                        </div>
                    </div>

                    <div className="mt-4 text-[11px] uppercase tracking-[0.24em] text-white/48">
                        Syncing route memory
                    </div>
                </div>
            </div>
        </div>
    );
}
