import * as React from "react";
import getConfig from "./Config.jsx";



export async function queryKnowledge(mes, callback) {
    const userid = mes.userid;

    if (!userid) {
        callback({ ok: false, message: "用户未登录" });
        return;
    }
    try {
        const resp = await fetch(getConfig().apiUrl + "/knowledge/collections/query", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userid })
        });
        const data = await resp.json().catch(() => ({}));
        if (!resp.ok || !data || !data.ok) {
            result.ok = false;
            result.message = [data.message, data.detail, "查询失败"];
        }
        else {
            result.ok = true;
            result.message = ["查询成功"];
            result.collections = data.collections;
        }
        callback([true, data]);
    } 
    catch (e) {
        result.ok = false;
        result.message = ["网络错误"];
    }
    if (callback) {
        callback(result);
    }
    return result;
}
