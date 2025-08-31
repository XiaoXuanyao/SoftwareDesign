import * as React from "react";
import * as Mui from "@mui/material";
import * as MuiIcons from "@mui/icons-material";

function MKnowledge() {

    const items = React.useMemo(() =>
        Array.from({ length: 20 }, (_, i) => ({
            id: i + 1,
            title: `算法主题 #${i + 1}`,
            summary: `这是关于算法主题 #${i + 1} 的简要描述占位。`,
        })), []
    );

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
