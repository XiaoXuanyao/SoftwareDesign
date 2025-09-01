import * as React from "react";
import * as Mui from "@mui/material";
import * as MuiIcons from "@mui/icons-material";

function MHistoryChatList() {
    const [items, setItems] = React.useState(() =>
        Array.from({ length: 8 }, (_, i) => ({
            id: i + 1,
            title: `会话 ${i + 1}`,
            time: new Date().toLocaleTimeString().slice(0, 5),
        }))
    );

    return (
        <Mui.Paper
            elevation={2}
            sx={{
                position: "fixed",
                top: 0,
                left: 0,
                height: "100vh",
                width: { xs: "0vw", sm: "30vw", md: "20vw" },
                display: { xs: "none", sm: "flex" },
                flexDirection: "column",
                paddingTop: 8,
                borderRadius: 0,
                borderRight: 1,
                borderColor: "divider",
                bgcolor: "background.paper",
                zIndex: (t) => t.zIndex.appBar - 1,
            }}
        >
            <Mui.Box sx={{ p: 1.5, pb: 1 }}>
                <Mui.Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    会话历史
                </Mui.Typography>
            </Mui.Box>
            <Mui.Divider />
            <Mui.Box
                sx={{
                    flex: 1,
                    overflowY: "auto",
                    px: 1,
                    pt: 3,
                    "&::-webkit-scrollbar": { width: 6 },
                    "&::-webkit-scrollbar-thumb": {
                        backgroundColor: "primary.light",
                        borderRadius: 3,
                    },
                }}
            >
                <Mui.List dense disablePadding>
                    {items.map((it) => (
                        <Mui.ListItem
                            key={it.id}
                            disablePadding
                            sx={{
                                mb: 0.5,
                                borderRadius: 1,
                            }}
                        >
                            <Mui.ListItemButton sx={{ p:0, alignItems: "flex-start" }}>
                                <Mui.ListItemIcon sx={{ minWidth: 32 }}>
                                    <MuiIcons.ChatBubbleOutline
                                        fontSize="small"
                                        sx={{ m: 1, ml: 2 }}
                                    />
                                </Mui.ListItemIcon>
                                <Mui.ListItemText
                                    primary={
                                        <Mui.Typography
                                            variant="body2"
                                            noWrap
                                            sx={{ p: 0 }}
                                        >
                                            {it.title}
                                        </Mui.Typography>
                                    }
                                    secondary={
                                        <Mui.Typography
                                            variant="caption"
                                            color="text.secondary"
                                            noWrap
                                            sx={{ display: "block", p: 0 }}
                                        >
                                            {it.time}
                                        </Mui.Typography>
                                    }
                                    sx={{ p: 0 }}
                                />
                            </Mui.ListItemButton>
                        </Mui.ListItem>
                    ))}
                    {items.length === 0 && (
                        <Mui.ListItem>
                            <Mui.ListItemText
                                primary={
                                    <Mui.Typography variant="caption" color="text.secondary">
                                        暂无会话
                                    </Mui.Typography>
                                }
                            />
                        </Mui.ListItem>
                    )}
                </Mui.List>
            </Mui.Box>
        </Mui.Paper>
    );
}

export default MHistoryChatList;
