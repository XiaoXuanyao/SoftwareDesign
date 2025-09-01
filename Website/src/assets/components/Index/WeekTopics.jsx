import * as React from "react";
import * as Mui from "@mui/material";
import * as MuiIcons from "@mui/icons-material";

const topics = [
    "给定最多 2e5 次区间加与区间求和操作，如何选择数据结构并保证 O(log n) 复杂度？",
    "如何快速判断一道题适合用线段树还是树状数组？分别在哪些操作组合下更优？",
    "在处理字符串模式匹配时，何时应选用 KMP，何时用 Z 函数或后缀数组？",
    "典型区间 DP（如石子合并）如何优化到 O(n^2)？四边形不等式与决策单调性判定步骤是什么？",
    "Dijkstra 与 0-1 BFS、SPFA 的适用场景及性能差异有哪些？什么时候换成双端队列可以降复杂度？",
    "如何用单调栈在线求解“下一个更大元素”扩展到区间最大子面积（柱状图最大矩形）？",
    "给定大量离线查询“序列中第 k 小”的问题，如何用可持久化线段树或整体二分解决？",
    "高精度乘法在需要取模时怎样用快速幂与快速卷积（FFT/NTT）提升速度？常见精度陷阱有哪些？"
];

function TrendingSearches() {
    return (
        <Mui.Grid
            container
            spacing={2}
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center"
            }}
        >
            {topics.map((topic) => (
                <Mui.Grid
                    key={topic}
                    sx={{
                        bgcolor: "background.default",
                        color: "text.onpaper",
                        borderRadius: 2,
                        boxShadow: 2,
                        textAlign: "left",
                        padding: 1
                    }}
                >
                    {topic}
                </Mui.Grid>
            ))}
        </Mui.Grid>
    )
}

export default TrendingSearches;