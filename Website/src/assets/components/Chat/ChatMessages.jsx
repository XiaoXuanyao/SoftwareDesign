import * as React from "react";
import * as Mui from "@mui/material";
import * as MuiIcons from "@mui/icons-material";
import MarkdownKatex from "../Utils/MarkdownKatex.jsx";

function MChatMessages(props) {
    const { ChatList } = props;

    return (
        <Mui.Box sx={{ mt: 10, mb: 20 }}>
            {ChatList.map((chat) => (
                <Mui.Box
                    key={chat.id}
                    sx={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: chat.who === "Assistant" ? "flex-start" : "flex-end"
                    }}
                >

                    {chat.who === "Assistant" && 
                        <Mui.Avatar sx={{ width: 32, height: 32, mr: 1, bgcolor: "primary.main" }}>
                            <MuiIcons.Assistant sx={{ color: "icon.main" }} />
                        </Mui.Avatar>
                    }
                    <Mui.Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: chat.who === "Assistant" ? "flex-start" : "flex-end"
                        }}
                    >
                        <Mui.Typography variant="body2" fontWeight="bold" sx={{ mb: .5 }}>
                            {chat.who}
                        </Mui.Typography>

                        <Mui.Box sx={{
                            p: 1.25,
                            bgcolor: chat.who === "Assistant" ? "background.default" : "primary.light",
                            borderRadius: 1.5,
                            overflowX: "auto",
                            "& .katex-display": { overflowX: "auto" }
                        }}>
                            <MarkdownKatex chat={chat} />
                        </Mui.Box>
                    </Mui.Box>
                    {chat.who === "User" && 
                        <Mui.Avatar sx={{ width: 32, height: 32, ml: 1, bgcolor: "primary.main" }}>
                            <MuiIcons.Person sx={{ color: "icon.main" }} />
                        </Mui.Avatar>
                    }
                    
                </Mui.Box>
            ))}
        </Mui.Box>
    )
}

export default MChatMessages;