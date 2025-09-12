import * as React from "react";
import * as Mui from "@mui/material";
import * as MuiIcons from "@mui/icons-material";

import { queryKnowledgeSet } from "../../api/Knowledge";

function MChatInputBar(props) {
    const sidebarWidths = { xs: "0vw", sm: "30vw", md: "20vw" };
    const queryMessage = props.queryMessage;
    const loading = props.loading;
    const minRows = 4;
    const maxRows = 8;

    const inputRef = React.useRef(null);
    const [value, setValue] = React.useState("");
    const [openSetting, setOpenSetting] = React.useState(false);
    const [collections, setCollections] = React.useState();
    const [collectionname, setCollectionname] = React.useState("");
    
    React.useEffect(() => {
        queryKnowledgeSet(
            {
                userid: sessionStorage.getItem("userdata.userid") || null
            },
            (result) => {
                if (result.ok) {
                    setCollections(result.collections || []);
                }
                else if (result.message[0] == "用户未登录") {
                    console.log("未登录，无法查询知识库列表");
                }
                else {
                    console.log("查询失败", result.message);
                }
            }
        );
    }, []);

    const handleClear = () => {
        setValue("");
        requestAnimationFrame(() => inputRef.current?.focus());
    }

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            send();
        }
    }

    const handleSelectCollection = (e) => {
        setCollectionname(e.target.value);
    }

    const send = React.useCallback(() => {
        if (!value || loading) return;

        queryMessage(value, collectionname);
        setValue("");

        handleClear();
    }, [value, handleClear]);

    return (
        <Mui.Paper
            elevation={3}
            sx={{
                position: "fixed",
                bottom: "2vh",
                left: 0,
                width: { xs: "100%", sm: "65%", md: "50%" },
                ml: { xs: "0%", sm: "32.5%", md: "32.5%" },
                borderRadius: 2,
                zIndex: (t) => t.zIndex.appBar - 1,
            }}
        >
            <Mui.TextField
                inputRef={inputRef}
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
                    p: 2,
                    pb: 7,
                    overflow: "hidden",
                    bgcolor: "background.paper",
                }}
            />

            {/* 选择知识库下拉框 */}
            <Mui.FormControl
                size="small"
                sx={{
                    position: "absolute",
                    bottom: 10,
                    right: { xs: 56, sm: 72 },
                    minWidth: { xs: 140, sm: 220 },
                    maxWidth: { xs: 180, sm: 280 },
                }}
            >
                <Mui.InputLabel
                    id="select-collection-label"
                    sx={{ fontSize: 14 }}
                >
                    知识库
                </Mui.InputLabel>
                <Mui.Select
                    labelId="select-collection-label"
                    label="知识库"
                    value={collectionname}
                    onChange={handleSelectCollection}
                    displayEmpty
                    sx={{ fontSize: 14 }}
                >
                    {/* 占位项 */}
                    {<Mui.MenuItem value="">不使用知识库</Mui.MenuItem>}
                    {(collections?.length ? collections : (collectionname ? [{ collectionname }] : []))
                        .map((c, i) => {
                            const name = c.collectionname || String(c);
                            return (
                                <Mui.MenuItem key={`${name}-${i}`} value={name}>
                                    {name}
                                </Mui.MenuItem>
                            );
                        })}
                </Mui.Select>
            </Mui.FormControl>

            {/* 发送按钮 */}
            <MuiIcons.Send
                onClick={send}
                disabled={loading || !value}
                sx={{
                    position: "absolute",
                    bottom: 12,
                    right: 14,
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