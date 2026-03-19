import type { ReactNode } from "react";

type QuickButtonProps = {
    children: ReactNode;
    onClick: () => void;
    disabled?: boolean;
    active?: boolean;
};

export function QuickButton({
    children,
    onClick,
    disabled,
    active = false,
}: QuickButtonProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            className="heart-ui-button min-w-[110px] disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer py-3"
            data-active={active ? "true" : "false"}
        >
            {children}
        </button>
    );
}
