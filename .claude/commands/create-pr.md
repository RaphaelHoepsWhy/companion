# Create a Github PR

## Overview

Use the tool 'gh' to create a PR on github for the current git branch. If the PR already exists, update the description to match the latest changes.

## Details

Here is some extra information on how the PR should look like

- When you read the current git branch, it most likely has a structure like this: feat/17079414-SEO-optimizations. The number is the teamwork ticket number.

- Read the file docs/pull_request_template.md. Write a PR description that follows this template. Avoid long unformatted text sections, instead rely on lists that are easy to scan for the reader.
  - The "link to test" is the vercel branch-deployment correspondig to the branch. Use the vercel MCP to figure out that URL. Make sure you use the branch URL, not the URL that corresponds to a single commit.
  - For the teamwork ticket url, use https://andwhy.eu.teamwork.com/app/tasks/XXX, where XXX is the teamwork ticket number.
  - The figma URL stays blank
  - In "steps to test" write a simple procedure, an end user could execute to see and validate the changes. Write links using the vercel branch-deployment. Ideally, you should write down a link for every step to test.
    Keep it short, especially if there are no real visible changes. Write down the steps as unordered list, e.g. with bullet points, not with numbers.
  - Leave the checklist as it is
  - Do not add anything else, e.g. no "Made with Cursor" or similar.

- The title of the PR should have this strucutre: "feat(17079414): Seo Optimizations" and is derived from the branch name. (It might also be 'fix' or 'refactor' etc.)

## Writing style

- Keep it concise, clean and easy to read.
- Do not write long text blocks with multiple long sentences.
- Use bullet points.

## Special Info For this Project
