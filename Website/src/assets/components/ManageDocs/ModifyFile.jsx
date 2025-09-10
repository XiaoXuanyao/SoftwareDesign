import * as React from "react";
import * as Mui from "@mui/material";
import * as MuiIcons from "@mui/icons-material";
import {
    renameOrMoveDoc,
    deleteDocs
} from "../../api/Knowledge";

function MModifyFile(props) {
    const selectedFile = props.selectedFile;
    const buttonStyle = props.buttonStyle;
    const open = props.open;
    const setOpen = props.setOpen;
    const setDirty = props.setDirty;

    const [newDocName, setNewDocName] = React.useState("");
    const [newPath, setNewPath] = React.useState("");
    const [optStatus, setOptStatus] = React.useState("");
    const [optMessage, setOptMessage] = React.useState("");
    const [onProcess, setOnProcess] = React.useState(false);

    React.useEffect(() => {
        if (open && selectedFile) {
            setNewDocName(selectedFile.docname || "");
            const p = selectedFile.path || "";
            const normalized = p.startsWith("/") ? p : (p.length ? "/" + p : "/");
            setNewPath(normalized);
        }
    }, [open, selectedFile]);

    const alertStyle = {
        mb: 2,
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    }

    const startRenameOrMoveDoc = () => {
        setOnProcess(true);
        renameOrMoveDoc(
            {
                userid: sessionStorage.getItem("userdata.userid"),
                docid: selectedFile.docid,
                newDocName,
                newPath
            },
            (res) => {
                if (res.ok) {
                    setOptStatus("success");
                    setOptMessage("文件重命名或移动成功");
                    setTimeout(() => {
                        setDirty(true);
                        setOpen(false);
                        setOnProcess(false);
                    }, 600);
                } else {
                    setOptStatus("error");
                    setOptMessage(res.message[0] || "文件重命名或移动失败");
                    setOnProcess(false);
                }
            }
        );
    }

    const startDeleteDoc = () => {
        setOnProcess(true);
        deleteDocs(
            {
                userid: sessionStorage.getItem("userdata.userid"),
                docids: [selectedFile.docid]
            },
            (res) => {
                if (res.ok) {
                    setOptStatus("success");
                    setOptMessage("文件删除成功");
                    setTimeout(() => {
                        setDirty(true);
                        setOpen(false);
                        setOnProcess(false);
                    }, 600);
                } else {
                    setOptStatus("error");
                    setOptMessage(res.message[0] || "文件删除失败");
                    setOnProcess(false);
                }
            }
        );
    }

    return (<>
        {selectedFile && (
            <Mui.Dialog
                open={open}
                onClose={() => setOpen(false)}
                fullWidth
                slotProps={{
                    paper: {
                        sx: {
                            width: { xs: "95%", sm: "70%", md: "50%"},
                            maxWidth: 2000
                        }
                    }
                }}
            >
                <Mui.Box sx={{
                    width: "99%",
                    display: "flex",
                    flexWrap: "wrap",
                    alignItems: "center",
                    justifyContent: "center",
                    p: 4
                }}>
                    <Mui.Box>
                        <Mui.Typography variant="body2" sx={{ m: 1, fontWeight: 600 }}>
                            原文件: {selectedFile.docname}
                        </Mui.Typography>
                        <Mui.Typography variant="body2" sx={{ m: 1, fontWeight: 600 }}>
                            原路径: {(selectedFile.path.length === 0 || selectedFile.path[0] !== "/") ? "/" + selectedFile.path : selectedFile.path}
                        </Mui.Typography>
                    </Mui.Box>
                    <Mui.TextField
                        size="small"
                        label="文件名"
                        fullWidth
                        value={newDocName}
                        onChange={(e) => setNewDocName(e.target.value)}
                        placeholder="请输入新文件名，如 my-docs"
                        sx={{ m: 1 }}
                    />
                    <Mui.TextField
                        size="small"
                        label="路径"
                        fullWidth
                        value={newPath}
                        onChange={(e) => setNewPath(e.target.value)}
                        placeholder="请输入新文件路径，如 /docs/manual/"
                        sx={{ m: 1 }}
                    />
                    <Mui.Box sx={{ width: "100%" }}>
                        {optStatus === "loading" && (
                            <Mui.Alert severity="info" sx={alertStyle}>{optMessage}</Mui.Alert>
                        )}
                        {optStatus === "error" && (
                            <Mui.Alert severity="error" sx={alertStyle}>{optMessage}</Mui.Alert>
                        )}
                        {optStatus === "success" && (
                            <Mui.Alert severity="success" sx={alertStyle}>{optMessage}</Mui.Alert>
                        )}
                    </Mui.Box>
                    <Mui.Button
                        variant="contained"
                        sx={{ ...buttonStyle, m: 1 }}
                        onClick={startRenameOrMoveDoc}
                        disabled={onProcess}
                    >
                        重命名/移动
                    </Mui.Button>
                    <Mui.Button
                        variant="contained"
                        color="error"
                        sx={{ ...buttonStyle, m: 1 }}
                        onClick={startDeleteDoc}
                        disabled={onProcess}
                    >
                        删除
                    </Mui.Button>
                    <Mui.Button
                        variant="outlined"
                        sx={{ ...buttonStyle, m: 1 }}
                        onClick={() => setOpen(false)}
                        disabled={onProcess}
                    >
                        取消
                    </Mui.Button>
                </Mui.Box>
            </Mui.Dialog>
        )}
    </>);
}

export default MModifyFile;