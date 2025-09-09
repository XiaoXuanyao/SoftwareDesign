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
            const resp = await fetch(getConfig().apiUrl + "/knowledge/query", {
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
            const resp = await fetch(getConfig().apiUrl + "/knowledge/create", {
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
                const resp = await fetch(getConfig().apiUrl + "/knowledge/delete", {
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

export async function uploadDocs(mes, callback) {
    const formData = mes.formData;
    const setProgress = mes.setProgress;

    try {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", getConfig().apiUrl + "/knowledge/doc/upload", true);

        xhr.upload.onprogress = (event) => {
            if (event.lengthComputable) {
                const percentComplete = Math.round((event.loaded / event.total) * 100);
                setProgress(percentComplete);
            }
        };

        xhr.onload = function () {
            callback({
                ok: xhr.status === 200,
                message: xhr.status === 200 ? ["上传成功"] : ["上传失败"]
            })
        }

        xhr.onerror = function () {
            callback({
                ok: false,
                message: ["网络错误"]
            })
        }
        
        xhr.send(formData);
    }
    catch (e) {
        callback({
            ok: false,
            message: ["网络错误"]
        });
        console.log(e);
    }
}

export async function queryDocs(mes, callback) {
    const userid = mes.userid;
    const keyword = mes.keyword || "";

    let result = {
        ok: true,
        message: ["unknown"],
        docs: null
    };

    if (!userid) {
        result.ok = false;
        result.message = ["用户未登录"];
    }

    if (result.ok) {
        try {
            const resp = await fetch(getConfig().apiUrl + "/knowledge/doc/query", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userid, keyword })
            });
            const data = await resp.json().catch(() => ({}));
            if (!resp.ok || !data || !data.ok) {
                result.ok = false;
                result.message = [data.message, data.detail, "检索失败"];
            } else {
                result.ok = true;
                result.message = ["检索成功"];
                result.docs = data.docs;
                console.log(data);
            }
        } catch (e) {
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

export async function deleteDocs(mes, callback) {
    const docids = mes.docids;
    const userid = mes.userid;
    
    let result = {
        ok: true,
        message: ["unknown"]
    };

    if (!userid) {
        result.ok = false;
        result.message = ["用户未登录"];
    }
    if (!docids || !docids.length) {
        result.ok = false;
        result.message = ["未选择要删除的文档"];
    }

    if (result.ok) {
        try {
            const resp = await fetch(getConfig().apiUrl + "/knowledge/doc/delete", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userid, docids })
            });
            const data = await resp.json().catch(() => ({}));
            if (!resp.ok || !data || !data.ok) {
                result.ok = false;
                result.message = [data.message, data.detail, "删除失败"];
            } else {
                result.ok = true;
                result.message = ["删除成功"];
            }
        } catch (e) {
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