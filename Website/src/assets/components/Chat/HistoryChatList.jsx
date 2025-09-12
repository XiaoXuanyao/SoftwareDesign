import * as React from "react";
import * as Mui from "@mui/material";
import * as MuiIcons from "@mui/icons-material";

function MHistoryChatList(props) {
    const sessionsList = props.sessionsList;
    const setSessionsList = props.setSessionsList;
    const currentSession = props.currentSession;
    const setCurrentSession = props.setCurrentSession;

    const handleAddSession = React.useCallback(() => {
        const now = Date.now();
        const newSession = {
            id: `s-${now}-${Math.random().toString(36).slice(2,6)}`,
            title: "新的会话",
            createdAt: now,
            updatedAt: now,
            content: [{ id: 0, who: "assistant", message: "您好！我是您的AI助手，请问有什么可以帮您？" }]
        };
        setSessionsList?.(prev => [newSession, ...(prev || [])]);
        setCurrentSession?.(newSession);
    }, [setSessionsList, setCurrentSession]);

    const initedRef = React.useRef(false);
    React.useEffect(() => {
        if (initedRef.current) return;
        initedRef.current = true;
        if ((sessionsList || []).length === 0) {
            handleAddSession();
        }
    }, [sessionsList, handleAddSession]);

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
            <Mui.Box sx={{ px: 1.5, pt: 1, pb: 1 }}>
                <Mui.Button
                    fullWidth
                    size="small"
                    variant="contained"
                    startIcon={<MuiIcons.Add />}
                    onClick={handleAddSession}
                    sx={{
                        ":hover": { color: "text.onprimary" }
                    }}
                >
                    新增会话
                </Mui.Button>
            </Mui.Box>
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
                    {sessionsList.map((it) => (
                        <Mui.ListItem
                            key={it.id}
                            disablePadding
                            sx={{
                                mb: 0.5,
                                borderRadius: 1,
                            }}
                        >
                            <Mui.ListItemButton
                                sx={{ p:0, alignItems: "flex-start" }}
                                selected={currentSession?.id === it.id}
                                onClick={() => setCurrentSession?.(it)}
                            >
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
                                            {it.updatedAt ? new Date(it.createdAt).toLocaleString() : "未知"}
                                        </Mui.Typography>
                                    }
                                    sx={{ p: 0 }}
                                />
                            </Mui.ListItemButton>
                        </Mui.ListItem>
                    ))}
                    {sessionsList.length === 0 && (
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
