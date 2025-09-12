import getConfig from "./Config.jsx";

function normalizeHistory(history) {
    if (!Array.isArray(history)) return [];
    return history
        .map(m => ({ role: m.who, content: String(m.message ?? "").trim() }))
        .filter(m => (m.role === "user" || m.role === "assistant") && m.content.length > 0);
}

export async function askChat(mes, callback) {
    const userid = mes.userid || "";
    const collectionname = mes.collectionname;
    const question = mes.question;
    const top_k = mes.top_k ?? 5;
    const history = normalizeHistory(mes.history);

    let result = {
        ok: true,
        message: ["unknown"],
        answer: null,
        contexts: null
    };

    if (!question || String(question).trim().length === 0) {
        result.ok = false;
        result.message = ["问题不能为空"];
    }

    if (result.ok) {
        try {
            const resp = await fetch(getConfig().apiUrl + "/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userid, collectionname, question, top_k, history })
            });
            const data = await resp.json().catch(() => ({}));

            if (!resp.ok || !data || !data.ok) {
                result.ok = false;
                result.message = [data?.message || "聊天失败"];
            } else {
                result.ok = true;
                result.message = ["success"];
                result.answer = data.answer || "";
                result.contexts = data.contexts || [];
            }
        } catch (e) {
            console.log(e);
            result.ok = false;
            result.message = ["网络错误"];
        }
    }

    if (callback) callback(result);
    return result;
}