import * as React from "react";
import * as Mui from "@mui/material";
import * as MuiIcons from "@mui/icons-material";

export default function MManageSet(props) {
    const open = props.open;
    const setOpen = props.setOpen;
    const selectedSet = props.selectedSet;
    return (
        <Mui.Dialog
            open={open}
            onClose={() => setOpen(false)}
            fullWidth
            slotProps={{
                paper: {
                    sx: {
                        width: { xs: "95%", sm: "70%", md: "50%"},
                        maxWidth: 2000
                    }
                }
            }}
        >
            <Mui.Box sx={{
                width: "99%",
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "center",
                p: 4
            }}>
                <Mui.DialogTitle>管理知识集</Mui.DialogTitle>
                <Mui.Button onClick={() => setOpen(false)}>关闭</Mui.Button>
                <Mui.Typography sx={{ m: 2 }}>{selectedSet}</Mui.Typography>
            </Mui.Box>
        </Mui.Dialog>
    );
}