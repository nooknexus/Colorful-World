
# Packaging for Mozilla Firefox (AMO)

This folder contains a Firefox-ready copy of the Colorful World extension. It uses the same source files as the Chrome build but includes a Firefox-specific `manifest.json` with a `browser_specific_settings.gecko.id`.

**Important:** The packaged extension must include the `images/` icons referenced in the manifest. Please copy the `images/` directory from the repository root into `firefox/images/` before building or zipping the extension.

Recommended steps to prepare and upload to addons.mozilla.org (AMO):

1. Copy icons into the firefox folder:

```bash
# from the repo root
cp -R images firefox/
```

2. Install `web-ext` (recommended) to build and validate the extension locally:

```bash
# install web-ext globally (one-time)
npm install --global web-ext

# build a zip in the `web-ext-artifacts/` directory
web-ext build --source-dir=firefox --overwrite-dest
```

3. Validate locally:

```bash
web-ext lint --source-dir=firefox
```

4. When ready, upload to AMO manually via https://addons.mozilla.org/en-US/developers/addon/submit/upload or use `web-ext sign`/`web-ext upload` if you have AMO API credentials.

Notes & compatibility
- The manifest is Manifest V3. Modern Firefox versions support MV3 features including `scripting` and service workers, but test thoroughly on a recent Firefox build.
- If you run into API differences, consider adding `webextension-polyfill` or small shims. Many `chrome.*` APIs are supported in Firefox but check `chrome.scripting` availability.

If you want, I can:
- Build the zip locally and attach it here (I won't upload to AMO without your credentials).
- Run `web-ext lint` and report any compatibility warnings.
