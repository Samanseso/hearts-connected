type StoryInfoToggleProps = {
    title: string;
    icon: string;
    open: boolean;
    onClick: () => void;
};

export function StoryInfoToggle({
    title,
    icon,
    open,
    onClick,
}: StoryInfoToggleProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            aria-expanded={open}
            className="flex min-h-14 w-[min(280px,calc(100vw-2rem))] items-center justify-between gap-3 rounded-[22px] bg-white/90 px-4 py-3 text-left text-[#513746] shadow-[0_16px_36px_rgba(47,31,40,0.2)] transition-transform hover:scale-[1.01] sm:w-[240px]"
        >
            <div className="flex min-w-0 items-center gap-3">
                <span
                    className="h-9 w-9 shrink-0 bg-contain bg-center bg-no-repeat"
                    style={{ backgroundImage: `url('${icon}')` }}
                />
                <span className="min-w-0">
                    <span className="block text-[10px] uppercase tracking-[0.22em] text-[#8a6072]">
                        Hearts Connected
                    </span>
                    <span className="block truncate text-[16px] font-semibold">
                        {title}
                    </span>
                </span>
            </div>
            <span
                className={`text-[18px] font-semibold leading-none text-[#8a6072] transition-transform duration-200 ${open ? "rotate-180" : ""}`}
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-caret-down-fill" viewBox="0 0 16 16">
                    <path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z" />
                </svg>

            </span>
        </button>
    );
}
