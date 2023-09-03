export interface IMode {
  mode: 'dark' | 'light';
}

export interface ITheme extends IMode {
  system: boolean;
}
