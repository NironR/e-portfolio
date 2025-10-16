import { Section } from "~/components/section/section";
import { DecoderText } from "~/components/decoder-text/decoder-text";
import { VisuallyHidden } from "~/components/visually-hidden";
import { tokens } from "~/components/theme-provider/theme";
import { Transition } from "~/components/transition/transition";
import { Heading } from "~/components/heading/heading";
import { useTheme } from "~/components/theme-provider/theme-provider";
import { cssProps } from "~/utils/styles";
import { useInterval, usePrevious, useScrollToHash, useHydrated } from '~/hooks';
import {useEffect, useState, Suspense, lazy} from "react";
import config from "~/config.json";
import styles from './intro.module.css';

export function Intro({ id, sectionRef, ...rest}) {
    const { theme } = useTheme();
    const { disciplines } = config;
    const [disciplineIndex, setDisciplineIndex] = useState(0);
    const prevTheme = usePrevious(theme);
    const introLabel = [disciplines.slice(0, -1).join(', '), disciplines.slice(-1)[0]].join(
        ', and '
    );
    const currentDiscipline = disciplines.find((item, index) => index === disciplineIndex);
    const titleId = `${id}-title`;
    const scrollToHash = useScrollToHash();
    const isHydrated = useHydrated();

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

    const handleScrollClick = event => {
        event.preventDefault();
        scrollToHash(event.currentTarget.href);
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
                {({ visible, status }) => (
                    <>
                        {isHydrated && (
                            <Suspense>
                                <DisplacementSphere />
                            </Suspense>
                        )}
                        <header className={styles.text}>
                            <h1 className={styles.name} data-visible={visible} id={titleId}>
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
                                            {({ status, nodeRef }) => (
                                                <span
                                                    aria-hidden
                                                    ref={nodeRef}
                                                    className={styles.word}
                                                    data-plus={true}
                                                    data-status={status}
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


                    </>
                )}
            </Transition>
        </Section>
    )
}