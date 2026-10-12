# GitHub Pages deployment

The site publishes to **https://radicazz.github.io/shoebox/** when a `v*` tag is pushed. Pull requests and pushes to `main` run CI only. There is no manual workflow trigger.

## Repository setup

In repository **Settings → Pages → Build and deployment**, select **GitHub Actions** as the source. The deployment job uses the `github-pages` environment; its protection rules must allow the intended release tags.

Astro is configured with `site: 'https://radicazz.github.io'`, `base: '/shoebox'`, and static output. If the repository name, hosting domain, or custom domain changes, update the configuration and check public asset URLs and canonical metadata together.

## Release workflow

1. Prepare the intended version in `package.json` as a focused commit, run `./scripts/ci-test`, and merge the reviewed changes into `main` with CI passing.
2. Update a clean local `main`, choose an unused `v`-prefixed version tag, and push that tag. For example, when releasing version **0.9.1**:

   ```bash
   git switch main
   git pull --ff-only
   git fetch --tags
   git tag -a v0.9.1 -m "Release v0.9.1"
   git push origin v0.9.1
   ```

3. Watch **Actions → Deploy to GitHub Pages**. The tagged revision receives a frozen-lockfile installation and the full quality checks. A successful build uploads `dist/`; only then can the deployment job publish it.
4. Open the deployment URL and verify the portrait, project artwork in both themes, navigation, and asset responses under `/shoebox/`.

The workflow matches `v*`; it does not enforce semantic versions, package-version equality, or main-branch ancestry. Release maintainers must select the intended merged revision and version. Deployment runs are serialized, and an active deployment is not canceled by a newer tag.

To restore an earlier site, select the known-good revision and follow the same release process using a new tag. Do not move an existing release tag.

## Local production preview

```bash
pnpm check
pnpm preview
```

Open **http://localhost:4321/shoebox/**. Preview serves the generated build, so rebuild after source changes. Runtime scripts use the pinned Node version; pnpm helpers also check the exact package-manager version.

## Workflow maintenance

Both CI and deployment builds use `scripts/ci-test`, which installs once and delegates to `pnpm check`. Builds have read-only repository access; Pages write and OIDC permissions are confined to the deployment job. Action references use verified commit SHAs with version comments, and monthly Dependabot checks cover packages and GitHub Actions.

Validate workflow edits with `actionlint`, inspect permission/trigger changes, and run the shared quality checks before merging. CI cancels superseded runs for the same pull request or branch. Build jobs time out after 20 minutes; deployment jobs after 15 minutes.

## Troubleshooting

| Symptom | Check |
| --- | --- |
| Merge did not publish | Publishing requires a pushed `v*` tag |
| Deployment blocked | Check Pages source and `github-pages` environment rules for tags |
| Missing assets | Check Astro site/base configuration, then run `pnpm check:output` after rebuilding |
| Install or build failed | Inspect Actions logs; reproduce locally with `./scripts/ci-test` |
| Tool-version error | Run `nvm install`, `nvm use`, and `corepack enable pnpm` in the checkout |
| Output exceeds budget | Review generated images and public assets; remove unused assets or optimize sources |

Local validation does not establish that repository hosting settings or the deployed site are healthy. Confirm those during the release verification step.
