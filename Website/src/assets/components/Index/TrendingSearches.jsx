import * as React from "react";
import * as Mui from "@mui/material";
import * as MuiIcons from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const rawSearches = [
    { term: "数据结构", hits: 128 },
    { term: "前缀和", hits: 96 },
    { term: "线段树", hits: 210 },
    { term: "FFT", hits: 74 },
    { term: "线性代数", hits: 132 },
];

export default function TrendingSearches() {
    const list = React.useMemo(() => [...rawSearches].sort((a, b) => b.hits - a.hits), []);
    const navigate = useNavigate();
    const handleSearch = (term) => {
        if (!term) return;
        navigate(`/assistant?query=${encodeURIComponent(term)}`);
    }

    const medal = (rank) => {
        if (rank === 1) return { bg: "#FFD700", fg: "#000", icon: <MuiIcons.EmojiEvents fontSize="small" /> }; // 金
        if (rank === 2) return { bg: "#C0C0C0", fg: "#000", icon: <MuiIcons.EmojiEvents fontSize="small" /> }; // 银
        if (rank === 3) return { bg: "#CD7F32", fg: "#fff", icon: <MuiIcons.EmojiEvents fontSize="small" /> }; // 铜
        return { bg: "action.hover", fg: "text.primary", icon: null };
    };

    return (
        <Mui.Paper elevation={3} sx={{ p: 2, borderRadius: 2 }}>
            <Mui.Box sx={{ display: "flex", alignItems: "center", mb: 1.5 }}>
                <MuiIcons.TrendingUp color="primary" sx={{ mr: 1 }} />
                <Mui.Typography variant="h6" sx={{ fontWeight: 700 }}>
                    热门搜索排行榜
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
                                <Mui.Chip size="small" color="primary" variant="outlined" label={`搜索 ${item.hits}`} />
                            }
                            sx={{
                                px: 1,
                                borderRadius: 1.5,
                                "&:hover": { bgcolor: "action.hover" },
                                mb: 0.5,
                            }}
                        >
                            <Mui.ListItemButton onClick={() => handleSearch(item.term)} sx={{ py: 0.75 }}>
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
                                        <Mui.Typography variant="body1" sx={{
                                            fontWeight: rank <= 3 ? 700 : 500 }}>
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
                            </Mui.ListItemButton>
                        </Mui.ListItem>
                    );
                })}
            </Mui.List>
        </Mui.Paper>
    );
}
