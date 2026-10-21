---
name: android-device
description: Drive an Android emulator or device with adb - install, launch, screenshot, read the screen, tap, type, read logs. Use whenever checking an Android app's real behavior, reproducing a UI bug, or capturing screenshots.
---

# Android device

Use a harness emulator tool if one exists; otherwise adb. Keep output small: filter logs, never dump them whole.

## Device
- Tools not on PATH: `export PATH="${ANDROID_HOME:-${ANDROID_SDK_ROOT:-$HOME/Library/Android/sdk}}/platform-tools:${ANDROID_HOME:-${ANDROID_SDK_ROOT:-$HOME/Library/Android/sdk}}/emulator:$PATH"` (Linux SDK: `$HOME/Android/Sdk`).
- List: `adb devices -l`. None: `emulator -list-avds`, then `emulator -avd <name> -no-snapshot-load >/dev/null 2>&1 &` (add `-no-window` when nobody watches). Stop it when done: `adb emu kill`.
- Wait for boot: `adb wait-for-device shell 'while [ "$(getprop sys.boot_completed)" != 1 ]; do sleep 1; done'`.
- Several devices: add `-s <serial>` to every command.

## App
- Build and install: `./gradlew installDebug` (or `adb install -r <apk>`).
- Launch: `adb shell monkey -p <package> -c android.intent.category.LAUNCHER 1`.
- Deep link: `adb shell am start -a android.intent.action.VIEW -d '<uri>' <package>`.
- Reset: `adb shell pm clear <package>`. Stop: `adb shell am force-stop <package>`.

## See
- Screenshot: `adb exec-out screencap -p > <file>.png`. Look at it before claiming a UI works.
- Screen as text: `adb exec-out uiautomator dump /dev/tty` → node text, resource-id, and `bounds` for taps.
- Record: `adb shell screenrecord --time-limit 15 /sdcard/r.mp4 && adb pull /sdcard/r.mp4`.

## Act
- Tap the center of a node's bounds: `adb shell input tap <x> <y>`.
- Type: `adb shell input text '<text>'` (spaces as `%s`). Keys: `adb shell input keyevent KEYCODE_BACK|KEYCODE_ENTER`.
- Swipe: `adb shell input swipe <x1> <y1> <x2> <y2> 300`.
- Dark mode: `adb shell cmd uimode night yes|no`. Font scale: `adb shell settings put system font_scale 1.3`.

## Logs
- Clear before a repro: `adb logcat -c`.
- App only: `adb logcat -d --pid=$(adb shell pidof -s <package>) | tail -n 80`.
- Crashes: `adb logcat -d -b crash | tail -n 60`.

## Tests
- Unit: `./gradlew testDebugUnitTest --tests '<Class>'`.
- Instrumented and Compose UI: `./gradlew connectedDebugAndroidTest -Pandroid.testInstrumentationRunnerArguments.class=<Class>`.
