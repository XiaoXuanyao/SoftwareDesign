import * as React from "react";
import * as Mui from "@mui/material";
import * as MuiIcons from "@mui/icons-material";
import SearchBox from "./SearchBox.jsx";
import TrendingSearches from "./Index/TrendingSearches.jsx";
import WeekTopics from "./Index/WeekTopics.jsx";

function MIndexContent() {
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
                flexDirection: "column",
                justifyContent: "center",
                alignContent: "center",
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
                程序设计竞赛知识问答系统
            </Mui.Typography>
            <Mui.Divider sx={{ mb: 4 }} />

            <SearchBox
                width="100%"
                multiline
                sx={{
                    borderRadius: 2,
                    mb: 4,
                    boxShadow: 2,
                }}
                tfsx={{ display: "flex", flex: 1 }}
            />

            <Mui.Typography variant="body1">
                <MuiIcons.HelpOutline fontSize="14" sx={{ mr: 2 }}/>
                本系统面向准备参加程序设计竞赛的学习者，提供基于文本问答的竞赛知识教学、
                智能问答与回复，可帮助同学们更高效地学习与掌握程序设计竞赛相关知识。
            </Mui.Typography>
            
            <Mui.Typography
                variant="h6"
                sx={{ mt: 6, mb: 1, fontWeight: 600 }}
            >
                本周热门搜索
            </Mui.Typography>
            <Mui.Divider sx={{ mb: 2 }} />
            <TrendingSearches />

            <Mui.Typography
                variant="h6"
                sx={{ mt: 6, mb: 1, fontWeight: 600 }}>
                本周热门提问
            </Mui.Typography>
            <Mui.Divider sx={{ mb: 2 }} />
            <WeekTopics />

        </Mui.Box>
    )
}

export default MIndexContent;