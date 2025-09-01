import * as React from "react";
import * as Mui from "@mui/material";
import * as MuiIcons from "@mui/icons-material";

function MUploadFiles(props) {
    const uploadFiles = props.uploadFiles;
    const buttonStyle = props.buttonStyle;

    const [uploadFileNames, setUploadFiles] = React.useState([]);
    const [uploadFilePath, setUploadFilePath] = React.useState("");

    return (
        <Mui.Box
            sx={{
                p: 2,
                borderRadius: 1,
                border: 1,
                borderColor: "divider",
                width: "100%",
            }}
        >
            <Mui.Box sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center"
            }}>
                <Mui.Button variant="contained" sx={{ ...buttonStyle, m: 1 }}>
                    选择文档
                    <input hidden type="file" onChange={uploadFiles} />
                </Mui.Button>
                {
                    uploadFileNames.length > 0 ? (
                        <Mui.Typography variant="body2" sx={{ m: 1 }}>
                            {uploadFileNames.length === 1
                                ? `已选择文件: ${uploadFileNames[0]}`
                                : `已选择 ${uploadFileNames.length} 个文件`}
                        </Mui.Typography>
                    )
                    : (
                        <Mui.Typography variant="body2" sx={{ m: 1 }}>
                            未选择文件
                        </Mui.Typography>
                    )
                }
            </Mui.Box>
            <Mui.TextField
                size="small"
                label="路径"
                fullWidth
                value={uploadFilePath}
                onChange={(e) => setUploadPath(e.target.value)}
                placeholder="请输入保存路径，如 /docs/manual/"
                sx={{ m: 1 }}
            />
            <Mui.Button variant="contained" sx={{ ...buttonStyle, m: 1 }}>
                上传/批量上传
            </Mui.Button>
        </Mui.Box>
    );
}

export default MUploadFiles;