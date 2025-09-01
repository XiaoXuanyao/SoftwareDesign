import * as React from "react";
import * as Mui from "@mui/material";
import * as MuiIcons from "@mui/icons-material";

function MChatInputBar(props) {
    const sidebarWidths = { xs: "0vw", sm: "30vw", md: "20vw" };
    const minRows = 5;
    const maxRows = 9;

    const [value, setValue] = React.useState("");
    const [openSetting, setOpenSetting] = React.useState(false);

    const handleClear = () => {
        setValue("");
        requestAnimationFrame(() => inputRef.current?.focus());
    }

    const handleKeyDown = (e) => {
    }

    const search = React.useCallback(() => {
        if (!value) return;
        console.log(`Search: ${value}`);
        handleClear();
    }, [value, handleClear]);

    return (
        <Mui.Paper
            elevation={3}
            sx={{
                position: "fixed",
                bottom: "2vh",
                left: 0,
                width: { xs: "100%", sm: "75%", md: "60%" },
                ml: { xs: "0%", sm: "25%", md: "27.5%" },
                borderRadius: 2,
                zIndex: (t) => t.zIndex.appBar - 1,
            }}
        >
            <Mui.TextField
                multiline
                minRows={minRows}
                maxRows={maxRows}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="请输入内容（支持多行，Shift+Enter 换行）"
                variant="standard"
                fullWidth
                sx={{
                    borderRadius: 2,
                    p: 1.5,
                    pb: 7,
                    overflow: "hidden",
                    bgcolor: "background.paper",
                }}
            />
            <MuiIcons.Send
                onClick={search}
                sx={{
                    position: "absolute",
                    bottom: 16,
                    right: 16,
                    cursor: "pointer",
                    color: value ? "primary.main" : "text.disabled",
                    "&:hover": { color: "primary.dark" },
                    zIndex: (t) => t.zIndex.appBar - 2,
                }}
            />
        </Mui.Paper>
    );
}

export default MChatInputBar;