import { writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const LABEL_WIDTH = 164;
const BADGE_HEIGHT = 28;

export function parseUniqueVisitors(value) {
  if (!/^(0|[1-9][0-9]*)$/.test(String(value))) {
    throw new Error("Unique visitor count must be a non-negative integer.");
  }

  const uniqueVisitors = Number(value);
  if (!Number.isSafeInteger(uniqueVisitors)) {
    throw new Error("Unique visitor count must be a safe integer.");
  }

  return uniqueVisitors;
}

export function renderBadge(value) {
  const uniqueVisitors = parseUniqueVisitors(value);
  const formattedVisitors = new Intl.NumberFormat("en-GB").format(uniqueVisitors);
  const countWidth = Math.max(40, 18 + formattedVisitors.length * 9);
  const badgeWidth = LABEL_WIDTH + countWidth;
  const labelCenter = LABEL_WIDTH / 2;
  const countCenter = LABEL_WIDTH + countWidth / 2;
  const accessibleLabel = `Unique Profile README visitors in the last 14 days: ${formattedVisitors}`;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${badgeWidth}" height="${BADGE_HEIGHT}" role="img" aria-label="${accessibleLabel}">
  <title>${accessibleLabel}</title>
  <clipPath id="clip"><rect width="${badgeWidth}" height="${BADGE_HEIGHT}" rx="2"/></clipPath>
  <g clip-path="url(#clip)">
    <rect width="${LABEL_WIDTH}" height="${BADGE_HEIGHT}" fill="#513436"/>
    <rect x="${LABEL_WIDTH}" width="${countWidth}" height="${BADGE_HEIGHT}" fill="#B77E87"/>
  </g>
  <g fill="#FFFFFF" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif" font-size="10" font-weight="700" letter-spacing="0.45" text-anchor="middle">
    <text x="${labelCenter}" y="18">UNIQUE VISITORS (14D)</text>
    <text x="${countCenter}" y="18">${formattedVisitors}</text>
  </g>
</svg>
`;
}

function main() {
  const [value, outputPath] = process.argv.slice(2);
  if (outputPath === undefined) {
    throw new Error("Usage: node update-unique-visitors-badge.mjs <unique-visitors> <output-path>");
  }

  writeFileSync(outputPath, renderBadge(value), "utf8");
}

if (process.argv[1] !== undefined && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main();
}
