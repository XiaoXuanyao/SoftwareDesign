import * as React from "react";
import * as Mui from "@mui/material";
import * as MuiIcons from "@mui/icons-material";
import mainImg from "../images/main.png";
import { Login, CheckUsername, CheckPassword } from "../api/Auth.jsx";
import { GlobalVarsContext } from "../api/GlobalVars.jsx";

function MIndexContent() {
    const [username, setUsername] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [loginStatus, setLoginStatus] = React.useState(null);
    const [loginMessage, setLoginMessage] = React.useState("");
    const [onProcess, setOnProcess] = React.useState(false);

    const loginCallback = (result) => {
        if (result.ok) {
            setLoginStatus("success");
            setLoginMessage("登录成功");
            const userdata = result.userdata || {};
            sessionStorage.setItem("userdata.userid", userdata.userid);
            sessionStorage.setItem("userdata.username", userdata.username);
            sessionStorage.setItem("userdata.nickname", userdata.nickname);
            sessionStorage.setItem("userdata.role", userdata.role);
            setTimeout(() => {
                setOnProcess(false);
                window.location.href = "/";
            }, 600);
        }
        else {
            setOnProcess(false);
            setLoginStatus("error");
            setLoginMessage(result.message[0] || "登录失败");
        }
    };

    const startLogin = () => {
        var error = CheckUsername(username) || CheckPassword(password);
        if (error) {
            setLoginStatus("error");
            setLoginMessage(error);
            return;
        }
        setLoginStatus("loading");
        setOnProcess(true);
        Login(
            {
                username,
                password
            },
            loginCallback
        );
    };

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
                flexDirection: "row",
                justifyContent: "center",
                alignContent: "center",
                textAlign: "center"
            }}
        >

            <Mui.Box
                component="img"
                src={mainImg}
                alt="主图片"
                sx={{
                    width: "40%",
                    borderRadius: 2,
                    mr: 8,
                    display: { xs: "none", sm: "none", md: "block" }
                }}
            />
            <Mui.Box
                component="form"
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    flex: 1,
                    maxWidth: 320,
                    textAlign: "center"
                }}
            >
                <Mui.Typography
                    variant="h4"
                    sx={{
                        mb: 4,
                        fontWeight: 700,
                        textShadow: "1px 1px 0.5px rgba(0, 0, 0, 0.5)",
                        
                    }}>
                    登录
                </Mui.Typography>
                <Mui.Divider sx={{ mb: 4 }} />
                <Mui.TextField
                    label="用户名"
                    variant="outlined"
                    size="small"
                    fullWidth
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    sx={{ mb: 2 }}
                />
                <Mui.TextField
                    label="密码"
                    variant="outlined"
                    size="small"
                    type='password'
                    fullWidth
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    sx={{ mb: 4 }}
                    onKeyDown={(e) => { if (e.key === 'Enter') { startLogin(); } }}
                />
                {loginStatus === "loading" && (
                    <Mui.Alert severity="info" sx={{ mb: 2 }}>正在登录...</Mui.Alert>
                )}
                {loginStatus === "error" && (
                    <Mui.Alert severity="error" sx={{ mb: 2 }}>{loginMessage}</Mui.Alert>
                )}
                {loginStatus === "success" && (
                    <Mui.Alert severity="success" sx={{ mb: 2 }}>{loginMessage}</Mui.Alert>
                )}
                <Mui.Button
                    type="button"
                    variant="contained"
                    color="primary"
                    onClick={startLogin}
                    sx={{
                        mt: 1,
                        fontWeight: 600,
                        ":hover": {
                            color: "text.onprimary"
                        }
                    }}
                    disabled={onProcess}
                >
                    登录
                </Mui.Button>
                <Mui.Typography variant="body2" sx={{ textAlign: 'center', mt: 1 }}>
                    没有账号？
                    <Mui.Link href="/register" underline="hover" sx={{ ml: 0.5 }}>
                        注册
                    </Mui.Link>
                </Mui.Typography>
            </Mui.Box>

        </Mui.Box>
    )
}

export default MIndexContent;