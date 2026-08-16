# MODIFICATIONS

This project is a **fork of [GenOffice](https://github.com/genspark-ai/genoffice)**.
The upstream commit history is retained in this repository, and the upstream
`LICENSE` and `NOTICE` are preserved.

## License and attributions

- The open-source core is licensed under the **Apache License 2.0** (see
  [`LICENSE`](LICENSE)), including all modifications made in this fork.
- The upstream [`NOTICE`](NOTICE) is preserved and must be kept when
  redistributing.
- `npm run notices` generates the bundled third-party license summary
  (`tools/gen-third-party-notices.mjs`) from a source checkout.
- The `ee/` directory is reserved for future enterprise modules and is covered
  by its own license ([`ee/LICENSE`](ee/LICENSE)).
- The GenOffice and Genspark names and logos are trademarks of Mainfunc, Inc.
  The Apache-2.0 license does not grant permission to use them (see section 6);
  this project uses its own branding (ReLoop Office).

## Material changes

This section records the material changes made on top of upstream GenOffice.

### AI provider settings (multi-provider AI backend) — 2026-08-16

- Added `packages/ui/src/AiProviderSettings.tsx`, a shared settings modal to
  configure the active AI provider: API key, base URL, and model.
- Extended the AI backend (`packages/ai-provider`) to support multiple providers
  alongside Genspark: Anthropic Claude, Google Gemini, DeepSeek, OpenAI, and a
  generic **Custom** OpenAI-compatible endpoint (base URL + API key + free-text
  model name).
- Changed the default provider from a required Genspark sign-in to the local
  **Custom** OpenAI-compatible endpoint (keyed by the user's API key), so AI
  features can be used with the user's own API key or provider.
- Wired the provider-settings panel and multi-provider config across the docs,
  sheets, slides, PDF, and markdown apps (renderer `Ai*Panel.*` components, IPC
  handlers in each preload, and i18n strings).

---

Keep this file up to date: add a dated entry for each new material change made
in this fork.
