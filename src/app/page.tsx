"use client";

import { useEffect, useRef } from "react";
import { GameProviders, Player, PlayerEventContext, useGame } from "narraleaf-react";

// import your assets
import { story } from "../lib/story";
import { GameDialog } from "@/lib/dialog";
import { GameMenu } from "@/lib/menu";
import { GameHud } from "@/lib/game-hud";
import { restoreStoredProgress, saveStoredProgress } from "@/lib/progress-storage";

function App() {
	const game = useGame();
	const progressReadyRef = useRef(false);

	// initialize the game manually
	useEffect(() => {
		game.configure({
			width: 1280, // set the resolution width
			height: 720, // set the resolution height
			aspectRatio: 16 / 9, // set the aspect ratio

			ratioUpdateInterval: 0, // disable the ratio update interval

			dialog: GameDialog, // override the default dialog
			menu: GameMenu, // override the default menu

			// set the default colors
			defaultTextColor: "#513746",
			defaultMenuChoiceColor: "white",
			defaultNametagColor: "#2987a1",
		});
		game.preference.setPreference("cps", 30); // set the dialog characters per second
	}, [game]);

	useEffect(() => {
		const liveGame = game.getLiveGame();
		let detach: VoidFunction | undefined;

		const syncProgress = () => {
			if (!progressReadyRef.current) {
				return;
			}

			saveStoredProgress(liveGame);
		};

		const attach = () => {
			const gameState = liveGame.getGameState();

			if (!gameState) {
				return;
			}

			const tokens = [
				liveGame.onCharacterPrompt(syncProgress),
				liveGame.onMenuChoose(syncProgress),
				gameState.events.on("event:state.onRender", syncProgress),
				gameState.events.on("event:state.player.requestFlush", syncProgress),
			];

			detach = () => {
				tokens.forEach((token) => token.cancel());
			};
		};

		attach();

		const fallbackInterval = window.setInterval(() => {
			if (!detach && liveGame.getGameState()) {
				attach();
			}
		}, 700);

		return () => {
			detach?.();
			window.clearInterval(fallbackInterval);
		};
	}, [game]);

	// handle the player ready event
	function handleOnReady({ liveGame }: PlayerEventContext) {
		liveGame.newGame();
		restoreStoredProgress(liveGame);
		progressReadyRef.current = true;
		saveStoredProgress(liveGame);
	}

	return (
		<div className="relative h-screen w-screen overflow-hidden">
			<Player
				story={story}
				width="100vw"
				height="100vh"
				onReady={handleOnReady}
			/>
			<GameHud />
		</div>
	);
}

export default function Page() {
	return (
		// wrap the app with the GameProviders component
		<GameProviders>
			<App />
		</GameProviders>
	);
}
