import * as React from "react";
import * as Mui from "@mui/material";
import * as MuiIcons from "@mui/icons-material";
import AppendedDocsList from "../ManageSets/AppendedDocsList.jsx";
import AppendedWebsitesList from "../ManageSets/AppendedWebsitesList.jsx";
import FilterFiles from "../ManageSets/FilterDocs.jsx";

export default function MManageSet(props) {
    const open = props.open;
    const setOpen = props.setOpen;
    const selectedSet = props.selectedSet ? props.selectedSet : {
        collectionname: "知识库管理",
        description: "知识库介绍。"
    };

    const [dirty, setDirty] = React.useState(true);
    const [selectedAppendedMesType, setSelectedAppendedMesType] = React.useState("doc");
    const [status, setStatus] = React.useState("idle");
    const [message, setMessage] = React.useState("");

    React.useEffect(() => {
        if (!open) return;
        setDirty(true);
    }, [open]);

    const buttonStyle = {
        "&:hover": {
            color: "white",
        }
    };
    
    const alertStyle = {
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    };

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
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                p: 4
            }}>
                <Mui.DialogTitle>{selectedSet.collectionname}</Mui.DialogTitle>
                <Mui.Typography variant="body2" sx={{ mb: 2 }}>
                    {selectedSet.description ? selectedSet.description : "暂无描述"}
                </Mui.Typography>
                <Mui.Divider sx={{ width:"100%", my: 1, alignSelf:"stretch" }} />

                <Mui.Box>
                    <Mui.Button
                        variant="contained"
                        sx={{ 
                            m: 1,
                            "&:hover": { color: "text.onprimary" }
                        }}
                        onClick={() => setSelectedAppendedMesType("doc")}
                    >
                        管理文档
                    </Mui.Button>
                    <Mui.Button
                        variant="contained"
                        sx={{ 
                            m: 1,
                            "&:hover": { color: "text.onprimary" }
                        }}
                    >
                        管理网页
                    </Mui.Button>
                    <Mui.Button
                        variant="outlined"
                        color="error"
                        sx={{ 
                            m: 1,
                            "&:hover": {
                                color: "error.main",
                                borderColor: "error.main"
                            }
                        }}
                        onClick={() => { setSelectedAppendedMesType("website") }}
                    >
                        删除知识库
                    </Mui.Button>
                    <Mui.Button
                        variant="outlined"
                        onClick={() => setOpen(false)}
                        sx={{ 
                            m: 1,
                            "&:hover": {
                                color: "primary.main",
                                borderColor: "primary.main"
                            }
                        }}
                    >
                        关闭
                    </Mui.Button>
                </Mui.Box>

                <Mui.Divider sx={{ width:"100%", my: 1, alignSelf:"stretch" }} />

                <Mui.Box sx={{ width: "100%", mt: 1, mb: 2 }}>
                    {selectedAppendedMesType === "doc" &&
                        <Mui.Box sx={{
                            display: "flex",
                            flexDirection: { xs: "column", sm: "row" },
                            gap: 2
                        }}>
                            <AppendedDocsList
                                buttonStyle={buttonStyle}
                                dirty={dirty}
                                selectedSet={selectedSet}
                            />
                            <Mui.Divider orientation="vertical" flexItem />
                            <FilterFiles
                                dirty={dirty}
                                setDirty={setDirty}
                                buttonStyle={buttonStyle}
                                selectedSet={selectedSet}
                                setStatus={setStatus}
                                setMessage={setMessage}
                            />
                        </Mui.Box>
                    }
                    {selectedAppendedMesType === "website" &&
                        <AppendedWebsitesList
                            selectedSet={selectedSet}
                            setSelectedFile={() => { }}
                        />
                    }
                </Mui.Box>

                {status === "loading" && (
                    <Mui.Alert severity="info" sx={alertStyle}>{message}</Mui.Alert>
                )}
                {status === "warning" && (
                    <Mui.Alert severity="warning" sx={alertStyle}>{message}</Mui.Alert>
                )}
                {status === "error" && (
                    <Mui.Alert severity="error" sx={alertStyle}>{message}</Mui.Alert>
                )}
                {status === "success" && (
                    <Mui.Alert severity="success" sx={alertStyle}>{message}</Mui.Alert>
                )}

            </Mui.Box>
        </Mui.Dialog>
    );
}