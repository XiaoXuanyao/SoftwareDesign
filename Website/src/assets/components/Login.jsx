import * as React from "react";
import * as Mui from "@mui/material";
import * as MuiIcons from "@mui/icons-material";
import mainImg from "../images/main.png";

function MIndexContent() {
    const [account, setAccount] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [showPwd, setShowPwd] = React.useState(false);

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
                onSubmit={(e) => {
                    e.preventDefault();
                    // TODO: 执行登录逻辑
                    console.log("login", { account, password });
                }}
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
                <Mui.TextField
                    label="账号"
                    variant="outlined"
                    size="small"
                    fullWidth
                    value={account}
                    onChange={(e) => setAccount(e.target.value)}
                    sx={{ mb: 2 }}
                />
                <Mui.TextField
                    label="密码"
                    variant="outlined"
                    size="small"
                    type={showPwd ? 'text' : 'password'}
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
                    sx={{ mb: 4 }}
                />
                <Mui.Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    sx={{ mt: 1, fontWeight: 600 }}
                    disableElevation
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