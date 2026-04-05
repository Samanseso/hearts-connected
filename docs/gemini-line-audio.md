# Gemini Line Audio

Generate one spoken audio file per line from [voice-prompts.csv](./voice-prompts.csv) using Gemini TTS.

## Setup

1. Put `GEMINI_API_KEY=...` in the project `.env` file.
2. Use Node 18 or newer.
3. Run the generator from the project root.

## Commands

Generate every line for every scene as WAV:

```bash
npm run generate:line-audio
```

Generate only one scene:

```bash
npm run generate:line-audio -- --scene social-media-expectations
```

Generate only the first 10 matching lines:

```bash
npm run generate:line-audio -- --scene social-media-expectations --limit 10
```

Regenerate files even if they already exist:

```bash
npm run generate:line-audio -- --overwrite
```

Generate MP3 files instead of WAV:

```bash
npm run generate:line-audio -- --format mp3
```

`--format mp3` requires `ffmpeg` in your system `PATH`. If `ffmpeg` is missing, use the default WAV output.

## Output

Generated files are saved to:

```text
public/asset/audio/lines/<scene-id>/
```

A manifest is also written to:

```text
public/asset/audio/lines/manifest.json
```

Each file name stays aligned with the original row in `voice-prompts.csv`, so it is easy to match audio back to a scene line later.
