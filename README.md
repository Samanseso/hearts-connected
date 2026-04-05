# NarraLeaf-React Skeleton

This is a skeleton project for NarraLeaf-React App.

## Features

- Next.js
- Tailwind CSS
- TypeScript

## Quick Start

```bash
npm run dev
```

## Line Audio

Generate Gemini TTS audio one line at a time from [docs/voice-prompts.csv](./docs/voice-prompts.csv):

```bash
npm run generate:line-audio -- --scene social-media-expectations
```

Full usage notes are in [docs/gemini-line-audio.md](./docs/gemini-line-audio.md).

## Puter Audio Tool

If you want browser-based generation without a Gemini API token, use the Puter tool at `/tools/puter-line-audio`.

Notes are in [docs/puter-line-audio.md](./docs/puter-line-audio.md).

## About

For more information, please refer to
- [NarraLeaf Project](https://github.com/NarraLeaf)
- [NarraLeaf-React](https://github.com/narraleaf/narraleaf-react)
- [NarraLeaf-React Documentation](https://react.narraleaf.com)
