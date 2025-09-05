import * as React from "react";
import getConfig from "./Config.jsx";



export function CheckUsername(username) {
    if (!username) {
        return "用户名不能为空";
    }
    if (username.length < 2 || username.length > 36) {
        return "用户名长度必须在2到36之间";
    }
    if (!/^[A-Za-z0-9]+$/.test(username)) {
        return "用户名只能包含字母和数字";
    }
    return "";
}

export function CheckPassword(password) {
    if (!password) {
        return "密码不能为空";
    }
    if (password.length < 8 || password.length > 24) {
        return "密码长度必须在8到24之间";
    }
    if (!/[a-z]/.test(password)) {
        return "密码必须包含小写字母";
    }
    if (!/[A-Z]/.test(password)) {
        return "密码必须包含大写字母";
    }
    if (!/\d/.test(password)) {
        return "密码必须包含数字";
    }
    if (!/[!@#$%^&*?_~\-+=.]/.test(password)) {
        return "密码必须包含特殊字符";
    }
    return "";
}

export function CheckNickName(nickname) {
    if (!nickname) {
        return "昵称不能为空";
    }
    if (nickname.length < 2 || nickname.length > 36) {
        return "昵称长度必须在2到36之间";
    }
    return "";
}

export function CheckEmail(email) {
    if (!email) {
        return "邮箱不能为空";
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return "邮箱格式不正确";
    }
    return "";
}

export function CheckPhone(phone) {
    if (!phone) {
        return "手机号不能为空";
    }
    if (!/^\d{11}$/.test(phone)) {
        return "手机号格式不正确";
    }
    return "";
}

export async function Login(mes, callback) {
    const username = mes.username;
    const password = mes.password;
    const setUserid = mes.setUserid;
    var result = {
        ok: true,
        message: "unknown",
        userid: null,
        username: username
    }
    if (!username || !password) {
        result.ok = false;
        result.message = ["请输入用户名和密码"];
    }

    if (result.ok) {
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
                result.message = ["登录成功"];
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
                result.message = ["网络错误", e.toString()];
                console.log(e);
            }
        }
    }
    if (callback) {
        callback(result);
    }
    return result;
}

export async function Register(mes, callback) {
    const username = mes.username;
    const nickname = mes.nickname;
    const password = mes.password;
    const confirmPwd = mes.confirmPwd;
    const email = mes.email;
    const phone = mes.phone;
    var result = {
        ok: true,
        message: "unknown",
        userid: null,
        username: username
    };
    if (!username || !nickname || !password || !email || !phone) {
        result.ok = false;
        result.message = ["请填写所有必填项"];
    }
    if (password !== confirmPwd) {
        result.ok = false;
        result.message = ["两次输入的密码不一致"];
    }

    if (result.ok) {
        try {
            const resp = await fetch(getConfig().apiUrl + "/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, nickname, password, email, phone })
            });
            const data = await resp.json().catch(() => ({}));
            if (!resp.ok || !data || !data.ok) {
                result.ok = false;
                result.message = [data.message, data.detail, "注册失败"];
            }
            else {
                result.ok = true;
                result.message = ["注册成功"];
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
    }
    if (callback) {
        callback(result);
    }
    return result;
}