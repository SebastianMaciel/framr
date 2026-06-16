import { codeToHtml } from "shiki";

type Props = {
  code: string;
  lang?: "tsx" | "typescript" | "html" | "css";
};

export async function Code({ code, lang = "tsx" }: Props) {
  const html = await codeToHtml(code, {
    lang,
    theme: "github-dark",
  });
  return (
    <div
      className="wk-code"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

/**
 * Static, hand-formatted ASCII file tree. The HTML is hardcoded in the call
 * site (no user input, no remote data) so injecting it is safe.
 */
export function Tree({ html }: { html: string }) {
  return (
    <div className="wk-tree" dangerouslySetInnerHTML={{ __html: html }} />
  );
}
