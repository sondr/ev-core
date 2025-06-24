// scripts/release.js
const { execSync } = require('child_process');

// Helper function to run a command and print a message.
// The `stdio: 'inherit'` part is crucial to show the command's output in your terminal.
function run(command) {
  console.log(`\n\x1b[36m🚀 Running: ${command}\x1b[0m\n`); // Cyan color for visibility
  execSync(command, { stdio: 'inherit' });
}

try {
  run('pnpm run clean');

  // 1. Build all packages
  run('pnpm build');

  // 2. Create release version
  run('pnpm changeset version');

  // 3. Commit versioning changes
  // Note: Using double quotes inside the command for cross-platform compatibility.
  run('git add .');
  run('git commit -m "chore(release): version packages"');

  // 4. Publish to npm
  // This will prompt for OTP if you have 2FA enabled.
  run('pnpm changeset publish');

  // 5. Tag the release
  run('pnpm changeset tag');

  // 6. Push commit and tags to remote
  run('git push --follow-tags');

  console.log(`\n\x1b[32m✅ Release complete!\x1b[0m`); // Green color for success

} catch (error) {
  // If any command fails, the script will exit here.
  console.error(`\n\x1b[31m❌ Release failed. Please check the error output above.\x1b[0m`);
  process.exit(1); // Exit with a non-zero code to indicate failure
}