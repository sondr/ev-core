# Release Guide for @ev-core

This guide covers the complete release process for the ev-core monorepo, including version bumping, publishing to npm, and git synchronization.

## Prerequisites

- Ensure you have write access to the npm registry for all `@ev-core/*` packages
- Verify you're logged into npm: `npm whoami`
- Ensure you have push access to the git repository
- All changes should be committed and pushed to the main branch

## Release Process

### 1. Pre-Release Checks

```bash
# Ensure you're on the main branch
git checkout main
git pull origin main

# Clean and rebuild all packages
pnpm run rebuild

# Verify all packages build successfully
pnpm run build
```

### 2. Create Changeset (if not already done)

If you haven't already created changesets for your changes:

```bash
# Generate changeset files for packages that have changed
npx changeset

# Follow the prompts to:
# - Select which packages have changed
# - Choose the type of change (patch/minor/major)
# - Write a summary of changes
```

### 3. Version Bump and Release

```bash
# Apply all pending changesets and update package versions
npx changeset version

# This will:
# - Update package.json versions based on changesets
# - Update CHANGELOG.md files
# - Remove consumed changeset files

# Review the changes
git diff

# Commit the version changes
git add .
git commit -m "Version packages"
```

### 4. Build and Publish

```bash
# Clean and rebuild with new versions
pnpm run rebuild

# Publish all changed packages to npm
npx changeset publish

# This will:
# - Build all packages
# - Publish to npm registry
# - Create git tags for each released package
```

### 5. Sync with Git

```bash
# Push the version commit and tags to remote
git push origin main --follow-tags

# Or push separately:
# git push origin main
# git push --tags
```

### 6. Post-Release

```bash
# Run the custom release script if needed
pnpm run release

# Verify packages are published
npm view @ev-core/core versions --json
```

## Alternative: Using the Release Script

The monorepo includes a custom release script:

```bash
# Run the automated release process
pnpm run release
```

This script (`scripts/release.js`) may handle some of the above steps automatically.

## Manual Version Bumping (if needed)

If you need to manually bump the root package version:

```bash
# Update the root package.json version
npm version patch  # or minor/major
git push origin main --follow-tags
```

## Troubleshooting

### Failed npm Publish
- Check if you're logged in: `npm whoami`
- Verify package versions aren't already published: `npm view @ev-core/core versions`
- Check npm registry permissions

### Git Tag Conflicts
- List existing tags: `git tag -l`
- Delete problematic local tags: `git tag -d <tag-name>`
- Force push tags if needed: `git push origin --tags --force`

### Build Failures
- Clean all packages: `pnpm run clean`
- Remove node_modules: `rm -rf node_modules packages/*/node_modules`
- Reinstall dependencies: `pnpm install`
- Rebuild: `pnpm run build`

## Release Checklist

- [ ] All changes committed and pushed to main
- [ ] Changesets created for all changes
- [ ] Pre-release checks passed
- [ ] Version bump applied (`changeset version`)
- [ ] Packages built successfully
- [ ] Packages published to npm (`changeset publish`)
- [ ] Git tags pushed to remote
- [ ] Release notes updated (if applicable)
- [ ] Dependencies updated in consuming applications

## Emergency Rollback

If you need to rollback a release:

```bash
# Unpublish from npm (within 24 hours)
npm unpublish @ev-core/core@<version>

# Revert git commits
git revert <commit-hash>
git push origin main

# Delete tags
git tag -d <tag-name>
git push origin :refs/tags/<tag-name>
```

**Note**: npm unpublish is only available for 24 hours after publishing. After that, you'll need to publish a new patch version.