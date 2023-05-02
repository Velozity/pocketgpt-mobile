export type ITheme = {
  mode: "dark" | "light";
  palette: {
    primary: string;
    secondary: string;
    background: string;
    codeHeader: string;
    code: string;
    text: {
      primary: string;
      secondary: string;
      hintColor: string;
      lightHintColor: string;
      hyperlink: string;
    };
  };
};

export const darkTheme: ITheme = {
  mode: "dark",
  palette: {
    primary: "#C38FFF", // Discord blue
    secondary: "#1E1E1E",
    background: "#121212", // darker background
    codeHeader: "#1F2326",
    code: "#101417",
    text: {
      primary: "#FFFFFF",
      secondary: "#D0D1D4",
      hintColor: "#72767D",
      lightHintColor: "#B7B6BB",
      hyperlink: "#3F7BD4",
    },
  },
};

export const lightTheme: ITheme = {
  mode: "light",
  palette: {
    primary: "#487FD2", // Discord blue
    secondary: "#FFFFFF",
    background: "#F2F3F5",
    codeHeader: "#1F2326",
    code: "#101417",
    text: {
      primary: "#1E2124",
      secondary: "#D0D1D4",
      hintColor: "#B9BBBE",
      lightHintColor: "#B7B6BB",
      hyperlink: "#3F7BD4",
    },
  },
};
