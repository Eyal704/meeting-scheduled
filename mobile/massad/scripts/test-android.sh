#!/usr/bin/env bash
set -u
# Run from android/. Preserve screenshots even when the instrumented flow fails.
./gradlew :app:connectedDebugAndroidTest -Pandroid.testInstrumentationRunnerArguments.access="$MASSAD_APP_ACCESS"
test_status=$?
mkdir -p ../artifacts
adb pull /sdcard/Android/data/com.meetingscheduled.massad/files/screenshots ../artifacts/screenshots || true
exit "$test_status"
