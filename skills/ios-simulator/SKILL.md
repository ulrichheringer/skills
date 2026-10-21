---
name: ios-simulator
description: Drive the iOS Simulator - boot, build, install, launch, screenshot, deep links, logs, tests. Use whenever checking an iOS app's real behavior, reproducing a UI bug, or capturing screenshots.
---

# iOS Simulator

Use a harness simulator tool if one exists (it can also tap and type); otherwise `xcrun simctl`, which cannot tap. Keep output small: filter logs and build output.

## Device
- List: `xcrun simctl list devices available`.
- Boot: `xcrun simctl boot '<device name>'` (already booted is fine), then `open -a Simulator` when a person should watch.
- Target the booted one with `booted`, or pass a UDID when several run.

## App
- Build: `xcodebuild -scheme <scheme> -destination 'platform=iOS Simulator,name=<device>' -derivedDataPath build build -quiet`.
- Install: `xcrun simctl install booted build/Build/Products/Debug-iphonesimulator/<App>.app`.
- Launch: `xcrun simctl launch --terminate-running-process booted <bundle id>`.
- Deep link: `xcrun simctl openurl booted '<url>'`.
- Reset app data: `xcrun simctl uninstall booted <bundle id>` and reinstall.

## See
- Screenshot: `xcrun simctl io booted screenshot <file>.png`. Look at it before claiming a UI works.
- Record: `xcrun simctl io booted recordVideo <file>.mov`, stop with Ctrl-C.
- Appearance: `xcrun simctl ui booted appearance dark|light`. Text size: `xcrun simctl ui booted content_size extra-large`.
- Permissions: `xcrun simctl privacy booted grant <photos|camera|location> <bundle id>`.
- Push: `xcrun simctl push booted <bundle id> <payload>.json`.

## Logs
- App only: `xcrun simctl spawn booted log stream --level debug --style compact --predicate 'subsystem == "<bundle id>"'`, stopped after the repro.
- Recent: `xcrun simctl spawn booted log show --last 2m --style compact --predicate 'process == "<App>"' | tail -n 80`.

## Tests
- `xcodebuild test -scheme <scheme> -destination 'platform=iOS Simulator,name=<device>' -only-testing:<Target>/<Suite> -quiet`.
