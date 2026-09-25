import sanitizeHtml from "sanitize-html";

const STYLE_RULES = {
  "*": {
    "font-size": [/^\d{1,3}px$/],
    color: [/^#(0x)?[0-9a-f]+$/i, /^rgb\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}\s*\)$/],
    "text-align": [/^(left|right|center|justify)$/],
    width: [/^\d{1,3}(%|px)$/],
  },
};

export function cleanHtml(input: string) {
  return sanitizeHtml(input, {
    allowedTags: [
      "p", "br", "strong", "b", "em", "i", "u", "s", "h2", "h3",
      "ul", "ol", "li", "blockquote", "hr", "a", "img", "span", "code", "pre",
    ],
    allowedAttributes: {
      a: ["href", "target", "rel"],
      img: ["src", "alt", "style", "data-href", "width", "height"],
      span: ["style"],
      p: ["style"],
      h2: ["style"],
      h3: ["style"],
      li: ["style"],
      blockquote: ["style"],
    },
    allowedSchemes: ["http", "https", "mailto", "tel"],
    allowedStyles: STYLE_RULES,
    transformTags: {
      a: (tagName, attribs) => ({
        tagName,
        attribs: { ...attribs, target: "_blank", rel: "noopener noreferrer" },
      }),
    },
  });
}

export function isHtml(body: string) {
  return /<(p|h2|h3|ul|ol|img|blockquote|hr|div|br)\b/i.test(body);
}

/** Old posts were plain text with [사진N] markers; show them in the editor as HTML. */
export function textToHtml(body: string, images: string[] = []) {
  const escape = (value: string) =>
    value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  const used = new Set<number>();
  const blocks = body
    .replace(/\r\n/g, "\n")
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block) => {
      const match = block.match(/^\[사진\s*(\d+)\]$/);
      if (match) {
        const index = Number(match[1]) - 1;
        const src = images[index];
        if (!src) return "";
        used.add(index);
        return `<img src="${src}" alt="">`;
      }
      return `<p>${escape(block).replace(/\n/g, "<br>")}</p>`;
    })
    .filter(Boolean);

  const rest = images.filter((_, index) => !used.has(index)).map((src) => `<img src="${src}" alt="">`);
  return [...blocks, ...rest].join("\n") || "<p></p>";
}
