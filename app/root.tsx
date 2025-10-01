import {
    Links,
    Meta,
    Scripts,
    ScrollRestoration,
} from "@remix-run/react";
import type { LinksFunction } from "@remix-run/cloudflare";

import { Navbar } from "./layout/navbar/navbar";
import { ThemeProvider, themeStyles } from "~/components/theme-provider/theme-provider"; // ⬅️ adjust path if needed

import "./global.module.css";
import "./reset.module.css";

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

            {/* Tokens + local @font-face rules from your theme-provider */}
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
        </ThemeProvider>

        {/* Sync theme from localStorage / prefers-color-scheme on client */}
        <script
            dangerouslySetInnerHTML={{
                __html: `
(function(){
  try {
    var t = localStorage.getItem('theme');
    if (!t) {
      t = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    document.documentElement.style.setProperty('color-scheme', t);
    document.body.setAttribute('data-theme', t);
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
