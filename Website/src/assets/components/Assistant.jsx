import * as React from "react";
import * as Mui from "@mui/material";
import * as MuiIcons from "@mui/icons-material";
import MHistoryChatList from "./Chat/HistoryChatList";
import MChatInputBar from "./Chat/ChatInputBar";
import MChatMessages from "./Chat/ChatMessages";
import { askChat } from "../api/Chat";

function MAssistant() {
    const [sessionsList, setSessionsList] = React.useState([]);
    const [currentSession, setCurrentSession] = React.useState(null);
    const [chatList, setChatList] = React.useState([{ id: 0, who: "assistant", message: "您好！我是您的AI助手，请问有什么可以帮您？" }]);
    const [loading, setLoading] = React.useState(false);
    const [loadingSession, setLoadingSession] = React.useState(false);
    const bottomRef = React.useRef(null);

    const firstSaveSkipRef = React.useRef(false);

    // 本地缓存键
    const SESSIONS_KEY = "chat.sessions.v1";
    const ACTIVE_KEY = "chat.activeId.v1";

    // 创建默认会话
    const createSession = React.useCallback(() => {
        const now = Date.now();
        return {
            id: `s-${now}-${Math.random().toString(36).slice(2,6)}`,
            title: "新的会话",
            createdAt: now,
            updatedAt: now,
            content: [{ id: 0, who: "assistant", message: "您好！我是您的AI助手，请问有什么可以帮您？" }]
        };
    }, []);

    // 首次加载：从本地缓存恢复（若无则创建默认会话）
    React.useEffect(() => {
        try {
            const raw = localStorage.getItem(SESSIONS_KEY);
            const list = raw ? JSON.parse(raw) : [];
            console.log(raw, list);
            if (Array.isArray(list) && list.length > 0) {
                setSessionsList(list);
                const aid = localStorage.getItem(ACTIVE_KEY);
                const cur = list.find(s => s.id === aid) || list[0];
                setCurrentSession(cur);
            } else {
                const s = createSession();
                setSessionsList([s]);
                setCurrentSession(s);
            }
        } catch {
            const s = createSession();
            setSessionsList([s]);
            setCurrentSession(s);
        }
    }, [createSession]);

    // 持久化：跳过首次保存，避免用 [] 覆盖已有缓存
    React.useEffect(() => {
        if (!firstSaveSkipRef.current) {
            firstSaveSkipRef.current = true;
            return;
        }
        try {
            localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessionsList));
        } catch {}
    }, [SESSIONS_KEY, sessionsList]);

    // 持久化：当前会话变化时写入本地缓存
    React.useEffect(() => {
        if (currentSession?.id) {
            try { localStorage.setItem(ACTIVE_KEY, currentSession.id); } catch {}
        }
    }, [ACTIVE_KEY, currentSession?.id]);

    const queryMessage = React.useCallback((message, collectionname) => {
        const question = (message || "").trim();
        if (!question) return;
        if (!currentSession?.id) {
            console.warn("未选中会话，无法发送");
            return;
        }

        // 1) 绑定目标会话的快照 ID，防止期间切换会话
        const targetSessionId = currentSession.id;

        // 2) 发送前的历史（不包含本次用户消息）
        const prevHistory = (currentSession.content || []).map(m => ({
            role: m.who === "user" ? "user" : "assistant",
            content: m.message || ""
        }));

        // 3) 先把用户消息写入目标会话（只写一次，避免重复）
        const userMsg = { id: Date.now(), who: "user", message: question };
        setSessionsList(prev =>
            prev.map(s =>
                s.id === targetSessionId
                    ? { ...s, content: [ ...(s.content || []), userMsg ], updatedAt: Date.now() }
                    : s
            )
        );

        setLoading(true);
        setLoadingSession(currentSession.id);

        // 4) 调用接口（history 用发送前的消息）
        askChat(
            {
                userid: sessionStorage.getItem("userdata.userid") || "",
                collectionname: collectionname ?? sessionStorage.getItem("current_collectionname") ?? "",
                question,
                history: prevHistory,
                top_k: 5
            },
            (result) => {
                const aiMsg = {
                    id: Date.now() + 1,
                    who: "assistant",
                    message: result.ok ? (result.answer || "（无答案）") : (`错误：${(result.message && result.message[0]) || "聊天失败"}`)
                };

                // 5) 无论当前是否切换，始终把回答写回“当时的目标会话”
                setSessionsList(prev =>
                    prev.map(s =>
                        s.id === targetSessionId
                            ? { ...s, content: [ ...(s.content || []), aiMsg ], updatedAt: Date.now() }
                            : s
                    )
                );

                // 若当前仍停留在该会话，再滚动到底部
                if (currentSession?.id === targetSessionId) {
                    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
                }
                setLoadingSession(null);
                setLoading(false);
            }
        );
    }, [currentSession, sessionsList, setSessionsList, setCurrentSession]);

    React.useEffect(() => {
        if (currentSession) {
            setChatList(currentSession.content || []);
            setTimeout(() => {
                bottomRef.current?.scrollIntoView({ behavior: "smooth" });
            }, 200);
        }
    }, [currentSession]);

    React.useEffect(() => {
        if (!currentSession?.id) return;
        const updated = sessionsList.find(s => s.id === currentSession.id);
        if (updated) {
            setChatList(updated.content || []);
        }
    }, [sessionsList, currentSession?.id]);

    return (
        <Mui.Box
            sx={{
                width: { xs: "100%", sm: "70%", md: "55%" },
                ml: { xs: "0%", sm: "30%", md: "30%" },
                maxWidth: 2000,
                mx: "auto",
                bgcolor: "background.paper",
                borderRadius: 2,
                boxShadow: 3,
                padding: 5,
                marginTop: 10,
                marginBottom: 20,
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
                AI智慧搜索与问答
            </Mui.Typography>
            <Mui.Divider sx={{ mb: 4 }} />
            
            <MHistoryChatList
                sessionsList={sessionsList}
                setSessionsList={setSessionsList}
                currentSession={currentSession}
                setCurrentSession={setCurrentSession}
            />

            <MChatInputBar
                loading={loading}
                queryMessage={queryMessage}
                bottomRef={bottomRef}
            />

            <MChatMessages
                chatList={chatList}
                bottomRef={bottomRef}
                loadingSession={loadingSession}
                currentSession={currentSession ? currentSession.id : null}
            />

        </Mui.Box>
    )
}

export default MAssistant;