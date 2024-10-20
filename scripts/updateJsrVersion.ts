import DependencyService from '../src/services/DependencyService.js';

/**
 * Bumps the version of the json files that have one. This is as a separate
 * script and not using main-scripts to avoid a circular dependency.
 */
async function updateJsrFromPackageJson() {
  await DependencyService.updateJsrFromPackageJson();
}

void updateJsrFromPackageJson();
