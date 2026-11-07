import {
    Links,
    Outlet,
    Meta,
    Scripts,
    ScrollRestoration,
    useLoaderData,
} from "@remix-run/react";
import type { LinksFunction, LoaderFunctionArgs } from "@remix-run/cloudflare";
import { useState } from "react";

import { Navbar } from "./layout/navbar/navbar";
import { ThemeProvider, themeStyles } from "~/components/theme-provider/theme-provider";
import type { ThemeName } from "~/components/theme-provider/theme";
import "./global.module.css";
import "./reset.module.css";
import styles from "./root.module.css";
import favicon from "~/assets/favicon.svg";

export const links: LinksFunction = () => [
    { rel: "icon", href: favicon, type: "image/svg+xml" },
    // { rel: "preconnect", href: "https://fonts.googleapis.com" },
    // { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
    // {
    //   rel: "stylesheet",
    //   href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
    // },
];

// Read the theme cookie on the server so the first paint is already the right theme
export const loader = ({ request }: LoaderFunctionArgs) => {
    const saved = request.headers.get("Cookie")?.match(/(?:^|;\s*)theme=(light|dark)\b/)?.[1];
    return { theme: (saved ?? "dark") as ThemeName };
};

export default function App() {
    const { theme: savedTheme } = useLoaderData<typeof loader>();
    const [theme, setTheme] = useState<ThemeName>(savedTheme);

    const toggleTheme = () => {
        const next = theme === "dark" ? "light" : "dark";
        setTheme(next);
        document.cookie = `theme=${next}; path=/; max-age=31536000; samesite=lax`;
    };

    return (
        <html lang="en" style={{ colorScheme: theme }}>
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

        <body data-theme={theme}>
        <ThemeProvider theme={theme} toggleTheme={toggleTheme}>
            <Navbar />
            <main
                id="main-content"
                className={styles.container}
                tabIndex={-1}
            >
                <Outlet />
            </main>
        </ThemeProvider>

        <ScrollRestoration />
        <Scripts />
        </body>
        </html>
    );
}
