import React, { createContext, useContext, type ReactNode, type ElementType } from "react";
import { classes, media, type MediaKey } from "~/utils/styles";
import { themes, tokens, type ThemeName, type ThemeTokens } from "~/components/theme-provider/theme";

/* ────────────────────────────────────────────────────────────────────────── */
/* Font files                                                                */
/* ────────────────────────────────────────────────────────────────────────── */

// AraES Nawar (Arabic)
import AraESNawarRegularWoff2 from "~/assets/fonts/AraESNawar-Regular-2bdc6bbd.woff2";
import AraESNawarRegularWoff from '~/assets/fonts/AraESNawar-Regular-d719fefc.woff'

// Blender Pro
import BlenderProBoldWoff2 from "~/assets/fonts/BlenderPro-Bold-eff48238.woff2";
import BlenderProBoldWoff from "~/assets/fonts/BlenderPro-Bold-c11a01ca.woff";
import BlenderProBookWoff2 from "~/assets/fonts/BlenderPro-Book-a6763c9a.woff2";
import BlenderProBookWoff from "~/assets/fonts/BlenderPro-Book-a7182e33.woff";

// Halis GR
import HalisGRBoldWoff2 from "~/assets/fonts/hinted-HalisGR-Bold-f6020258.woff2";
import HalisGRBoldWoff from "~/assets/fonts/hinted-HalisGR-Bold-8554de68.woff";
import HalisGRMediumWoff2 from "~/assets/fonts/hinted-HalisGR-Medium-53fed1cb.woff2";
import HalisGRMediumWoff from "~/assets/fonts/hinted-HalisGR-Medium-19e46d65.woff";

// Proxima Nova
import ProximaNovaRegularWoff2 from "~/assets/fonts/hinted-ProximaNova-Regular-2ccffeb5.woff2";
import ProximaNovaRegularWoff from "~/assets/fonts/hinted-ProximaNova-Regular-91d8c973.woff";
import ProximaNovaSemiboldWoff2 from "~/assets/fonts/hinted-ProximaNova-Semibold-2d0322fb.woff2";
import ProximaNovaSemiboldWoff from "~/assets/fonts/hinted-ProximaNova-Semibold-ab7618fc.woff";

// NanumSquare (Korean)
import NanumSquareRegularWoff2 from "~/assets/fonts/NanumSquareR-d3130837.woff2";
import NanumSquareRegularWoff from "~/assets/fonts/NanumSquareR-da7b93c7.woff";
import NanumSquareBoldWoff2 from "~/assets/fonts/NanumSquareB-ecf3d643.woff";
import NanumSquareBoldWoff from "~/assets/fonts/NanumSquareB-10915764.woff2";

// Refinery 25
import Refinery25SemiboldWoff2 from "~/assets/fonts/Refinery-25SemiBold-dac0d12b.woff2";
import Refinery25SemiboldWoff from "~/assets/fonts/Refinery-25SemiBold-8a4883af.woff";

/* ────────────────────────────────────────────────────────────────────────── */
/* Theme context                                                             */
/* ────────────────────────────────────────────────────────────────────────── */

type ToggleTheme = () => void;

export interface ThemeContextValue {
    theme?: ThemeName | string;
    toggleTheme?: ToggleTheme;
}

export const ThemeContext = createContext<ThemeContextValue>({});

export interface ThemeProviderProps {
    theme?: ThemeName | string;
    children?: ReactNode;
    className?: string;
    as?: ElementType;
    toggleTheme?: ToggleTheme;
    [key: string]: unknown;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
                                                                theme = "dark",
                                                                children,
                                                                className,
                                                                as: Component = "div",
                                                                toggleTheme,
                                                                ...rest
                                                            }) => {
    const parentTheme = useTheme();
    const isRootProvider = !parentTheme.theme;

    return (
        <ThemeContext.Provider
            value={{
                theme,
                toggleTheme: toggleTheme || parentTheme.toggleTheme
            }}
        >
            {isRootProvider && children}
            {!isRootProvider && (
                <Component className={classes(className)} data-theme={theme} {...rest}>
                    {children}
                </Component>
            )}
        </ThemeContext.Provider>
    );
};

export function useTheme(): ThemeContextValue {
    return useContext(ThemeContext);
}

/* ────────────────────────────────────────────────────────────────────────── */
/* Helpers                                                                   */
/* ────────────────────────────────────────────────────────────────────────── */

export function squish(styles: string): string {
    return styles.replace(/\s\s+/g, " ");
}

