import * as React from "react";
import * as Mui from "@mui/material";
import * as MuiIcons from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

function SearchBox(props) {
      const {
        tfsx = { display: { xs: "none", sm: "flex" }, flex: 1 },
        suggestions = ["算法","数据结构"],
        multiline = false,
        minRows = 3,
        maxRows = 6,
        onSearch,
        sx,
        ...rest
    } = props;
    const [inputValue, setInputValue] = React.useState("");

    const [value, setValue] = React.useState(null);

    const navigate = useNavigate();
    const Commit = React.useCallback((text) => {
        if (!text) return;
        if (onSearch) {
            onSearch(text);
        }
        else {
            console.log(`Search: ${text}`);
            navigate(`/assistant?query=${text}`);
        }
    }, [onSearch, navigate]);

    return (
        <Mui.Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                padding: 1,
                bgcolor: "primary.main",
                ...sx
            }}
            {...rest}
        >
            <Mui.Button
                variant="text"
                size="medium"
                sx={{ minWidth: 0, padding: 0 }}
                href="/assistant?query=null"
            >
                <MuiIcons.Search sx={{ color: "icon.main" }} />
            </Mui.Button>
            <Mui.Autocomplete
                freeSolo
                options={suggestions}
                value={value}
                onChange={(event, newValue) => {
                    setValue(newValue);
                }}
                inputValue={inputValue}
                onInputChange={(event, newInputValue) => {
                    setInputValue(newInputValue);
                }}
                renderInput={(params) => (
                    <Mui.TextField
                        {...params}
                        variant="standard"
                        placeholder="搜索或提问"
                        multiline={multiline}
                        minRows={multiline ? minRows : undefined}
                        maxRows={multiline ? maxRows : undefined}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                e.preventDefault();
                                Commit(inputValue);
                            }
                        }}
                        sx={{ boxShadow: 2 }}
                    />
                )}
                sx={{ ...tfsx }}
            />
            <Mui.Button
                sx={{
                    color: "icon.main",
                    ":hover": {
                        color: "icon.hover"
                    },
                    padding: 0,
                    minWidth: 0
                }}
                onClick={() => Commit(inputValue)}
            >
                <MuiIcons.Send />
            </Mui.Button>
        </Mui.Box>
    );
}

export default SearchBox;
