import * as React from "react";
import getConfig from "./Config.jsx";

export async function Login(mes, callback) {
    const username = mes.username;
    const password = mes.password;
    if (!username || !password) {
        return { ok: false, message: "请输入用户名和密码" };
    }
    var result = {
        ok: false,
        message: "unknown",
        userid: null,
        username: username
    }
    try {
        const resp = await fetch(getConfig().apiUrl + "/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password })
        });
        const data = await resp.json().catch(() => ({}));
        if (!resp.ok || !data || !data.ok) {
            result.ok = false;
            result.message = [data.message, data.detail, "登录失败"];
        }
        else {
            result.ok = true;
            result.message = "登录成功";
            result.userid = data.userid;
            result.username = username;
        }
    } catch (e) {
        if (e.name === "AbortError") {
            result.ok = false;
            result.message = ["请求已取消"];
        }
        else {
            result.ok = false;
            result.message = ["网络错误"];
        }
    }
    if (callback) {
        callback(result);
    }
    return result;
}