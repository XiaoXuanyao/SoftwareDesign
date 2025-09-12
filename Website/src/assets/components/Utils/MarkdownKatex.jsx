import * as React from "react";
import * as Mui from "@mui/material";
import * as MuiIcons from "@mui/icons-material";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex"

function MarkdownKatex(props) {
    const chat = props.chat;
    return (
        <ReactMarkdown
            remarkPlugins={[remarkMath]}
            rehypePlugins={[rehypeKatex]}
            components={{
                p: ({ children }) => (
                    <Mui.Typography variant="body2" sx={{ mb: 1, "&:last-child": { mb: 0 } }}>
                        {children}
                    </Mui.Typography>
                ),
                // 行内代码保持:
                code: ({ inline, children, ...rest }) =>
                    inline ? (
                        <Mui.Box
                            component="code"
                            sx={{
                                px: .5,
                                py: .25,
                                bgcolor: "action.hover",
                                borderRadius: .5,
                                fontSize: "0.85em"
                            }}
                            {...rest}
                        >
                            {children}
                        </Mui.Box>
                    ) : (
                        <Mui.Box
                            component="pre"
                            sx={{
                                m: 0,
                                p: 1.5,
                                bgcolor: "grey.900",
                                color: "grey.100",
                                fontSize: 14,
                                borderRadius: 1,
                                overflow: "auto"
                            }}
                            {...rest}
                        >
                            <code>{children}</code>
                        </Mui.Box>
                    )
            }}
        >
            {chat.message}
        </ReactMarkdown>
    );
}

export default MarkdownKatex;