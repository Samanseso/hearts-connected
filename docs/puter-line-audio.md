# Puter Line Audio Tool

Use the browser tool at `/tools/puter-line-audio` to generate voice clips without a Gemini API key.

## What it does

- reads the dialogue rows from `docs/voice-prompts.csv`
- sends one line at a time to `puter.ai.txt2speech()`
- saves files in batches
- waits between batches to reduce rate pressure
- can write straight into `public/asset/audio/lines` if you choose that folder in Chromium-based browsers

## Default pacing

- batch size: `3`
- wait between batches: `60` seconds
- output format: `mp3`

## Recommended flow

1. Run the app with `npm run dev`
2. Open `http://localhost:3000/tools/puter-line-audio`
3. Click `Choose Output Folder`
4. Pick `public/asset/audio/lines`
5. Select the scene you want
6. Start the batch generation

The tool creates one subfolder per scene automatically.
