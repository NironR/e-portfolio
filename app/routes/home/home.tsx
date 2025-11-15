import type { MetaFunction } from "@remix-run/cloudflare";
import {useEffect, useRef, useState} from "react";
import { Intro } from "~/routes/home/intro";
import config from "~/config.json";
import styles from './home.module.css';
import {Profile} from "~/routes/home/profile";

    export const links = () => {
        return [
            {
                rel: 'prefetch',
                href: '/draco/draco_wasm_wrapper.js',
                as: 'script',
                type: 'text/javascript',
                importance: 'low',
            },
            {
                rel: 'prefetch',
                href: '/draco/draco_decoder.wasm',
                as: 'fetch',
                type: 'application/wasm',
                importance: 'low',
            },
        ];
    };

export const meta: MetaFunction = () => {
  return [
    { title: "Designer + Engineer" },
    { name: `Personal portfolio of ${config.name} - a software engineer working on desktop and web apps with a focus on UI, motion, and design`},
  ];
};

export default function Home() {
    const [visibleSections, setVisibleSections] = useState([]);
    const [scrollIndicatorHidden, setScrollIndicatorHidden] = useState(false);
    const intro = useRef();

    useEffect(() => {
        const sections = [intro];

        const sectionObserver = new IntersectionObserver(
            (entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const section = entry.target;
                        observer.unobserve(section);
                        if (visibleSections.includes(section)) return;
                        setVisibleSections(prevSections => [...prevSections, section]);
                    }
                });
            },
            { rootMargin: '0px 0px -10% 0px', threshold: 0.1 }
        );
        const indicatorObserver = new IntersectionObserver(
            ([entry]) => {
                setScrollIndicatorHidden(!entry.isIntersecting);
            },
            { rootMargin: '-100% 0px 0px 0px' }
        );

        sections.forEach(section => {
            sectionObserver.observe(section.current);
        });

        indicatorObserver.observe(intro.current);

        return () => {
            sectionObserver.disconnect();
            indicatorObserver.disconnect();
        };
    }, [visibleSections]);

  return (
      <div className={styles.home}>
          <Intro
              id="intro"
              sectionRef={intro}
              scrollIndicatorHidden={scrollIndicatorHidden}
          />

          <Profile />
      </div>
  );
}