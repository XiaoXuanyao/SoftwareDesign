import * as React from "react";
import * as Mui from "@mui/material";
import * as MuiIcons from "@mui/icons-material";

function MFilterFiles(props) {
    const setSelectedFile = props.setSelectedFile;
    const keyword = props.keyword;
    const setKeyword = props.setKeyword;
    const docs = props.docs;
    const filtered = props.filtered;
    const normalized = keyword.trim().toLowerCase();
    
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

    return (
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
    );
}

export default MFilterFiles;