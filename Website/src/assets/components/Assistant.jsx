import * as React from "react";
import * as Mui from "@mui/material";
import * as MuiIcons from "@mui/icons-material";
import MHistoryChatList from "./Chat/HistoryChatList";
import MChatInputBar from "./Chat/ChatInputBar";
import MChatMessages from "./Chat/ChatMessages";

function MAssistant() {
    const ChatList = React.useMemo(() => [
        { id: 1, who: "Assistant", Message: "Hello, how can I help you?" },
        { id: 2, who: "User", Message: "What is the meaning of life?" },
        { id: 3, who: "Assistant", Message: "Tell me a joke." },
        { id: 4, who: "User", Message: "What's the weather like today?" },
        { id: 5, who: "Assistant", Message: "How do I bake a cake?" },
    ], []);

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
                    mb: 6,
                    fontWeight: 700,
                    textShadow: "1px 1px 0.5px rgba(0, 0, 0, 0.5)"
                }}>
                AI智慧搜索与问答
            </Mui.Typography>
            
            <MHistoryChatList />
            
            

        </Mui.Box>
    )
}

export default MAssistant;