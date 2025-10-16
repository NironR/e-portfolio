import {
    Links,
    Outlet,
    Meta,
    Scripts,
    ScrollRestoration,
} from "@remix-run/react";
import type { LinksFunction } from "@remix-run/cloudflare";

import { Navbar } from "./layout/navbar/navbar";
import { ThemeProvider, themeStyles } from "~/components/theme-provider/theme-provider";
import Home from "~/routes/home/home";
import "./global.module.css";
import "./reset.module.css";
import styles from "./root.module.css";

export const links: LinksFunction = () => [
    // { rel: "preconnect", href: "https://fonts.googleapis.com" },
    // { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
    // {
    //   rel: "stylesheet",
    //   href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
    // },
];

export default function App() {
    return (
        <html lang="en">
        <head>
            <meta charSet="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <style
                id="theme-styles"
                dangerouslySetInnerHTML={{ __html: themeStyles }}
            />

            <Meta />
            <Links />
        </head>

        {/* SSR default theme; will be updated by the inline script below */}
        <body data-theme="dark">
        <ThemeProvider theme="dark">
            <Navbar />
            <main
                id="main-content"
                className={styles.container}
                tabIndex={-1}
            >
                <Home />
                <Outlet />
            </main>
        </ThemeProvider>

        {/* Sync theme to match the SSR/default set in root (ThemeProvider/body) */}
        <script
            dangerouslySetInnerHTML={{
                __html: `
(function(){
  try {
    var t = document.body.getAttribute('data-theme') || 'dark';
    if (t !== 'dark' && t !== 'light') { t = 'dark'; }
    document.documentElement.style.setProperty('color-scheme', t);
    document.body.setAttribute('data-theme', t);
    try { localStorage.setItem('theme', t); } catch (e) {}
  } catch (e) {}
})();
`,
            }}
        />

        <ScrollRestoration />
        <Scripts />
        </body>
        </html>
    );
}
