import * as React from "react";
import * as Mui from "@mui/material";
import * as MuiIcons from "@mui/icons-material";
import { GlobalVarsContext } from "../api/GlobalVars.jsx";
import { queryKnowledge } from "../api/Knowledge";

function MKnowledge() {

    const [items, setItems] = React.useState([]);
    const [batchDelete, setBatchDelete] = React.useState(false);
    const [isManager, checkIsManager] = React.useState(true);
    queryKnowledge(
        {
            userid: sessionStorage.getItem("userid") || null
        },
        (result) => {
            if (result.ok) {
                setItems(result.collections || []);
            }
            else {
                console.log("查询失败", result.message);
            }
        }
    );

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
            <Mui.Divider sx={{ mb: 4 }} />

            <Mui.Box sx={{ mb: 4 }}>
                {/*工具栏*/}
                <Mui.Button variant="contained" sx={{ ...buttonStyle, mr: 2 }}>
                    新建
                </Mui.Button>
                <Mui.Button disabled={!batchDelete} variant="contained" color="error" sx={{ ...buttonStyle, mr: 2 }}>
                    批量删除
                </Mui.Button>
            </Mui.Box>

            {isManager && (<>
                <Mui.Divider sx={{ mb: 4 }}><Mui.Chip label="管理员操作" size="small" /></Mui.Divider>
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
            </>)}

            <Mui.Divider sx={{ mb: 4 }} />
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
                        key={item.id}
                        variant="outlined"
                        sx={{
                            aspectRatio: "1 / 1",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                            backgroundColor: "background.default",
                        }}
                    >
                        <Mui.CardContent>
                            <Mui.Typography variant="h6">{item.title}</Mui.Typography>
                            <Mui.Typography variant="body2">{item.summary}</Mui.Typography>
                        </Mui.CardContent>
                    </Mui.Card>
                ))}
            </Mui.Box>

        </Mui.Box>
    );
}

export default MKnowledge;
