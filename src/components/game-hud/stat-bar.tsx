type StatBarProps = {
    label: string;
    value: number;
    tone?: "pink" | "blue";
};

function percentage(value: number) {
    return `${Math.max(0, Math.min(100, value))}%`;
}

export function StatBar({ label, value, tone = "pink" }: StatBarProps) {
    return (
        <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.18em] text-[#6b4050]">
                <span>{label}</span>
                <span>{value}</span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-white/75 shadow-[inset_0_1px_4px_rgba(54,31,44,0.25)]">
                <div
                    className="h-full rounded-full transition-[width] duration-500"
                    style={{
                        width: percentage(value),
                        background: tone === "blue"
                            ? "linear-gradient(90deg, #4d86b8 0%, #8cc7e8 100%)"
                            : "linear-gradient(90deg, #e86b97 0%, #f2a4bb 100%)",
                    }}
                />
            </div>
        </div>
    );
}
