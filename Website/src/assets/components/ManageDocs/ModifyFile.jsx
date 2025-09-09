import * as React from "react";
import * as Mui from "@mui/material";
import * as MuiIcons from "@mui/icons-material";

function MModifyFile(props) {
    const selectedFile = props.selectedFile;
    const setSelectedFile = props.setSelectedFile;
    const buttonStyle = props.buttonStyle;
    const open = props.open;
    const setOpen = props.setOpen;

    const [newDocName, setNewDocName] = React.useState("");
    const [newPath, setNewPath] = React.useState("");

    React.useEffect(() => {
    if (open && selectedFile) {
        setNewDocName(selectedFile.docname || "");
        const p = selectedFile.path || "";
        const normalized = p.startsWith("/") ? p : (p.length ? "/" + p : "/");
        setNewPath(normalized);
    }
    }, [open, selectedFile]);

    return (<>
        {selectedFile && (
            <Mui.Dialog
                open={open}
                onClose={() => setOpen(false)}
                fullWidth
                slotProps={{
                    paper: {
                        sx: {
                            width: { xs: "92%", sm: "60%", md: "40%"}
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
                    <Mui.Button variant="contained" sx={{ ...buttonStyle, m: 1 }}>
                        重命名/移动
                    </Mui.Button>
                    <Mui.Button variant="contained" color="error" sx={{ ...buttonStyle, m: 1 }}>
                        删除
                    </Mui.Button>
                    <Mui.Button
                        variant="outlined"
                        sx={{ ...buttonStyle, m: 1 }}
                        onClick={() => setOpen(false)}
                    >
                        取消
                    </Mui.Button>
                </Mui.Box>
            </Mui.Dialog>
        )}
    </>);
}

export default MModifyFile;