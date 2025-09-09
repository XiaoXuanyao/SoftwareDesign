import * as React from "react";
import * as Mui from "@mui/material";
import * as MuiIcons from "@mui/icons-material";

function MFilterFiles(props) {
    const setSelectedFile = props.setSelectedFile;
    const keyword = props.keyword;
    const setKeyword = props.setKeyword;
    const docs = props.docs;
    const normalized = keyword.trim().toLowerCase();
    const buttonStyle = props.buttonStyle;
    
    const [selectedDocs, setSelectedDocs] = React.useState([]);
    
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
    
    const handleSelectAll = () => {
        if (selectedDocs.length === docs.length) {
            setSelectedDocs([]);
        } else {
            setSelectedDocs(docs.map(doc => doc.docid));
        }
    };

    const handleSelectOne = (docid) => {
        setSelectedDocs(prev =>
            prev.includes(docid)
                ? prev.filter(id => id !== docid)
                : [...prev, docid]
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
            <Mui.Box sx={{ display: "flex", gap: 2, mb: 2 }}>
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
                    disabled={!keyword}
                    onClick={() => setKeyword("")}
                    color="error"
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
                    共 {docs.length} 个文档
                </Mui.Typography>
                <Mui.Box>
                    <Mui.Button
                        variant="contained"
                        size="small"
                        startIcon={<MuiIcons.SelectAll />}
                        onClick={handleSelectAll}
                        sx={{ ...buttonStyle, mr: 1 }}
                    >
                        {selectedDocs.length === docs.length && docs.length > 0 ? "取消" : "全选"}
                    </Mui.Button>
                    <Mui.Button
                        variant="contained"
                        size="small"
                        color="error"
                        startIcon={<MuiIcons.Delete />}
                        disabled={selectedDocs.length === 0}
                        sx={buttonStyle}
                    >
                        批量删除
                    </Mui.Button>
                </Mui.Box>
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
                    {docs.map((doc) => (
                        <Mui.ListItem
                            key={doc.docid}
                            divider
                            secondaryAction={<>
                                <Mui.Button>
                                    <Mui.Typography variant="caption" color="text.secondary" sx={{ textTransform: "none" }}>
                                        {doc.path}
                                    </Mui.Typography>
                                </Mui.Button>
                                <Mui.IconButton>
                                    <MuiIcons.Delete fontSize="small" sx={{ color: "error.main" }} />
                                </Mui.IconButton>
                            </>}
                            sx={{
                                ":hover": { bgcolor: "action.hover" },
                                m: 0,
                                p: 0
                            }}
                        >
                            <Mui.Checkbox
                                checked={selectedDocs.includes(doc.docid)}
                                onChange={() => handleSelectOne(doc.docid)}
                                sx={{ ml: 2, mr: 1 }}
                                icon={<MuiIcons.CheckBoxOutlineBlank fontSize="small" />}
                                checkedIcon={<MuiIcons.CheckBox fontSize="small" />}
                            />

                            <Mui.ListItemIcon sx={{ minWidth: 0, color: "primary.main" }}>
                                <MuiIcons.Description fontSize="small" />
                            </Mui.ListItemIcon>
                            <Mui.ListItemText
                                primary={
                                    <Mui.Button onClick={() => {
                                        setSelectedFile(doc)
                                    }}>
                                        <Mui.Typography
                                            variant="body2"
                                            sx={{ fontWeight: 500, textTransform: "none"}}
                                            title={doc.docname}
                                        >
                                            {highlight(doc.docname)}
                                        </Mui.Typography>
                                    </Mui.Button>
                                }
                            />
                        </Mui.ListItem>
                    ))}

                    {docs.length === 0 && (
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