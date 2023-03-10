import { access, appendFile, mkdir, readFile, writeFile } from 'fs/promises';
import path from 'path';
import CurrentEnv, { OperatingSystemType } from '../../utils/CurrentEnv';
import Logger from '../../utils/Logger';
import CLIService from '../CLIService';

/**
 * A service which can be used to interact with the file system on the current
 * system.
 */
export default class FileSystemService {
  static async openNugetCache(): Promise<void> {
    if (CurrentEnv.os === OperatingSystemType.Windows) {
      await FileSystemService.openWindowsNugetCache();
    }
    Logger.error('Not implemented for this OS yet.');
  }

  /**
   * Tries to add the provided snippet of text to the path provided. If the file
   * doesn't exist, it creates it. If the folders to the file don't exist, it
   * creates those. If the text already exists in the file, it does nothing.
   *
   * @param folderPath the path to the folder which contains the file that should
   * be updated
   */
  static async findAndInsertText(
    folderPath: string,
    fileName: string,
    textToInsert: string
  ): Promise<void> {
    const filePath = path.join(folderPath, fileName);

    try {
      await access(folderPath);
    } catch (e) {
      console.log(e);
      Logger.info(
        `Directory "${folderPath}" does not exist. Creating it now...`
      );
      await mkdir(folderPath, { recursive: true });
    }

    try {
      await access(filePath);
      const fileContents = await readFile(filePath);
      if (!fileContents.includes(textToInsert)) {
        await appendFile(filePath, `\n${textToInsert}`);
        Logger.info(`Added "${textToInsert}" to "${filePath}"`);
      } else {
        Logger.info(`"${textToInsert}" already exists in "${filePath}"`);
      }
    } catch {
      Logger.info(
        `File at "${filePath}" didn't exist. Creating it now and adding "${textToInsert}" to it.`
      );
      await writeFile(filePath, textToInsert);
    }
  }

  private static async openWindowsNugetCache() {
    await Promise.all([
      CLIService.execCmd(`ii $HOME/localNuget`),
      CLIService.execCmd(`ii $HOME/.nuget/packages`)
    ]);
  }
}
