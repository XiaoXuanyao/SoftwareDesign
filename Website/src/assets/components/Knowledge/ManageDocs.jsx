import * as React from "react";
import * as Mui from "@mui/material";
import * as MuiIcons from "@mui/icons-material";
import MUploadFiles from "../ManageDocs/UploadFiles";
import MModifyFile from "../ManageDocs/ModifyFile";
import MFilterFiles from "../ManageDocs/FilterFiles";
import { queryDocs } from "../../api/Knowledge";

function MManageDocs(props) {
    const [dirty, setDirty] = React.useState(false);
    const [docs, setDocs] = React.useState([]);
    const [selectedFile, setSelectedFile] = React.useState(null);
    const [keyword, setKeyword] = React.useState("")

    React.useEffect(() => {
        queryDocs(
            {
                userid: sessionStorage.getItem("userdata.userid"),
                keyword
            },
            (res) => {
                if (res.ok) {
                    setDocs(res.docs || []);
                }
            }
        );
    }, [dirty, keyword]);

    const deleteFiles = (files) => {
        
    };

    const buttonStyle = {
        "&:hover": {
            color: "white",
        }
    };

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
                textAlign: "center",
            }}
        >
            <Mui.Typography
                variant="h4"
                sx={{
                    mb: 4,
                    fontWeight: 700,
                    textShadow: "1px 1px 0.5px rgba(0, 0, 0, 0.5)",
                }}
            >
                文档管理
            </Mui.Typography>
            <Mui.Divider sx={{ mb: 4 }} />

            <Mui.Box
                sx={{
                    display: "flex",
                    flexDirection: { xs: "column", md: "row" },
                    alignItems: "flex-start",
                    gap: 1,
                }}
            >
                <Mui.Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        width: { xs: "100%", md: "40%" },
                        alignItems: "stretch",
                        textAlign: "left",
                    }}
                >
                    <MUploadFiles
                        buttonStyle={buttonStyle}
                        setDirty={setDirty}
                    />
                    <MModifyFile
                        selectedFile={selectedFile}
                        setSelectedFile={setSelectedFile}
                        buttonStyle={buttonStyle}
                    />
                </Mui.Box>
                <Mui.Divider orientation="vertical" flexItem />
                <MFilterFiles
                    docs={docs}
                    setSelectedFile={setSelectedFile}
                    keyword={keyword}
                    setKeyword={setKeyword}
                />
            </Mui.Box>
        </Mui.Box>
    );
}

export default MManageDocs;
