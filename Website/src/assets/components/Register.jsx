import * as React from "react";
import * as Mui from "@mui/material";
import * as MuiIcons from "@mui/icons-material";
import mainImg from "../images/main.png";

function MIndexContent() {
    const [account, setAccount] = React.useState("");
    const [nickname, setNickname] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [confirmPwd, setConfirmPwd] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [showPwd, setShowPwd] = React.useState(false);
    const [showPwd2, setShowPwd2] = React.useState(false);
    const [error, setError] = React.useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!account || !nickname || !password || !confirmPwd || !email) {
            setError("请完整填写所有字段");
            return;
        }
        if (password !== confirmPwd) {
            setError("两次输入的密码不一致");
            return;
        }
        setError("");
        console.log("register", { account, nickname, password, email });
        // TODO: 发起实际注册请求
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
                onSubmit={handleSubmit}
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

                <Mui.TextField
                    label="用户名"
                    variant="outlined"
                    size="small"
                    fullWidth
                    value={account}
                    onChange={(e) => setAccount(e.target.value)}
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
                    label="密码"
                    variant="outlined"
                    size="small"
                    type={showPwd ? "text" : "password"}
                    fullWidth
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    InputProps={{
                        endAdornment: (
                            <Mui.IconButton
                                size="small"
                                onClick={() => setShowPwd(v => !v)}
                                edge="end"
                            >
                                {showPwd ? <MuiIcons.VisibilityOff fontSize="small" /> : <MuiIcons.Visibility fontSize="small" />}
                            </Mui.IconButton>
                        )
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
                    InputProps={{
                        endAdornment: (
                            <Mui.IconButton
                                size="small"
                                onClick={() => setShowPwd2(v => !v)}
                                edge="end"
                            >
                                {showPwd2 ? <MuiIcons.VisibilityOff fontSize="small" /> : <MuiIcons.Visibility fontSize="small" />}
                            </Mui.IconButton>
                        )
                    }}
                    sx={{ mb: 2 }}
                />
                {error && (
                    <Mui.Alert severity="error" variant="outlined" sx={{ py: 0.5 }}>
                        {error}
                    </Mui.Alert>
                )}
                <Mui.Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disableElevation
                    sx={{ mt: 4, fontWeight: 600 }}
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