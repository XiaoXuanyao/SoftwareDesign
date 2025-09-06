import * as React from "react";
import getConfig from "./Config.jsx";



export async function queryKnowledgeSet(mes, callback) {
    const userid = mes.userid;

    var result = {
        ok: true,
        message: ["unknown"],
        collections: null
    };
    if (!userid) {
        result.ok = false;
        result.message = ["用户未登录"];
    }
    if (result.ok) {
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
        } 
        catch (e) {
            result.ok = false;
            result.message = ["网络错误"];
            console.log(e);
        }
    }
    if (callback) {
        callback(result);
    }
    return result;
}

export async function createKnowledgeSet(mes, callback) {
    const collectionname = mes.collectionname;
    const userid = mes.userid;

    var result = {
        ok: true,
        message: ["unknown"]
    };
    if (!userid) {
        result.ok = false;
        result.message = ["用户未登录"];
    }
    if (result.ok) {
        try {
            const resp = await fetch(getConfig().apiUrl + "/knowledge/collections/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ collectionname, userid })
            });
            const data = await resp.json().catch(() => ({}));
            if (!resp.ok || !data || !data.ok) {
                result.ok = false;
                result.message = [data.message, data.detail, "创建失败"];
            }
            else {
                result.ok = true;
                result.message = ["创建成功"];
            }
        }
        catch (e) {
            result.ok = false;
            result.message = ["网络错误"];
            console.log(e);
        }
    }
    if (callback) {
        callback(result);
    }
    return result;
}

export async function deleteKnowledgeSets(mes, callback) {
    const collectionnames = mes.collectionnames;
    const userid = mes.userid;

    var result = {
        ok: true,
        message: ["unknown"]
    };
    if (!userid) {
        result.ok = false;
        result.message = ["用户未登录"];
    }
    if (result.ok) {
        try {
            result.ok = true;
            result.message = ["删除成功"];
            for (let cname of collectionnames) {
                const resp = await fetch(getConfig().apiUrl + "/knowledge/collections/delete", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        collectionname: cname,
                        userid
                    })
                });
                const data = await resp.json().catch(() => ({}));
                if (!resp.ok || !data || !data.ok) {
                    result.ok = false;
                    result.message = [data.message, data.detail, "删除失败"];
                }
            }
        }
        catch (e) {
            result.ok = false;
            result.message = ["网络错误"];
            console.log(e);
        }
    }
    if (callback) {
        callback(result);
    }
    return result;
}