import * as React from "react";
import * as Mui from "@mui/material";
import * as MuiIcons from "@mui/icons-material";

const searches = ["数据结构", "前缀和", "线段树", "FFT", "线性代数"];

function TrendingSearches() {

    return (
        <Mui.Grid
            container
            spacing={2}
            sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center"
            }}
        >
            {searches.map((topic) => (
                <Mui.Grid
                    key={topic}
                    sx={{
                        bgcolor: "primary.main",
                        color: "text.onprimary",
                        borderRadius: 2,
                        boxShadow: 2,
                        textAlign: "center",
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