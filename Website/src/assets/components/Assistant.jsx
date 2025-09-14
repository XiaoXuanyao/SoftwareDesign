import * as React from "react";
import * as Mui from "@mui/material";
import * as MuiIcons from "@mui/icons-material";
import { useLocation } from "react-router-dom";
import MHistoryChatList from "./Chat/HistoryChatList";
import MChatInputBar from "./Chat/ChatInputBar";
import MChatMessages from "./Chat/ChatMessages";
import { askChat, readChatSave, writeChatSave } from "../api/Chat";

function MAssistant() {
    const [sessionsList, setSessionsList] = React.useState([]);
    const [currentSession, setCurrentSession] = React.useState(null);
    const [chatList, setChatList] = React.useState([
        { id: 0, who: "assistant", message: "您好！我是您的AI助手，请问有什么可以帮您？" },
    ]);
    const [loading, setLoading] = React.useState(false);
    const [loadingSession, setLoadingSession] = React.useState(false);
    const bottomRef = React.useRef(null);

    const loadedRef = React.useRef(false);
    const saveTimerRef = React.useRef(null);
    const [ready, setReady] = React.useState(false);

    const userid = React.useMemo(() => {
        return sessionStorage.getItem("userdata.userid") || "";
    }, []);

    const createSession = React.useCallback(() => {
        const now = Date.now();
        return {
            id: `s-${now}-${Math.random().toString(36).slice(2, 6)}`,
            title: "新的会话",
            createdAt: now,
            updatedAt: now,
            content: [{ id: 0, who: "assistant", message: "您好！我是您的AI助手，请问有什么可以帮您？" }],
        };
    }, []);

    React.useEffect(() => {
        let cancelled = false;
        async function init() {
            if (!userid) {
                const s = createSession();
                if (!cancelled) {
                    setSessionsList([s]);
                    setCurrentSession(s);
                    loadedRef.current = true;
                    setReady(true);
                }
                return;
            }
            const res = await readChatSave({ userid });
            if (!res.ok || !res.content) {
                const s = createSession();
                if (!cancelled) {
                    setSessionsList([s]);
                    setCurrentSession(s);
                    loadedRef.current = true;
                    setReady(true);
                }
                writeChatSave({ userid, content: { sessionsList: [s], activeId: s.id } });
                return;
            }
            const content = res.content;
            const list = Array.isArray(content.sessionsList) ? content.sessionsList : [createSession()];
            const activeId = content.activeId || list[0]?.id;

            if (!cancelled) {
                setSessionsList(list);
                setCurrentSession(list.find((s) => s.id === activeId) || list[0] || null);
                loadedRef.current = true;
                setReady(true);
            }
        }
        init();
        return () => {
            cancelled = true;
        };
    }, [userid, createSession]);

    React.useEffect(() => {
        if (currentSession) {
            setChatList(currentSession.content || []);
            requestAnimationFrame(() => {
                bottomRef.current?.scrollIntoView({ behavior: "auto", block: "end" });
            });
        }
    }, [currentSession]);

    React.useEffect(() => {
        if (!currentSession?.id) return;
        const updated = sessionsList.find((s) => s.id === currentSession.id);
        if (updated) setChatList(updated.content || []);
    }, [sessionsList, currentSession?.id]);

    React.useEffect(() => {
        if (!loadedRef.current || !userid) return;
        if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
        saveTimerRef.current = setTimeout(() => {
            writeChatSave({
                userid,
                content: { sessionsList, activeId: currentSession?.id || "" },
            });
        }, 400);
        return () => saveTimerRef.current && clearTimeout(saveTimerRef.current);
    }, [userid, sessionsList, currentSession?.id]);

    const queryMessage = React.useCallback(
        (message, collectionname, targetSessionIdOverride) => {
            const question = (message || "").trim();
            const targetSessionId = targetSessionIdOverride || currentSession?.id;
            if (!question || !targetSessionId) return;

            const targetSession = sessionsList.find((s) => s.id === targetSessionId);
            const prevHistory = (targetSession?.content || []).map((m) => ({
                role: m.who === "user" ? "user" : "assistant",
                content: m.message || "",
            }));

            const userMsg = { id: Date.now(), who: "user", message: question };
            setSessionsList((prev) =>
                prev.map((s) =>
                    s.id === targetSessionId
                        ? { ...s, content: [...(s.content || []), userMsg], updatedAt: Date.now() }
                        : s
                )
            );

            setLoading(true);
            setLoadingSession(targetSessionId);

            askChat(
                {
                    userid,
                    collectionname: collectionname ?? sessionStorage.getItem("current_collectionname") ?? "",
                    question,
                    history: prevHistory,
                    top_k: 5,
                },
                (result) => {
                    const aiMsg = {
                        id: Date.now() + 1,
                        who: "assistant",
                        message: result.ok
                            ? result.answer || "（无答案）"
                            : `错误：${(result.message && result.message[0]) || "聊天失败"}`,
                    };
                    setSessionsList((prev) =>
                        prev.map((s) =>
                            s.id === targetSessionId
                                ? { ...s, content: [...(s.content || []), aiMsg], updatedAt: Date.now() }
                                : s
                        )
                    );
                    if (currentSession?.id === targetSessionId) {
                        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
                    }
                    setLoadingSession(null);
                    setLoading(false);
                }
            );
        },
        [userid, currentSession, sessionsList]
    );

    const location = useLocation();
    const pendingQueryRef = React.useRef(null);

    const handleAddSessionThenAsk = React.useCallback(
        (question) => {
            const s = { ...createSession(), title: (question || "新的会话").slice(0, 20) };
            setSessionsList((prev) => [s, ...prev]);
            setCurrentSession(s);
            setTimeout(() => {
                queryMessage(question, undefined, s.id);
            }, 0);
        },
        [createSession, queryMessage]
    );

    React.useEffect(() => {
        const params = new URLSearchParams(location.search || "");
        const q = params.get("query");
        const cleaned = q && q !== "null" ? q.trim() : "";
        pendingQueryRef.current = cleaned || null;
    }, [location.search]);

    React.useEffect(() => {
        if (!ready) return;
        const q = pendingQueryRef.current;
        if (!q) return;
        pendingQueryRef.current = null;
        handleAddSessionThenAsk(q);
    }, [ready, handleAddSessionThenAsk]);

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
                textAlign: "center",
            }}
        >
            <Mui.Typography
                variant="h4"
                sx={{
                    mb: 4,
                    fontWeight: 700,
                    textShadow: "1px 1px 0.5px rgba(0, 0, 0, 0.5)",
                }}
            >
                AI智慧搜索与问答
            </Mui.Typography>
            <Mui.Divider sx={{ mb: 4 }} />

            <MHistoryChatList
                sessionsList={sessionsList}
                setSessionsList={setSessionsList}
                currentSession={currentSession}
                setCurrentSession={setCurrentSession}
            />

            <MChatInputBar loading={loading} queryMessage={queryMessage} bottomRef={bottomRef} />

            <MChatMessages
                chatList={chatList}
                bottomRef={bottomRef}
                loadingSession={loadingSession}
                currentSession={currentSession ? currentSession.id : null}
            />
        </Mui.Box>
    );
}

export default MAssistant;
