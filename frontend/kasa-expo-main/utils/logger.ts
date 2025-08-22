
import { logger, consoleTransport, configLoggerType } from 'react-native-logs';

const defaultConfig: configLoggerType = {
  severity: __DEV__ ? 'debug' : 'error',
  transport: [consoleTransport],
  transportOptions: {
    colors: {
      info: 'blueBright',
      warn: 'yellowBright',
      error: 'redBright',
    },
  },
  async: true,
  dateFormat: 'time',
  printLevel: true,
  printDate: true,
  enabled: true,
};

const log = logger.createLogger(defaultConfig);

export default log;