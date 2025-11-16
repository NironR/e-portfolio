import type { MetaFunction, LinksFunction } from "@remix-run/cloudflare";
import { useEffect, useRef, useState } from "react";
import { Intro } from "~/routes/home/intro";
import { Profile } from "~/routes/home/profile";
import config from "~/config.json";
import styles from "./home.module.css";

export const links: LinksFunction = () => {
    return [
        {
            rel: "prefetch",
            href: "/draco/draco_wasm_wrapper.js",
            as: "script",
            type: "text/javascript",
            importance: "low",
        },
        {
            rel: "prefetch",
            href: "/draco/draco_decoder.wasm",
            as: "fetch",
            type: "application/wasm",
            importance: "low",
        },
    ];
};

export const meta: MetaFunction = () => {
    return [
        { title: "Designer + Engineer" },
        {
            name: "description",
            content: `Personal portfolio of ${config.name} - a software engineer working on desktop and web apps with a focus on UI, motion, and design`,
        },
    ];
};

export default function Home() {
    // -----------------------
    // Types
    // -----------------------
    type SectionElement = HTMLElement | null;

    // Keep track of which sections are visible
    const [visibleSections, setVisibleSections] = useState<SectionElement[]>([]);
    const [scrollIndicatorHidden, setScrollIndicatorHidden] = useState<boolean>(false);

    // Typed refs
    const intro = useRef<HTMLElement>(null);
    const projectOne = useRef<HTMLElement>(null);
    const projectTwo = useRef<HTMLElement>(null);
    const projectThree = useRef<HTMLElement>(null);
    const details = useRef<HTMLElement>(null);

    useEffect(() => {
        const sections = [intro, projectOne, projectTwo, projectThree, details];

        const sectionObserver = new IntersectionObserver(
            (entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const section = entry.target;
                        observer.unobserve(section);

                        setVisibleSections(prev =>
                            prev.includes(section) ? prev : [...prev, section]
                        );
                    }
                });
            },
            { rootMargin: "0px 0px -10% 0px", threshold: 0.1 }
        );

        const indicatorObserver = new IntersectionObserver(
            ([entry]) => {
                setScrollIndicatorHidden(!entry.isIntersecting);
            },
            { rootMargin: "-100% 0px 0px 0px" }
        );

        // Observe section refs safely
        sections.forEach(ref => {
            if (ref.current) sectionObserver.observe(ref.current);
        });

        if (intro.current) indicatorObserver.observe(intro.current);

        return () => {
            sectionObserver.disconnect();
            indicatorObserver.disconnect();
        };
    }, []); // IMPORTANT: only run once



    return (
        <div className={styles.home}>
            <Intro
                id="intro"
                sectionRef={intro}
                visible={visibleSections.includes(intro.current)}
            />

            <Profile
                sectionRef={details}
                visible={visibleSections.includes(details.current)}
                id="details"
            />
        </div>
    );
}
