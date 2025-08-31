import * as Mui from "@mui/material";
import { createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

const baseTheme = createTheme({
    palette: {
        icon: {
            main: "#e8e8e8ff",
            hover: "#ffffffff"
        },
        primary: {
            main: "#307dcaff",
            light: "#93c0ffff",
        },
        secondary: {
            main: "#bdd0cdff",
            light: "#e4f0f0ff",
        },
        input: {
            before: "#ffffff00",
            hover: "#ffffff00",
            focused: "#ffffff00",
            bg: "#ffffff9f",
            text: "#1f1f1fff",
        },
        background: {
            default: "#c6d7e6ff",
            paper: "#ebf0f6ff",
        },
        text: {
            onpaper: "#1f1f1fff",
            onprimary: "#f1f1f1ff"
        }
    },
});

const theme = createTheme(baseTheme, {

    components: {

        MuiCssBaseline: {
            styleOverrides: {
                body: {
                    backgroundColor: baseTheme.palette.background.default,
                    margin: 0
                }
            }
        },

        MuiInput: {
            styleOverrides: {
                underline: {
                    "&:before": { borderBottomColor: baseTheme.palette.input.before },
                    "&:hover:not(.Mui-disabled):before": { borderBottomColor: baseTheme.palette.input.hover },
                    "&.Mui-focused:after": { borderBottomColor: baseTheme.palette.input.focused },
                },
            },
        },

        MuiInputBase: {
            styleOverrides: {
                root: {
                    backgroundColor: baseTheme.palette.input.bg, // 输入框背景
                    borderRadius: 4, // 圆角
                    paddingLeft: 4,
                    paddingRight: 4,
                },
                input: {
                    color: baseTheme.palette.input.text,
                    "::placeholder": {
                        color: baseTheme.palette.input.text,
                        opacity: 0.5,
                    },
                    WebkitTextFillColor: baseTheme.palette.input.text,
                },
            },
        },

        MuiButton: {
            styleOverrides: {
                root: {
                    '&:hover': { color: 'inherit' },
                    '&:visited': { color: 'inherit' }
                }
            }
        }

    },
});

export default theme;