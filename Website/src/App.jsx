import * as React from "react"
import * as Mui from "@mui/material";
import * as MuiIcons from "@mui/icons-material";
import * as Router from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import { GlobalVarProvider } from "./assets/api/GlobalVars.jsx";
import theme from "./assets/components/Utils/CustomTheme.jsx";
import MTopBar from "./assets/components/TopBar.jsx";
import MIndexContent from "./assets/components/IndexContent.jsx";
import MKnowledge from "./assets/components/Knowledge.jsx";
import MManageDocs from "./assets/components/Knowledge/ManageDocs.jsx";
import MAssistant from "./assets/components/Assistant.jsx";
import Login from "./assets/components/Login.jsx";
import Register from "./assets/components/Register.jsx";

function App() {
    return (
        <GlobalVarProvider><ThemeProvider theme={theme}>
            <Mui.CssBaseline />
            <Router.BrowserRouter>
                <MTopBar title="程序设计竞赛知识问答系统" />
                <Router.Routes>
                    <Router.Route path="/" element={<MIndexContent />} />
                    <Router.Route path="/knowledge" element={<MKnowledge />} />
                    <Router.Route path="/manage-docs" element={<MManageDocs />} />
                    <Router.Route path="/assistant" element={<MAssistant />} />
                    <Router.Route path="/login" element={<Login />} />
                    <Router.Route path="/Register" element={<Register />} />
                </Router.Routes>
            </Router.BrowserRouter>
        </ThemeProvider></GlobalVarProvider>
    );
}

export default App
