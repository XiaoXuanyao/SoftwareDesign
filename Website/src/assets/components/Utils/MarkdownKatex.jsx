import * as React from "react";
import * as Mui from "@mui/material";
import * as MuiIcons from "@mui/icons-material";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";

function normalizeMathDelimiters(s) {
    if (!s) return "";
    s = s.replace(/[（）【】]/g, (ch) => ({ "（": "(", "）": ")", "【": "[", "】": "]" }[ch] || ch));
    s = s.replace(/\\\s*$/gm, "");
    s = s.replace(/\\\(([\s\S]+?)\\\)/g, (_m, inner) => `$${inner}$`);
    s = s.replace(/\\\[((?:[\s\S])*?)\\\]/g, (_m, inner) => `\n\n$$\n${inner}\n$$\n\n`);
    const looksMath = /\\[A-Za-z]+|[_^]|[=]|[{}]|\\left|\\right|\\operatorname/;
    s = s.replace(/\[([\s\S]+?)\]/g, (m, inner) => (looksMath.test(inner) ? `\n\n$$\n${inner}\n$$\n\n` : m));
    s = s.replace(/\(([\s\S]+?)\)/g, (m, inner) => (looksMath.test(inner) ? `$${inner}$` : m));

    return s;
}

function MarkdownKatex(props) {
    const source = React.useMemo(
        () => normalizeMathDelimiters(props?.chat?.message ?? ""),
        [props?.chat?.message]
    );

    return (
        <Mui.Box sx={{ textAlign: "left" }}>
            <ReactMarkdown
                remarkPlugins={[remarkGfm, remarkMath]}
                rehypePlugins={[[rehypeKatex, { throwOnError: false, strict: "ignore" }]]}
                components={{
                    p: ({ children }) => (
                        <Mui.Typography variant="body2" sx={{ mb: 1, "& .katex-display": { overflowX: "auto" } }}>
                            {children}
                        </Mui.Typography>
                    ),
                    li: ({ children }) => (
                        <li style={{ marginBottom: 6 }}>
                            <Mui.Typography component="span" variant="body2">{children}</Mui.Typography>
                        </li>
                    ),
                    code: ({ inline, children, ...rest }) =>
                        inline ? (
                            <Mui.Box component="code" sx={{ px: .5, py: .25, bgcolor: "action.hover", borderRadius: .5, fontSize: "0.85em" }} {...rest}>
                                {children}
                            </Mui.Box>
                        ) : (
                            <Mui.Box component="pre" sx={{ m: 0, p: 1.5, bgcolor: "grey.900", color: "grey.100", fontSize: 14, borderRadius: 1, overflow: "auto" }} {...rest}>
                                <code>{children}</code>
                            </Mui.Box>
                        )
                }}
            >
                {source}
            </ReactMarkdown>
        </Mui.Box>
    );
}

export default MarkdownKatex;