import * as React from "react";
import * as Mui from "@mui/material";
import * as MuiIcons from "@mui/icons-material";

const topics = [
    "给定最多 2e5 次区间加与区间求和操作，如何选择数据结构并保证 O(log n) 复杂度？",
    "如何快速判断一道题适合用线段树还是树状数组？",
    "在处理字符串模式匹配时，何时应选用 KMP，何时用 Z 函数或后缀数组？",
    "典型区间 DP（如石子合并）如何优化到 O(n^2)？四边形不等式与决策单调性判定步骤是什么？",
    "Dijkstra 与 0-1 BFS、SPFA 的适用场景及性能差异有哪些？",
    "如何用单调栈在线求解“下一个更大元素”扩展到区间最大子面积（柱状图最大矩形）？",
    "给定大量离线查询“序列中第 k 小”的问题，如何用可持久化线段树或整体二分解决？",
    "高精度乘法在需要取模时怎样用快速幂与快速卷积（FFT/NTT）提升速度？"
];

// 稳定哈希 -> 模拟热度（50~249）
function hotScore(s) {
    let h = 0;
    for (let i = 0; i < s.length; i++) h = (h * 131 + s.charCodeAt(i)) >>> 0;
    return 50 + (h % 200);
}

function medal(rank) {
    if (rank === 1) return { bg: "#FFD700", fg: "#000", icon: <MuiIcons.EmojiEvents fontSize="small" /> }; // 金
    if (rank === 2) return { bg: "#C0C0C0", fg: "#000", icon: <MuiIcons.EmojiEvents fontSize="small" /> }; // 银
    if (rank === 3) return { bg: "#CD7F32", fg: "#fff", icon: <MuiIcons.EmojiEvents fontSize="small" /> }; // 铜
    return { bg: "action.hover", fg: "text.primary", icon: null };
}

export default function WeekTopics() {
    const list = React.useMemo(
        () => topics.map(t => ({ term: t, hits: hotScore(t) })).sort((a, b) => b.hits - a.hits),
        []
    );

    return (
        <Mui.Paper elevation={3} sx={{ p: 2, borderRadius: 2 }}>
            <Mui.Box sx={{ display: "flex", alignItems: "center", mb: 1.5 }}>
                <MuiIcons.Whatshot color="error" sx={{ mr: 1 }} />
                <Mui.Typography variant="h6" sx={{ fontWeight: 700 }}>
                    本周热门话题排行榜
                </Mui.Typography>
            </Mui.Box>

            <Mui.List dense disablePadding>
                {list.map((item, idx) => {
                    const rank = idx + 1;
                    const m = medal(rank);
                    return (
                        <Mui.ListItem
                            key={item.term}
                            secondaryAction={
                                // 与热门搜索保持相同的 Chip 样式（仅文案不同）
                                <Mui.Chip size="small" color="primary" variant="outlined" label={`热度 ${item.hits}`} />
                            }
                            sx={{
                                px: 1,
                                borderRadius: 1.5,
                                "&:hover": { bgcolor: "action.hover" },
                                mb: 0.5,
                            }}
                        >
                            <Mui.ListItemAvatar>
                                <Mui.Avatar
                                    variant="circular"
                                    sx={{
                                        width: 32,
                                        height: 32,
                                        bgcolor: m.bg,
                                        color: m.fg,
                                        fontSize: 14,
                                        fontWeight: 700,
                                    }}
                                >
                                    {m.icon ? m.icon : rank}
                                </Mui.Avatar>
                            </Mui.ListItemAvatar>
                            <Mui.ListItemText
                                primary={
                                    <Mui.Typography
                                        variant="body1"
                                        sx={{ fontWeight: rank <= 3 ? 700 : 500 }}
                                    >
                                        {item.term}
                                    </Mui.Typography>
                                }
                                secondary={
                                    rank <= 3 ? (
                                        <Mui.Typography variant="caption" color="text.secondary">
                                            TOP {rank}
                                        </Mui.Typography>
                                    ) : null
                                }
                            />
                        </Mui.ListItem>
                    );
                })}
            </Mui.List>
        </Mui.Paper>
    );
}