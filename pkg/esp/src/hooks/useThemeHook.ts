export enum ETheme {
  DARK = "dark",
  LIGHT = "light",
}

export const useThemeHook = () => {
  const themeKey = "theme";
  const html = document.querySelector("html");
  const theme = (localStorage.getItem(themeKey) as ETheme) || ETheme.LIGHT;

  const changeTheme = (theme: `${ETheme}`) => {
    if (theme === ETheme.DARK) {
      html.classList.remove(ETheme.LIGHT);
      html.classList.add(ETheme.DARK);
      localStorage.setItem(themeKey, ETheme.DARK);
    } else {
      html.classList.remove(ETheme.DARK);
      html.classList.add(ETheme.LIGHT);
      localStorage.setItem(themeKey, ETheme.LIGHT);
    }
  };

  changeTheme(theme);

  return { changeTheme, theme };
};
