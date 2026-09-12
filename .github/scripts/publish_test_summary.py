from __future__ import annotations

import os
import sys
import xml.etree.ElementTree as ET
from pathlib import Path

report = Path("test-results/junit/results.xml")
totals = {"tests": 0, "failures": 0, "errors": 0, "skipped": 0, "time": 0.0}

if report.exists():
    root = ET.parse(report).getroot()
    totals["tests"] = int(root.attrib.get("tests", 0))
    totals["failures"] = int(root.attrib.get("failures", 0))
    totals["errors"] = int(root.attrib.get("errors", 0))
    totals["skipped"] = int(root.attrib.get("skipped", 0))
    totals["time"] = float(root.attrib.get("time", 0.0))

failed = totals["failures"] + totals["errors"]
passed = totals["tests"] - failed - totals["skipped"]
icon = "✅" if report.exists() and failed == 0 else "❌"
headline = (
    f"{icon} {passed} passed, {failed} failed, {totals['skipped']} skipped"
    if report.exists()
    else "❌ Playwright JUnit report was not generated"
)

summary = f"""## Playwright test results

### {headline}

| Total | Passed | Failed | Skipped | Duration |
| ---: | ---: | ---: | ---: | ---: |
| {totals['tests']} | {passed} | {failed} | {totals['skipped']} | {totals['time']:.2f}s |

The HTML report is available in the workflow artifacts.
"""

print(headline)
if path := os.getenv("GITHUB_STEP_SUMMARY"):
    with Path(path).open("a", encoding="utf-8") as output:
        output.write(summary)

if path := os.getenv("GITHUB_OUTPUT"):
    with Path(path).open("a", encoding="utf-8") as output:
        output.write(f"passed={passed}\nfailed={failed}\nskipped={totals['skipped']}\n")

if not report.exists():
    print("::error title=Test report missing::Playwright did not create the JUnit XML report")
    sys.exit(1)

if failed:
    print(f"::error title=Playwright tests failed::{failed} failed, {passed} passed")
else:
    print(f"::notice title=Playwright tests passed::{passed} passed, {totals['skipped']} skipped")
