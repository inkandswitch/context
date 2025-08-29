import { HighlightStyle, syntaxHighlighting } from "@codemirror/language";
import { EditorView } from "@codemirror/view";
import { tags } from "@lezer/highlight";

const MARKDOWN_STYLES: Record<string, any> = {
  "&": {},
  "&.cm-editor.cm-focused": {
    outline: "none",
  },
  "&.cm-editor": {
    height: "100%",
  },
  ".cm-scroller": {
    height: "100%",
  },
  ".cm-content": {
    height: "100%",
    margin: "0",
    // Justified text makes it look more like the I&S web essay template,
    // but doesn't feel right for most documents.
    // textAlign: "justify",
    textWrap: "pretty",
    lineHeight: "1.5rem",
  },
  ".cm-content li": {
    marginBottom: 0,
  },
  ".cm-activeLine": {
    backgroundColor: "inherit",
  },

  ".frontmatter, .frontmatter *": {
    fontSize: "14px",
    fontFamily: "monospace",
    color: "#666",
    textDecoration: "none",
    fontWeight: "normal",
    lineHeight: "0.8em",
  },

  ".cm-gutters": {
    borderRight: "0",
  },

  ".cm-folded-range-gutter-line-number": {
    display: "none",
  },

  ".cm-folded-range-gutter": {
    background: "white",
    borderRight: "0px",
    width: "40px",
  },

  ".cm-folded-line-widget": {
    background: "white",
    border: "0px",
  },

  ".cm-folded-range": {
    background: "white",
  },

  ".cm-line": {
    paddingRight: "40px",
  },
};

const baseHeadingStyles = {
  fontFamily: '"Merriweather Sans", sans-serif',
  fontWeight: 400,
  textDecoration: "none",
};

const baseCodeStyles = {
  fontFamily: "monospace",
  fontSize: "14px",
};

const markdownStyles = HighlightStyle.define([
  {
    tag: tags.heading1,
    ...baseHeadingStyles,
    fontSize: "1.5rem",
    lineHeight: "2rem",
    marginBottom: "1rem",
    marginTop: "2rem",
  },
  {
    tag: tags.heading2,
    ...baseHeadingStyles,
    fontSize: "1.5rem",
    lineHeight: "2rem",
    marginBottom: "1rem",
    marginTop: "2rem",
  },
  {
    tag: tags.heading3,
    ...baseHeadingStyles,
    fontSize: "1.25rem",
    lineHeight: "1.75rem",
    marginBottom: "1rem",
    marginTop: "2rem",
  },
  {
    tag: tags.heading4,
    ...baseHeadingStyles,
    fontSize: "1.1rem",
    marginBottom: "1rem",
    marginTop: "2rem",
  },
  {
    tag: tags.comment,
    color: "#555",
    fontFamily: "monospace",
  },
  { tag: tags.quote, fontStyle: "italic" },
  {
    tag: tags.strong,
    fontWeight: "bold",
  },
  {
    tag: tags.emphasis,
    fontStyle: "italic",
  },
  {
    tag: tags.strikethrough,
    textDecoration: "line-through",
  },
  {
    tag: [tags.meta],
    fontWeight: 300,
    color: "#999",
    fontFamily: '"Merriweather Sans", sans-serif',
  },
  { tag: tags.keyword, ...baseCodeStyles, color: "#708" },
  {
    tag: [
      tags.atom,
      tags.bool,
      tags.url,
      tags.contentSeparator,
      tags.labelName,
    ],
    ...baseCodeStyles,
    color: "#219",
  },
  { tag: [tags.literal, tags.inserted], ...baseCodeStyles, color: "#164" },
  { tag: [tags.string, tags.deleted], ...baseCodeStyles, color: "#5f67b5" },
  {
    tag: [tags.regexp, tags.escape, tags.special(tags.string)],
    ...baseCodeStyles,
    color: "#e40",
  },
  { tag: tags.definition(tags.variableName), ...baseCodeStyles, color: "#00f" },
  { tag: tags.local(tags.variableName), ...baseCodeStyles, color: "#30a" },
  { tag: [tags.typeName, tags.namespace], ...baseCodeStyles, color: "#085" },
  { tag: tags.className, ...baseCodeStyles, color: "#167" },
  {
    tag: [tags.special(tags.variableName), tags.macroName],
    ...baseCodeStyles,
    color: "#256",
  },
  { tag: tags.definition(tags.propertyName), ...baseCodeStyles, color: "#00c" },
]);

export const theme = (style: "serif" | "sans") => [
  EditorView.theme({
    ...MARKDOWN_STYLES,
    ".cm-content": {
      ...MARKDOWN_STYLES[".cm-content"],
      ...(style === "serif"
        ? {
            fontFamily: '"Merriweather", serif',
            lineHeight: "1.5rem",
          }
        : {
            fontFamily: '"Merriweather Sans", sans-serif',
            lineHeight: "1.25rem",
          }),
    },
  }),
  syntaxHighlighting(markdownStyles),
];
