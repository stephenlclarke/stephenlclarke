import assert from "node:assert/strict";
import test from "node:test";

import { parseUniqueVisitors, renderBadge } from "./update-unique-visitors-badge.mjs";

test("renders a readable, accessible badge for the unique visitor count", () => {
  const badge = renderBadge(1234);

  assert.match(badge, /UNIQUE VISITORS \(14D\)/);
  assert.match(badge, />1,234<\/text>/);
  assert.match(badge, /aria-label="Unique Profile README visitors in the last 14 days: 1,234"/);
});

test("rejects invalid unique visitor counts", () => {
  for (const value of ["-1", "1.5", "many", ""]) {
    assert.throws(() => parseUniqueVisitors(value), /non-negative integer/);
  }
});
