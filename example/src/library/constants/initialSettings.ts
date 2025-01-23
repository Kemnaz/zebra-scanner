// initialSettings.ts
import { URLPATH } from './URL';
export type SettingsType = {
  isIntentEnabled: boolean;
  intentPrefix: string;
  isKeystrokeEnterEnabled: boolean;
  keystrokePrefix: string;
  urlPath: string;
};

export const INITIAL_SETTINGS: SettingsType = {
  isIntentEnabled: true,
  intentPrefix: '',
  isKeystrokeEnterEnabled: false,
  keystrokePrefix: '',
  urlPath: URLPATH,
};
