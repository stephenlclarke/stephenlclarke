import { readFileSync, writeFileSync } from "node:fs";

const expectedRepositoryCount = 6;
const startMarker = "<!-- recent-repositories:start -->";
const endMarker = "<!-- recent-repositories:end -->";
const [defaultOwner, defaultRepository] = (process.env.GITHUB_REPOSITORY ?? "stephenlclarke/stephenlclarke").split("/");
const owner = process.env.PROFILE_OWNER ?? defaultOwner;
const profileRepository = process.env.PROFILE_REPOSITORY ?? defaultRepository;
const repositories = JSON.parse(process.env.RECENT_REPOSITORIES ?? "[]");

if (!Array.isArray(repositories) || repositories.length !== expectedRepositoryCount || new Set(repositories).size !== expectedRepositoryCount) {
  throw new Error(`Expected ${expectedRepositoryCount} unique repositories.`);
}

function repositoryCard(repository, index) {
  const cardNumber = String(index + 1).padStart(2, "0");
  const repositoryUrl = `https://github.com/${owner}/${encodeURIComponent(repository)}`;
  const cardUrl = `https://github.com/${owner}/${profileRepository}/raw/refs/heads/main/profile/repository-cards/${cardNumber}.svg`;

  return [
    '    <td width="50%">',
    `      <a href="${repositoryUrl}"><img width="100%" src="${cardUrl}" alt="${repository} repository card"/></a>`,
    "    </td>",
  ].join("\n");
}

const rows = [];

for (let index = 0; index < repositories.length; index += 2) {
  rows.push(["  <tr>", repositoryCard(repositories[index], index), repositoryCard(repositories[index + 1], index + 1), "  </tr>"].join("\n"));
}

const cardGrid = [startMarker, "<table>", ...rows, "</table>", endMarker].join("\n");
const readme = readFileSync("README.md", "utf8");
const startIndex = readme.indexOf(startMarker);
const endIndex = readme.indexOf(endMarker);

if (startIndex === -1 || endIndex === -1 || endIndex < startIndex) {
  throw new Error("Recent repository card markers are missing or out of order.");
}

const updatedReadme = `${readme.slice(0, startIndex)}${cardGrid}${readme.slice(endIndex + endMarker.length)}`;

writeFileSync("README.md", updatedReadme);
