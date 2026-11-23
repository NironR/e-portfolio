import type { LinksFunction, MetaFunction } from "@remix-run/cloudflare";
import { useEffect, useRef, useState } from "react";
import { Intro } from "~/routes/home/intro";
import { Profile } from "~/routes/home/profile";
import { ProjectSummary } from "~/routes/home/project-summary";
import f1Texture from "~/assets/f1-hero.jpg";
import f1TextureLarge from "~/assets/f1-hero-large.jpg";
import f1TexturePlaceholder from "~/assets/f1-hero-placeholder.jpg";
import config from "~/config.json";
import styles from "./home.module.css";

// Prefetch the Draco decoder the project models need, so they load as soon as they scroll in
export const links: LinksFunction = () => [
    { rel: "prefetch", href: "/draco/draco_wasm_wrapper.js", as: "script", type: "text/javascript" },
    { rel: "prefetch", href: "/draco/draco_decoder.wasm", as: "fetch", type: "application/wasm" },
];

export const meta: MetaFunction = () => {
    return [
        { title: `${config.name} | Designer + Engineer` },
        {
            name: "description",
            content: `Personal portfolio of ${config.name} - a software engineer working on desktop and web apps with a focus on UI, motion, and design`,
        },
    ];
};

type SectionElement = HTMLDivElement | null;

export const Home = () => {
    const [visibleSections, setVisibleSections] = useState<SectionElement[]>([]);
    const [scrollIndicatorHidden, setScrollIndicatorHidden] = useState<boolean>(false);

    // Typed refs
    const intro = useRef<HTMLDivElement>(null);
    const projectOne = useRef<HTMLDivElement>(null);
    const projectTwo = useRef<HTMLDivElement>(null);
    const projectThree = useRef<HTMLDivElement>(null);
    const details = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const sections = [intro, projectOne, projectTwo, projectThree, details];

        const sectionObserver = new IntersectionObserver(
            (entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const section = entry.target as HTMLDivElement;
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
    }, []);



    return (
        <div className={styles.home}>
            <Intro
                id="intro"
                sectionRef={intro}
                visible={visibleSections.includes(intro.current)}
                scrollIndicatorHidden={scrollIndicatorHidden}
            />

            <ProjectSummary
                id="project-1"
                sectionRef={projectOne}
                visible={visibleSections.includes(projectOne.current)}
                index={1}
                title="Predicting every Formula 1 race"
                description="Machine learning that predicts finishing order, safety cars, tyre wear and pit stops before each Grand Prix, then checks every call against the result"
                buttonText="View project"
                buttonLink="/projects/f1-race-predictor"
                model={{
                    type: "laptop",
                    alt: "F1 Race Predictor results page",
                    textures: [
                        {
                            srcSet: `${f1Texture} 1280w, ${f1TextureLarge} 2560w`,
                            placeholder: f1TexturePlaceholder,
                        },
                    ],
                }}
            />

            <Profile
                sectionRef={details}
                visible={visibleSections.includes(details.current)}
                id="details"
            />
        </div>
    );
}
