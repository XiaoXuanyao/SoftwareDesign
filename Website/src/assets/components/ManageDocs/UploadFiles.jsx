import * as React from "react";
import * as Mui from "@mui/material";
import * as MuiIcons from "@mui/icons-material";
import { uploadDocs } from "../../api/Knowledge.jsx";

function MUploadFiles(props) {
    const buttonStyle = props.buttonStyle;
    const setDirty = props.setDirty;

    const [uploadFileNames, setUploadFileNames] = React.useState([]);
    const [uploadFilePath, setUploadFilePath] = React.useState("");
    const [uploadFiles, setUploadFiles] = React.useState([]);
    const [uploading, setUploading] = React.useState(false);
    const [progress, setProgress] = React.useState(0);
    const [uploadStatus, setUploadStatus] = React.useState("");
    const [uploadMessage, setUploadMessage] = React.useState("");

    const handleDocs = (e) => {
        const files = Array.from(e.target.files);
        setUploadFiles(files);
        setUploadFileNames(files.map(file => file.name));
    }

    const sendDocs = async () => {
        if (uploadFiles.length === 0) return;
        setUploading(true);
        setProgress(0);
        setUploadStatus("loading");
        setUploadMessage("正在上传文件...");

        const formData = new FormData();
        uploadFiles.forEach((file) => {
            formData.append("files", file);
        });
        formData.append("path", uploadFilePath);
        formData.append("userid", sessionStorage.getItem("userdata.userid"));
        
        uploadDocs(
            {
                formData,
                setProgress
            },
            (result) => {
                if (result.ok) {
                    setProgress(100);
                    setDirty(true);
                    setUploadStatus("success");
                    setUploadMessage("上传完成")
                }
                else {
                    setUploadStatus("error");
                    setUploadMessage(result.message[0]);
                }
                setUploading(false);
            }
        );
    }

    const alertStyle = {
        mb: 2,
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    }

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
                <Mui.Button
                    variant="contained"
                    sx={{ ...buttonStyle, m: 1, minWidth: 100 }}
                    component="label"
                    disabled={uploading}
                >
                    选择文档
                    <input hidden multiple type="file" onChange={handleDocs} />
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
                label=""
                fullWidth
                value={uploadFilePath}
                onChange={(e) => setUploadFilePath(e.target.value)}
                placeholder="请输入保存路径，如 /docs/manual/"
                sx={{ m: 1 }}
            />
            <Mui.Button
                variant="contained"
                sx={{ ...buttonStyle, m: 1 }}
                onClick={sendDocs}
                disabled={uploadFiles.length === 0 || uploading}
            >
                上传/批量上传
            </Mui.Button>
            <Mui.Box sx={{
                m: 1,
                width: "100%",
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center"
            }}>
                <Mui.LinearProgress variant="determinate" value={progress} sx={{ flex: 7 }} />
                <Mui.Typography variant="body2" sx={{ color: "primary.main", textAlign: "center", flex: 1 }}>
                    {progress}%
                </Mui.Typography>
            </Mui.Box>

            {uploadStatus === "loading" && (
                <Mui.Alert severity="info" sx={alertStyle}>{uploadMessage}</Mui.Alert>
            )}
            {uploadStatus === "error" && (
                <Mui.Alert severity="error" sx={alertStyle}>{uploadMessage}</Mui.Alert>
            )}
            {uploadStatus === "success" && (
                <Mui.Alert severity="success" sx={alertStyle}>{uploadMessage}</Mui.Alert>
            )}
        </Mui.Box>
    );
}

export default MUploadFiles;