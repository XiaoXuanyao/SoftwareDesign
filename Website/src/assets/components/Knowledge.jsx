import * as React from "react";
import * as Mui from "@mui/material";
import * as MuiIcons from "@mui/icons-material";
import { GlobalVarsContext } from "../api/GlobalVars.jsx";
import { queryKnowledgeSet, createKnowledgeSet } from "../api/Knowledge";

function MKnowledge() {

    const [items, setItems] = React.useState([]);
    const [batchDelete, setBatchDelete] = React.useState(false);
    const [isManager, checkIsManager] = React.useState(true);
    const [newSetName, setNewSetName] = React.useState("");
    const [createStatus, setCreateStatus] = React.useState(null);
    const [createMessage, setCreateMessage] = React.useState("");
    const [dirty, setDirty] = React.useState(true);

    const startQueryKnowledgeSet = () => {
        if (!dirty) return;
        queryKnowledgeSet(
            {
                userid: sessionStorage.getItem("userid") || null
            },
            (result) => {
                if (result.ok) {
                    setItems(result.collections || []);
                }
                else if (result.message[0] == "用户未登录") {
                    setCreateStatus("warning");
                    setCreateMessage("登录后才能查看知识库");
                }
                else {
                    console.log("查询失败", result.message);
                }
            }
        );
        dirty && setDirty(false);
    }
    React.useEffect(() => startQueryKnowledgeSet(), [dirty]);

    const startCreateKnowledgeSet = () => {
        createKnowledgeSet(
            {
                userid: sessionStorage.getItem("userid") || null,
                collectionname: newSetName
            },
            (result) => {
                if (result.ok) {
                    setCreateStatus("success");
                    setCreateMessage("知识库创建成功");
                    setDirty(true);
                }
                else {
                    setCreateStatus("error");
                    setCreateMessage("知识库创建失败: " + result.message[0]);
                }
            }
        );
    };

    const buttonStyle = {
        "&:hover": {
            color: "white",
        }
    };

    const alertStyle = {
        mb: 2,
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    }

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
                textAlign: "center"
            }}
        >

            <Mui.Typography
                variant="h4"
                sx={{
                    mb: 4,
                    fontWeight: 700,
                    textShadow: "1px 1px 0.5px rgba(0, 0, 0, 0.5)"
                }}>
                知识库
            </Mui.Typography>
            <Mui.Divider sx={{ mb: 4 }}><Mui.Chip label="管理员操作" size="small" /></Mui.Divider>

            {isManager && (<>
                <Mui.Box sx={{ mb: 4 }}>
                    <Mui.Button
                        variant="contained"
                        href="/manage-docs"
                        sx={{
                            ...buttonStyle,
                            color: "common.white",
                            mr: 2,
                            '&&': { color: 'common.white' },
                        }}
                    >
                        文档管理
                    </Mui.Button>
                </Mui.Box>
                <Mui.Divider sx={{ mb: 4 }} />
            </>)}

            <Mui.Box sx={{ mb: 4 }}>
                {/*工具栏*/}
                <Mui.TextField
                    label="新建知识库名称"
                    variant="outlined"
                    size="small"
                    value={newSetName}
                    onChange={(e) => setNewSetName(e.target.value)}
                    sx={{ mr: 2, width: 200 }}
                />
                <Mui.Button
                    variant="contained"
                    sx={{ ...buttonStyle, mr: 2 }}
                    disabled={!newSetName}
                    onClick={() => startCreateKnowledgeSet()}
                >
                    新建
                </Mui.Button>
                <Mui.Button disabled={!batchDelete} variant="contained" color="error" sx={{ ...buttonStyle, mr: 2 }}>
                    批量删除
                </Mui.Button>
            </Mui.Box>
            
            {createStatus === "loading" && (
                <Mui.Alert severity="info" sx={alertStyle}>{createMessage}</Mui.Alert>
            )}
            {createStatus === "warning" && (
                <Mui.Alert severity="warning" sx={alertStyle}>{createMessage}</Mui.Alert>
            )}
            {createStatus === "error" && (
                <Mui.Alert severity="error" sx={alertStyle}>{createMessage}</Mui.Alert>
            )}
            {createStatus === "success" && (
                <Mui.Alert severity="success" sx={alertStyle}>{createMessage}</Mui.Alert>
            )}

            <Mui.Divider sx={{ mb: 4 }} />
            {items.length === 0 && (
                <Mui.Typography variant="body1" sx={{ mt: 4, color: "text.secondary" }}>
                    当前没有创建的知识库，点击新建创建一个知识库。
                </Mui.Typography>
            )}
            <Mui.Box
                sx={{
                    width: "100%",
                    display: "grid",
                    gridTemplateColumns: {
                        xs: "repeat(2, 1fr)",
                        sm: "repeat(3, 1fr)",
                        md: "repeat(4, 1fr)"
                    },
                    gap: 2,
                    alignItems: "stretch",
                }}
            >
                {items.map((item) => (
                    <Mui.Card
                        key={item.collectionname}
                        variant="outlined"
                        sx={{
                            aspectRatio: "1 / 1",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                            border: 2,
                            pt: 1.5
                        }}
                    >
                        <Mui.CardContent>
                            <Mui.Typography
                                variant="body"
                                sx={{ fontWeight: 'bold' }}
                            >
                                {item.collectionname}
                            </Mui.Typography>
                            <Mui.Typography
                                variant="body2"
                                sx= {{ mt: 1 }}
                            >
                                {item.description ? item.description : "暂无描述"}
                            </Mui.Typography>
                            <Mui.Box sx={{
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "flex-end",
                                alignItems: "center",
                                mt: 1
                            }}>
                                <Mui.IconButton size="small">
                                    <MuiIcons.Edit color="primary"/>
                                </Mui.IconButton>
                                <Mui.IconButton size="samll">
                                    <MuiIcons.Delete color="error"/>
                                </Mui.IconButton>
                            </Mui.Box>

                        </Mui.CardContent>
                    </Mui.Card>
                ))}
            </Mui.Box>

        </Mui.Box>
    );
}

export default MKnowledge;
