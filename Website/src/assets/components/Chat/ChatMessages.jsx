import * as React from "react";
import * as Mui from "@mui/material";
import * as MuiIcons from "@mui/icons-material";
import MarkdownKatex from "../Utils/MarkdownKatex.jsx";

function MChatMessages(props) {
    const chatList = props.chatList || [];
    const bottomRef = props.bottomRef;
    const loadingSession = props.loadingSession;
    const currentSession = props.currentSession;

    return (
        <Mui.Box sx={{ mt: 10, mb: 18 }}>
            {chatList.map((chat) => (
                <Mui.Box
                    key={chat.id}
                    sx={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: chat.who === "assistant" ? "flex-start" : "flex-end",
                        p: 1
                    }}
                >

                    {chat.who === "assistant" && 
                        <Mui.Avatar sx={{ width: 32, height: 32, mr: 1, bgcolor: "primary.main" }}>
                            <MuiIcons.Assistant sx={{ color: "icon.main" }} />
                        </Mui.Avatar>
                    }
                    <Mui.Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: chat.who === "assistant" ? "flex-start" : "flex-end"
                        }}
                    >
                        <Mui.Typography variant="body2" fontWeight="bold" sx={{ mb: .5 }}>
                            {chat.who}
                        </Mui.Typography>

                        <Mui.Box sx={{
                            p: 1.25,
                            bgcolor: chat.who === "assistant" ? "background.default" : "primary.light",
                            borderRadius: 1.5,
                            overflowX: "auto",
                            "& .katex-display": { overflowX: "auto" }
                        }}>
                            <MarkdownKatex chat={chat} />
                        </Mui.Box>
                    </Mui.Box>
                    {chat.who === "user" && 
                        <Mui.Avatar sx={{ width: 32, height: 32, ml: 1, bgcolor: "primary.main" }}>
                            <MuiIcons.Person sx={{ color: "icon.main" }} />
                        </Mui.Avatar>
                    }
                    
                </Mui.Box>
            ))}
            
            {loadingSession == currentSession && (
                <Mui.Box
                    sx={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "flex-start",
                        p: 1
                    }}
                >
                    <Mui.Avatar sx={{ width: 32, height: 32, mr: 1, bgcolor: "primary.main" }}>
                        <MuiIcons.Assistant sx={{ color: "icon.main" }} />
                    </Mui.Avatar>
                    <Mui.Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                        <Mui.Typography variant="body2" fontWeight="bold" sx={{ mb: .5 }}>
                            assistant
                        </Mui.Typography>
                        <Mui.Box
                            sx={{
                                p: 1.25,
                                bgcolor: "background.default",
                                borderRadius: 1.5,
                                minWidth: 64
                            }}
                        >
                            <Mui.Box sx={{ display: "flex", gap: 0.8 }}>
                                {[0, 1, 2].map((i) => (
                                    <Mui.Box
                                        key={i}
                                        sx={{
                                            width: 6,
                                            height: 6,
                                            borderRadius: "50%",
                                            bgcolor: "text.secondary",
                                            animation: "blink 1.4s infinite both",
                                            animationDelay: `${i * 0.2}s`,
                                            "@keyframes blink": {
                                                "0%": { opacity: 0.2, transform: "translateY(0)" },
                                                "20%": { opacity: 1, transform: "translateY(-2px)" },
                                                "100%": { opacity: 0.2, transform: "translateY(0)" }
                                            }
                                        }}
                                    />
                                ))}
                            </Mui.Box>
                        </Mui.Box>
                    </Mui.Box>
                </Mui.Box>
            )}

            <div ref={bottomRef}></div>
        </Mui.Box>
    )
}

export default MChatMessages;