import * as React from "react";
import * as Mui from "@mui/material";
import * as MuiIcons from "@mui/icons-material";

function MModifyFile(props) {
    const selectedFile = props.selectedFile;
    const setSelectedFile = props.setSelectedFile;
    const buttonStyle = props.buttonStyle;

    return (<>
        {selectedFile && (
            <Mui.Box 
                sx={{
                    p: 2,
                    borderRadius: 1,
                    border: 1,
                    borderColor: "divider",
                    width: "100%",
                    mt: 2
                }}
            >
                <Mui.Typography variant="body2" sx={{ m: 1, fontWeight: 600 }}>
                    选中文件:
                </Mui.Typography>
                <Mui.TextField
                    size="small"
                    label="文件名"
                    fullWidth
                    value={selectedFile.filename}
                    onChange={(e) => setSelectedFile({ ...selectedFile, filename: e.target.value })}
                    placeholder="请输入新文件名，如 my-docs"
                    sx={{ m: 1 }}
                />
                <Mui.TextField
                    size="small"
                    label="路径"
                    fullWidth
                    value={selectedFile.path}
                    onChange={(e) => setSelectedFile({ ...selectedFile, path: e.target.value })}
                    placeholder="请输入新文件路径，如 /docs/manual/"
                    sx={{ m: 1 }}
                />
                <Mui.Button variant="contained" sx={{ ...buttonStyle, m: 1 }}>
                    重命名/移动
                </Mui.Button>
                <Mui.Button variant="contained" color="error" sx={{ ...buttonStyle, m: 1 }}>
                    删除
                </Mui.Button>
                <Mui.Button variant="outlined" sx={{ ...buttonStyle, m: 1 }}>
                    取消
                </Mui.Button>
            </Mui.Box>
        )}
    </>);
}

export default MModifyFile;