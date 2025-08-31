import * as React from "react";
import * as Mui from "@mui/material";
import * as MuiIcons from "@mui/icons-material";
import * as Router from "react-router-dom";
import SearchBox from "./SearchBox.jsx";

function MTopBar(props) {
    return (
        <Mui.AppBar>
            <Mui.Toolbar variant="dense" disableGutters>

                <Mui.IconButton edge="start" color="inherit" aria-label="menu" sx={{ ml: 2, mr: 2 }}>
                    <MuiIcons.Menu />
                </Mui.IconButton>
                <Mui.Typography variant="subtitle1" color="inherit" component="div" sx={{ mr: 2, display: { xs: "none", sm: "flex" } }}>
                    {props.title}
                </Mui.Typography>

                <Mui.Button variant="text" href="/" color="inherit" size="medium">
                    <MuiIcons.Home />
                    <Mui.Box component="span" sx={{ mr: 2, display: { xs: "none", sm: "flex" } }}>主页</Mui.Box>
                </Mui.Button>
                <Mui.Button variant="text" href="/knowledge" color="inherit" size="medium">
                    <MuiIcons.Book />
                    <Mui.Box component="span" sx={{ mr: 2, display: { xs: "none", sm: "flex" } }}>知识</Mui.Box>
                </Mui.Button>
                <Mui.Box sx={{ flexGrow: 1, maxWidth: 400, mx: 2, display: { xs: "none", sm: "flex" } }}>
                    <SearchBox sx={{ width: "100%" }} />
                </Mui.Box>


                <Mui.Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Mui.Button variant="text" href="/login" color="inherit" size="medium">
                        <MuiIcons.Login />
                        <Mui.Box component="span" sx={{ display: { xs: "none", sm: "flex" } }}>登录</Mui.Box>
                    </Mui.Button>
                    <Mui.Button variant="text" href="/register" color="inherit" size="medium" sx={{ mr: 2, display: { xs: "none", sm: "flex" }}}>
                        注册
                    </Mui.Button>
                </Mui.Box>

            </Mui.Toolbar>
        </Mui.AppBar>
    );
}

export default MTopBar;
