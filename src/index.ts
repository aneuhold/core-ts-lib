import datesAreOnSameDay from './helperFunctions/dateFunctions';
import sleep from './helperFunctions/sleep';
import ChromeService from './services/applications/ChromeService';
import DockerService from './services/applications/DockerService';
import FileSystemService from './services/applications/FileSystemService/FileSystemService';
import ITermService from './services/applications/ITermService';
import CLIService from './services/CLIService';
import ConfigService from './services/ConfigService/ConfigService';
import DependencyService from './services/DependencyService';
import DOFunctionService, {
  DOFunction
} from './services/DOFunctionService/DOFunctionService';
import {
  DOAuthCheckPasswordInput,
  DOAuthCheckPasswordOutput,
  DOAuthCheckPasswordRawOutput
} from './services/DOFunctionService/functionsInfo/authCheckPassword';
import StringService from './services/StringService';
import CurrentEnv, {
  OperatingSystemType,
  ShellType,
  TerminalType
} from './utils/CurrentEnv';
import Logger from './utils/Logger';

// Export all the functions and classes from this library
export {
  CLIService,
  StringService,
  CurrentEnv,
  ChromeService,
  DockerService,
  FileSystemService,
  sleep,
  OperatingSystemType,
  ShellType,
  Logger,
  TerminalType,
  datesAreOnSameDay,
  ITermService,
  ConfigService,
  DOFunctionService,
  DependencyService
};

// Export TypeScript types where needed
export type {
  DOAuthCheckPasswordRawOutput,
  DOAuthCheckPasswordInput,
  DOAuthCheckPasswordOutput,
  DOFunction
};
