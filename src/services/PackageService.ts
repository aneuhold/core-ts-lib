import { exec } from 'child_process';
import { access, readFile, writeFile } from 'fs/promises';
import path from 'path';
import { promisify } from 'util';
import ErrorUtils from '../utils/ErrorUtils.js';
import Logger from '../utils/Logger.js';
import { JsonWithVersionProperty, PackageJson } from './DependencyService.js';
import FileSystemService from './FileSystemService/FileSystemService.js';

const execAsync = promisify(exec);

/**
 * A service which can be used to assist in publishing or validating packages
 * for the current project.
 */
export default class PackageService {
  /**
   * Validates the current project for publishing to JSR. This will check if the
   * project has any pending changes first, then update the version of the
   * jsr.json to match the package.json file, then run the
   * `jsr publish --dry-run` command, and finally cleanup the changes made.
   */
  static async validateJsrPublish(): Promise<void> {
    if (await FileSystemService.hasPendingChanges()) {
      Logger.error('Please commit or stash your changes before publishing.');
      process.exit(1);
    }
    await PackageService.updateJsrFromPackageJson();
    await PackageService.publishJsrDryRun();
  }

  static async updateJsrFromPackageJson(): Promise<void> {
    const rootDir = process.cwd();
    const packageJsonPath = path.join(rootDir, 'package.json');
    const jsrJsonPath = path.join(rootDir, 'jsr.json');

    try {
      await access(packageJsonPath);
    } catch {
      Logger.error('No package.json file found in the current directory.');
      return;
    }

    try {
      await access(jsrJsonPath);
    } catch {
      Logger.error('No jsr.json file found in the current directory.');
      return;
    }

    try {
      const packageJsonData = JSON.parse(
        await readFile(packageJsonPath, 'utf-8')
      ) as PackageJson;
      const jsrJsonData = JSON.parse(
        await readFile(jsrJsonPath, 'utf-8')
      ) as JsonWithVersionProperty;
      jsrJsonData.version = packageJsonData.version;
      await writeFile(jsrJsonPath, JSON.stringify(jsrJsonData, null, 2));
      Logger.info(
        'Updated jsr.json from package.json to version ' + jsrJsonData.version
      );
    } catch (error) {
      const errorString = ErrorUtils.getErrorString(error);
      Logger.error(
        `Failed to update jsr.json from package.json: ${errorString}`
      );
    }
  }

  private static async publishJsrDryRun(): Promise<void> {
    Logger.info('Running `jsr publish --dry-run`');
    try {
      const { stdout, stderr } = await execAsync(
        'jsr publish --dry-run --allow-dirty'
      );
      if (stderr) {
        Logger.error(stderr);
      }
      Logger.info(stdout);
    } catch (error) {
      Logger.error(
        `Failed to run 'jsr publish --dry-run': ${ErrorUtils.getErrorString(error)}`
      );
    }
  }

  private static async revertGitChanges(): Promise<void> {
    Logger.info('Reverting changes made to jsr.json');
    try {
      await execAsync('git checkout jsr.json');
    } catch (error) {
      Logger.error(
        `Failed to revert changes made to jsr.json: ${ErrorUtils.getErrorString(error)}`
      );
    }
  }
}
