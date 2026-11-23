import LangToggle from "./LangToggle";
import T from "./T";

// Header for pages other than the homepage: the name links home.
export default function SubHeader() {
  return (
    <header className="site-header">
      <div className="wrap">
        <a href="/" className="site-name">
          <T en="Peng Cheng" zh="程鹏" />
        </a>
        <nav className="header-nav" aria-label="Site sections">
          <a href="/">
            <T en="home" zh="首页" />
          </a>
          <a href="/failures">
            <T en="failures" zh="失败记录" />
          </a>
          <LangToggle />
        </nav>
      </div>
    </header>
  );
}
