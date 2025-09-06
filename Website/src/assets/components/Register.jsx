import * as React from "react";
import * as Mui from "@mui/material";
import * as MuiIcons from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import {
    Register,
    CheckUsername,
    CheckNickName,
    CheckPassword,
    CheckEmail,
    CheckPhone
} from "../api/Auth.jsx";

function MIndexContent() {
    const [username, setUsername] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [confirmPwd, setConfirmPwd] = React.useState("");
    const [nickname, setNickname] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [phone, setPhone] = React.useState("");
    const [showPwd, setShowPwd] = React.useState(false);
    const [showPwd2, setShowPwd2] = React.useState(false);
    const [registerStatus, setRegisterStatus] = React.useState("");
    const [registerMessage, setRegisterMessage] = React.useState("");
    const navigate = useNavigate();

    const registerCallback = (result) => {
        if (result.ok) {
            setRegisterStatus("success");
            setRegisterMessage("注册成功");
            navigate("/login");
        }
        else {
            setRegisterStatus("error");
            setRegisterMessage(result.message[0] || "注册失败");
        }
    };

    const startRegister = () => {
        const error = CheckUsername(username) || CheckNickName(nickname)
            || CheckPassword(password) || CheckEmail(email) || CheckPhone(phone);
        if (error) {
            setRegisterStatus("error");
            setRegisterMessage(error);
            return;
        }
        setRegisterStatus("loading");
        Register(
            {
                username,
                nickname,
                password,
                confirmPwd,
                email,
                phone
            },
            registerCallback
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
                component="form"
                noValidate
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 1,
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
                        textShadow: "1px 1px 0.5px rgba(0, 0, 0, 0.5)"
                    }}>
                    注册
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
                    label="昵称"
                    variant="outlined"
                    size="small"
                    fullWidth
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    sx={{ mb: 2 }}
                />
                <Mui.TextField
                    label="密码"
                    variant="outlined"
                    size="small"
                    type={showPwd ? "text" : "password"}
                    fullWidth
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    slotProps={{
                        input: {
                            endAdornment: (
                                <Mui.IconButton
                                    size="small"
                                    onClick={() => setShowPwd(v => !v)}
                                    edge="end"
                                >
                                    {showPwd ? <MuiIcons.VisibilityOff fontSize="small" /> : <MuiIcons.Visibility fontSize="small" />}
                                </Mui.IconButton>
                            )
                        }
                    }}
                    sx={{ mb: 2 }}
                />
                <Mui.TextField
                    label="确认密码"
                    variant="outlined"
                    size="small"
                    type={showPwd2 ? "text" : "password"}
                    fullWidth
                    value={confirmPwd}
                    onChange={(e) => setConfirmPwd(e.target.value)}
                    slotProps={{
                        input: {
                            endAdornment: (
                                <Mui.IconButton
                                    size="small"
                                    onClick={() => setShowPwd2(v => !v)}
                                    edge="end"
                                >
                                    {showPwd2 ? <MuiIcons.VisibilityOff fontSize="small" /> : <MuiIcons.Visibility fontSize="small" />}
                                </Mui.IconButton>
                            )
                        }
                    }}
                    sx={{ mb: 2 }}
                />
                <Mui.TextField
                    label="邮箱"
                    type="email"
                    variant="outlined"
                    size="small"
                    fullWidth
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    sx={{ mb: 2 }}
                />
                <Mui.TextField
                    label="手机号"
                    type="tel"
                    variant="outlined"
                    size="small"
                    fullWidth
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    sx={{ mb: 2 }}
                />
                {registerStatus === "loading" && (
                    <Mui.Alert severity="info" sx={{ mb: 2 }}>正在注册...</Mui.Alert>
                )}
                {registerStatus === "error" && (
                    <Mui.Alert severity="error" sx={{ mb: 2 }}>{registerMessage}</Mui.Alert>
                )}
                {registerStatus === "success" && (
                    <Mui.Alert severity="success" sx={{ mb: 2 }}>{registerMessage}</Mui.Alert>
                )}
                <Mui.Button
                    type="button"
                    variant="contained"
                    color="primary"
                    onClick={startRegister}
                    sx={{
                        mt: 4,
                        fontWeight: 600,
                        ":hover": {
                            color: "text.onprimary"
                        }
                    }}
                >
                    确认注册
                </Mui.Button>
                <Mui.Typography variant="body2" sx={{ textAlign: "center" }}>
                    已有账号？
                    <Mui.Link href="/login" underline="hover" sx={{ ml: 0.5 }}>
                        去登录
                    </Mui.Link>
                </Mui.Typography>
            </Mui.Box>

        </Mui.Box>
    )
}

export default MIndexContent;