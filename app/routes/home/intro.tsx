import { Section } from "~/components/section/section";
import { DecoderText } from "~/components/decoder-text/decoder-text";
import { VisuallyHidden } from "~/components/visually-hidden";
import { tokens } from "~/components/theme-provider/theme";
import { Transition } from "~/components/transition/transition";
import { Heading } from "~/components/heading/heading";
import { useTheme } from "~/components/theme-provider/theme-provider";
import { classes, cssProps, media } from "~/utils/styles";
import { useInterval, usePrevious, useScrollToHash, useHydrated, useWindowSize } from '~/hooks';
import { useEffect, useState, Suspense, lazy, RefObject } from "react";
import { Link as RouterLink } from "@remix-run/react";
import config from "~/config.json";
import styles from './intro.module.css';

interface IntroProps {
    id: string;
    sectionRef: RefObject<HTMLElement>;
    visible: boolean;
    scrollIndicatorHidden: boolean;
    [key: string]: any;
}

export function Intro({ id, sectionRef, visible, scrollIndicatorHidden, ...rest }: IntroProps) {
    const { theme } = useTheme();
    const { disciplines } = config;
    const [disciplineIndex, setDisciplineIndex] = useState(0);
    const prevTheme = usePrevious(theme);
    const { w:width } = useWindowSize(); // Get current window width
    const isHydrated = useHydrated();
    
    // Determine if we should show the mobile version based on width
    const isMobile = width <= media.mobile;

    const introLabel = [disciplines.slice(0, -1).join(', '), disciplines.slice(-1)[0]].join(
        ', and '
    );
    const currentDiscipline = disciplines.find((_, index) => index === disciplineIndex);
    const titleId = `${id}-title`;
    const scrollToHash = useScrollToHash();

    const DisplacementSphere = lazy(() =>
        import('./displacement-sphere').then(module => ({ default: module.DisplacementSphere }))
    );

    useInterval(
        () => {
            const index = (disciplineIndex + 1) % disciplines.length;
            setDisciplineIndex(index);
        },
        5000,
        theme
    );

    useEffect(() => {
        if (prevTheme && prevTheme !== theme) {
            setDisciplineIndex(0);
        }
    }, [theme, prevTheme]);

    const handleScrollClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
        event.preventDefault();
        scrollToHash(event.currentTarget.href, () => {});
    };

    return (
        <Section
            className={styles.intro}
            as="section"
            ref={sectionRef}
            id={id}
            aria-labelledby={titleId}
            tabIndex={-1}
            {...rest}
        >
            <Transition in key={theme} timeout={3000}>
                {({ visible: transitionVisible, status }: { visible: boolean; status: string }) => (
                    <>
                        {isHydrated && (
                            <Suspense>
                                <DisplacementSphere />
                            </Suspense>
                        )}
                        <header className={styles.text}>
                            <h1 className={styles.name} data-visible={transitionVisible} id={titleId}>
                                <DecoderText text={config.name} delay={500} />
                            </h1>
                            <Heading level={0} as="h2" className={styles.title}>
                                <VisuallyHidden className={styles.label}>
                                    {`${config.role} + ${introLabel}`}
                                </VisuallyHidden>
                                <span aria-hidden className={styles.row}>
                                  <span
                                      className={styles.word}
                                      data-status={status}
                                      style={cssProps({ delay: tokens.base.durationXS })}
                                  >
                                    {config.role}
                                  </span>
                                  <span className={styles.line} data-status={status} />
                                </span>
                                <div className={styles.row}>
                                    {disciplines.map(item => (
                                        <Transition
                                            unmount
                                            in={item === currentDiscipline}
                                            timeout={{ enter: 3000, exit: 2000 }}
                                            key={item}
                                        >
                                            {({ status: wordStatus, nodeRef }: { status: string; nodeRef: RefObject<HTMLSpanElement> }) => (
                                                <span
                                                    aria-hidden
                                                    ref={nodeRef}
                                                    className={styles.word}
                                                    data-plus={true}
                                                    data-status={wordStatus}
                                                    style={cssProps({ delay: tokens.base.durationL })}
                                                >
                                                  {item}
                                                </span>
                                            )}
                                        </Transition>
                                    ))}
                                </div>
                            </Heading>
                        </header>
                        
                        {/* THE FIX: Conditionally render only one indicator based on screen width */}
                        {isHydrated && !isMobile && (
                            <RouterLink
                                to="/#project-1"
                                className={styles.scrollIndicator}
                                data-status={status}
                                data-hidden={scrollIndicatorHidden}
                                onClick={handleScrollClick}
                            >
                                <VisuallyHidden>Scroll to projects</VisuallyHidden>
                            </RouterLink>
                        )}

                        {isHydrated && isMobile && (
                            <RouterLink
                                to="/#project-1"
                                className={styles.mobileScrollIndicator}
                                data-status={status}
                                data-hidden={scrollIndicatorHidden}
                                onClick={handleScrollClick}
                            >
                                <VisuallyHidden>Scroll to projects</VisuallyHidden>
                                <svg
                                    aria-hidden
                                    stroke="currentColor"
                                    width="43"
                                    height="15"
                                    viewBox="0 0 43 15"
                                >
                                    <path d="M1 1l20.5 12L42 1" strokeWidth="2" fill="none" />
                                </svg>
                            </RouterLink>
                        )}
                    </>
                )}
            </Transition>
        </Section>
    );
}