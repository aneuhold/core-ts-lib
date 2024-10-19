import DependencyService, {
  VersionType
} from '../src/services/DependencyService.js';

/**
 * Bumps the version of the json files that have one. This is as a separate
 * script and not using main-scripts to avoid a circular dependency.
 */
async function bumpVersion(versionType: string) {
  await DependencyService.bumpVersion(versionType as VersionType);
}

void bumpVersion(process.argv[2]);