export function createThemeProperties(theme: ThemeTokens): string {
    return squish(
        Object.keys(theme)
            .map((key) => `--${key}: ${String(theme[key])};`)
            .join("\n")
    );
}

export function createThemeStyleObject(theme: ThemeTokens): React.CSSProperties {
    const style: Record<string, string> = {};
    for (const key of Object.keys(theme)) {
        style[`--${key}`] = String(theme[key]);
    }
    return style as React.CSSProperties;
}

export function createMediaTokenProperties(): string {
    return squish(
        (Object.keys(media) as MediaKey[])
            .map(
                (key) => `
        @media (max-width: ${media[key]}px) {
          :root { ${createThemeProperties(tokens[key])} }
        }`
            )
            .join("\n")
    );
}

/* ────────────────────────────────────────────────────────────────────────── */
/* Layers + Tokens                                                           */
/* ────────────────────────────────────────────────────────────────────────── */

const layerStyles = squish(`@layer theme, base, components, layout;`);

const tokenStyles = squish(`
  :root { ${createThemeProperties(tokens.base)} }
  ${createMediaTokenProperties()}

  [data-theme='dark'] { ${createThemeProperties(themes.dark)} }
  [data-theme='light'] { ${createThemeProperties(themes.light)} }
`);

/* ────────────────────────────────────────────────────────────────────────── */
/* Fonts                                                                     */
/* ────────────────────────────────────────────────────────────────────────── */

const fontStyles = squish(`
  /* Proxima Nova — primary UI text */
  @font-face {
    font-family: "Proxima Nova";
    font-style: normal;
    font-weight: 400;
    font-display: swap;
    src: url(${ProximaNovaRegularWoff2}) format("woff2"),
         url(${ProximaNovaRegularWoff}) format("woff");
  }
  @font-face {
    font-family: "Proxima Nova";
    font-style: normal;
    font-weight: 600;
    font-display: swap;
    src: url(${ProximaNovaSemiboldWoff2}) format("woff2"),
         url(${ProximaNovaSemiboldWoff}) format("woff");
  }

  /* Blender Pro — headings / display */
  @font-face {
    font-family: "Blender Pro";
    font-style: normal;
    font-weight: 400; /* Book */
    font-display: swap;
    src: url(${BlenderProBookWoff2}) format("woff2"),
         url(${BlenderProBookWoff}) format("woff");
  }
  @font-face {
    font-family: "Blender Pro";
    font-style: normal;
    font-weight: 700; /* Bold */
    font-display: swap;
    src: url(${BlenderProBoldWoff2}) format("woff2"),
         url(${BlenderProBoldWoff}) format("woff");
  }

  /* Halis GR — alt headings */
  @font-face {
    font-family: "Halis GR";
    font-style: normal;
    font-weight: 500; /* Medium */
    font-display: swap;
    src: url(${HalisGRMediumWoff2}) format("woff2"),
         url(${HalisGRMediumWoff}) format("woff");
  }
  @font-face {
    font-family: "Halis GR";
    font-style: normal;
    font-weight: 700; /* Bold */
    font-display: swap;
    src: url(${HalisGRBoldWoff2}) format("woff2"),
         url(${HalisGRBoldWoff}) format("woff");
  }

  /* NanumSquare — CJK fallback */
  @font-face {
    font-family: "NanumSquare";
    font-style: normal;
    font-weight: 400; /* Regular */
    font-display: swap;
    src: url(${NanumSquareRegularWoff2}) format("woff2"),
         url(${NanumSquareRegularWoff}) format("woff");
  }
  @font-face {
    font-family: "NanumSquare";
    font-style: normal;
    font-weight: 700; /* Bold */
    font-display: swap;
    src: url(${NanumSquareBoldWoff2}) format("woff2"),
         url(${NanumSquareBoldWoff}) format("woff");
  }

  /* Refinery 25 — accent/brand */
  @font-face {
    font-family: "Refinery 25";
    font-style: normal;
    font-weight: 600; /* Semibold */
    font-display: swap;
    src: url(${Refinery25SemiboldWoff2}) format("woff2"),
         url(${Refinery25SemiboldWoff}) format("woff");
  }

  /* AraES Nawar — Arabic */
  @font-face {
    font-family: "AraES Nawar";
    font-style: normal;
    font-weight: 400; /* Regular */
    font-display: swap;
    src: url(${AraESNawarRegularWoff2}) format("woff2"),
         url(${AraESNawarRegularWoff}) format("woff");
  }
`);

export const themeStyles = squish(`
  ${layerStyles}
  @layer theme {
    ${tokenStyles}
    ${fontStyles}
  }
`);
