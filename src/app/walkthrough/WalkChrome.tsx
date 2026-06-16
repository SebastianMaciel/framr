import Link from "next/link";

type Props = {
  lang: "en" | "es";
  children: React.ReactNode;
};

export default function WalkChrome({ lang, children }: Props) {
  return (
    <div className="wk">
      <header className="wk-top">
        <Link href="/" className="wk-brand">
          FRAMR.
        </Link>
        <span className="wk-top-right">
          <span className="wk-badge">WALKTHROUGH</span>
          <span className="wk-lang">
            <Link
              href="/walkthrough"
              className={lang === "en" ? "on" : ""}
              aria-current={lang === "en" ? "page" : undefined}
            >
              EN
            </Link>
            <Link
              href="/walkthrough/es"
              className={lang === "es" ? "on" : ""}
              aria-current={lang === "es" ? "page" : undefined}
            >
              ES
            </Link>
          </span>
        </span>
      </header>
      {children}
      <footer className="wk-bottom">
        <span>FRAMR. WALKTHROUGH</span>
        <span>
          <Link href="/">← BACK TO APP</Link> · WEBP · Q92 · NO UPLOAD.
        </span>
      </footer>
    </div>
  );
}
