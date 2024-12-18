// initialSettings.ts
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
  urlPath: 'http://192.168.0.18:8080/rfidentity',
};
