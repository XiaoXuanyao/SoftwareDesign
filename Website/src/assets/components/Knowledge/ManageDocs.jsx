import * as React from "react";
import * as Mui from "@mui/material";
import * as MuiIcons from "@mui/icons-material";

function MManageDocs() {
    const docs = React.useMemo(
        () =>
            Array.from({ length: 20 }, (_, i) => ({
                id: i + 1,
                filename: `文档 #${i + 1}`,
                path: `文件夹 #${i + 1}`,
            })),
        []
    );

    const [keyword, setKeyword] = React.useState("");
    const [uploadFileNames, setUploadFiles] = React.useState([]);
    const [uploadFilePath, setUploadFilePath] = React.useState("");
    const [selectedFile, setSelectedFile] = React.useState(null);
    const [selectedFileName, setSelectedFileName] = React.useState("");
    const [selectedFilePath, setSelectedFilePath] = React.useState("");
    const normalized = keyword.trim().toLowerCase();

    const uploadFiles = (e) => {

    };

    const deleteFiles = (files) => {

    };

    const filtered = React.useMemo(() => {
        if (!normalized) return docs;
        return docs.filter((d) => d.filename.toLowerCase().includes(normalized));
    }, [docs, normalized]);

    // 高亮匹配文本
    const highlight = (text) => {
        if (!normalized) return text;
        const idx = text.toLowerCase().indexOf(normalized);
        if (idx === -1) return text;
        const before = text.slice(0, idx);
        const match = text.slice(idx, idx + normalized.length);
        const after = text.slice(idx + normalized.length);
        return (
            <>
                {before}
                <Mui.Box
                    component="span"
                    sx={{
                        bgcolor: "warning.main",
                        color: "#fff",
                        px: 0.1,
                        borderRadius: 0.5,
                    }}
                >
                    {match}
                </Mui.Box>
                {after}
            </>
        );
    };

    const buttonStyle = {
        "&:hover": {
            color: "white",
        }
    };

    return (
        <Mui.Box
            sx={{
                width: { xs: "100%", sm: "80%", md: "55%" },
                maxWidth: 2000,
                mx: "auto",
                bgcolor: "background.paper",
                borderRadius: 2,
                boxShadow: 3,
                padding: 5,
                marginTop: 10,
                marginBottom: 5,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignContent: "center",
                textAlign: "center",
            }}
        >
            <Mui.Typography
                variant="h4"
                sx={{
                    mb: 4,
                    fontWeight: 700,
                    textShadow: "1px 1px 0.5px rgba(0, 0, 0, 0.5)",
                }}
            >
                文档管理
            </Mui.Typography>
            <Mui.Divider sx={{ mb: 4 }} />

            <Mui.Box
                sx={{
                    display: "flex",
                    flexDirection: { xs: "column", md: "row" },
                    alignItems: "flex-start",
                    gap: 1,
                }}
            >
                <Mui.Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        width: { xs: "100%", md: "40%" },
                        alignItems: "stretch",
                        textAlign: "left",
                    }}
                >
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
                                value={selectedFileName}
                                onChange={(e) => setSelectedFileName(e.target.value)}
                                placeholder="请输入新文件名，如 my-docs"
                                sx={{ m: 1 }}
                            />
                            <Mui.TextField
                                size="small"
                                label="路径"
                                fullWidth
                                value={selectedFilePath}
                                onChange={(e) => setSelectedFilePath(e.target.value)}
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
                </Mui.Box>
                <Mui.Divider orientation="vertical" flexItem />

                <Mui.Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        width: { xs: "100%", md: "60%" },
                    }}
                >
                    {/* 搜索栏 */}
                    <Mui.Box sx={{ display: "flex", gap: 2, mb: 3 }}>
                        <Mui.TextField
                            label="按文件名检索"
                            size="small"
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                            placeholder="输入文件名关键字..."
                            sx={{ flex: 1, minWidth: 180 }}
                        />
                        <Mui.Button
                            variant="outlined"
                            size="small"
                            startIcon={<MuiIcons.Clear sx={{ p: 0.5 }} />}
                            disabled={!keyword}
                            onClick={() => setKeyword("")}
                        >
                            清空
                        </Mui.Button>
                    </Mui.Box>

                    <Mui.Box
                        sx={{
                            mb: 2,
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            flexWrap: "wrap",
                            gap: 1,
                        }}
                    >
                        <Mui.Typography variant="body2" color="text.secondary">
                            共 {docs.length} 个文档 · 当前显示 {filtered.length} 个
                        </Mui.Typography>
                    </Mui.Box>

                    <Mui.Divider sx={{ mb: 2 }} />

                    {/* 列表 */}
                    <Mui.Paper
                        variant="outlined"
                        sx={{
                            height: "48vh",
                            overflowY: "auto",
                            "&::-webkit-scrollbar": { width: 4 },
                            "&::-webkit-scrollbar-thumb": { bgcolor: "primary.light", borderRadius: 3 },
                        }}
                    >
                        <Mui.List dense disablePadding>
                            {filtered.map((doc) => (
                                <Mui.ListItem
                                    key={doc.id}
                                    divider
                                    secondaryAction={<>
                                        <Mui.Button>
                                            <Mui.Typography variant="caption" color="text.secondary">
                                                {doc.path}
                                            </Mui.Typography>
                                        </Mui.Button>
                                        <Mui.Button>
                                            <MuiIcons.Delete fontSize="small" sx={{ color: "error.main" }} />
                                        </Mui.Button>
                                    </>}
                                    sx={{
                                        ":hover": { bgcolor: "action.hover" },
                                    }}
                                >
                                    <Mui.ListItemIcon sx={{ minWidth: 36, color: "primary.main" }}>
                                        <MuiIcons.Description fontSize="small" />
                                    </Mui.ListItemIcon>
                                    <Mui.ListItemText
                                        primary={
                                            <Mui.Button onClick={() => {
                                                setSelectedFile(doc)
                                                setSelectedFileName(doc.filename)
                                                setSelectedFilePath(doc.path)
                                            }}>
                                                <Mui.Typography
                                                    variant="body2"
                                                    sx={{ fontWeight: 500 }}
                                                    title={doc.filename}
                                                >
                                                    {highlight(doc.filename)}
                                                </Mui.Typography>
                                            </Mui.Button>
                                        }
                                    />
                                </Mui.ListItem>
                            ))}

                            {filtered.length === 0 && (
                                <Mui.ListItem>
                                    <Mui.ListItemText
                                        primary={
                                            <Mui.Typography variant="body2" color="text.secondary">
                                                未找到匹配的文档
                                            </Mui.Typography>
                                        }
                                    />
                                </Mui.ListItem>
                            )}
                        </Mui.List>
                    </Mui.Paper>
                </Mui.Box>
            </Mui.Box>
        </Mui.Box>
    );
}

export default MManageDocs;
