import React from 'react';
import { Dialog, Nametag, Texts, useDialog } from "narraleaf-react";
import clsx from 'clsx';

function SentenceContext() {
    const { done } = useDialog();

    return (
        <>
            <Texts className="flex max-w-max items-center text-[20px] font-medium leading-[1.75] tracking-[0.01em] md:text-[22px]" />
            {/* Add inverted triangle and underline */}
            <div className="flex flex-col items-center">
                {/* Inverted triangle */}
                <div className={clsx(
                    "h-0 w-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[10px] border-t-[#6b4050]",
                    done ? 'opacity-100' : 'opacity-0'
                )} />
                {/* Underline */}
                <div className="mt-[2px] h-[2px] w-[12px] bg-[#6b4050]" />
            </div>
        </>
    );
}

export function GameDialog() {
    const { isNarrator } = useDialog();

    return (
        <Dialog
            className={"absolute bottom-4 left-1/2 h-[245px] w-[92%] max-w-[1240px] -translate-x-1/2 px-8 pb-8 pt-10 md:px-14 backdrop-blur-[2px]"}
            style={{
                backgroundImage: "url('/asset/Dialogue/DialogueContainer.png')",
                backgroundSize: '100% 100%',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
            }}
        >
            <div className={clsx("absolute left-10 top-0 drop-shadow-[0_5px_5px_rgba(0,0,0,0.2)]", {
                "hidden": isNarrator
            })}>
                <Nametag
                    className={"flex min-h-[54px] min-w-[220px] items-center justify-center px-6 py-2 text-center text-[18px] font-semibold tracking-[0.08em] text-[#6b4050]"}
                    style={{
                        backgroundImage: "url('/ui/game-dialog-nametag.png')",
                        backgroundSize: '100% 100%',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat'
                    }}
                />
            </div>
            <div className="flex h-full items-center gap-[8px] text-[#442634]    [text-shadow:0_1px_0_rgba(255,255,255,0.35)]">
                <SentenceContext />
            </div>
        </Dialog>
    )
}
