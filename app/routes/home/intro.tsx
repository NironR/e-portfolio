import { Section } from "~/components/section/section";
import { DecoderText } from "~/components/decoder-text/decoder-text";
import { Transition } from "~/components/transition/transition";
import { Heading } from "~/components/heading/heading";
import { useTheme } from "~/components/theme-provider/theme-provider";
import config from "~/config.json";
import styles from './intro.module.css';
import {VisuallyHidden} from "~/components/visually-hidden";
import {cssProps} from "~/utils/styles";
import {tokens} from "~/components/theme-provider/theme";

export function Intro({ id, sectionRef, ...rest}) {
    const { theme } = useTheme();
    const titleId = `${id}-title`;
    const { disciplines } = config;
    const introLabel = [disciplines.slice(0, -1).join(', '), disciplines.slice(-1)[0]];

    return (
        <Section
        className={styles.intro}
        as="section"
        ref={sectionRef}
        id={id}
        aria-labelledby={titleId}
        {...rest}
        >
            <Transition
                in key={theme}
            timeout={3000}
            >
                {({ visible, status }) => (
                    <>
                        <header className={styles.text}>
                            <h1 className={styles.name} data-visible={visible} id={titleId}>
                                <DecoderText text={config.name} delay={500} />
                            </h1>
                            <Heading level={0} as="h2" className={styles.title}>
                                <VisuallyHidden className={styles.label}>
                                    {`${config.role} + ${introLabel}`}
                                </VisuallyHidden>
                                <span className={styles.row}>
                                    <span className={styles.word} data-status={status} style={cssProps({ delay: tokens.base.durationXS})}>
                                        {config.role}
                                    </span>
                                    <span className={styles.line} data-status={status}/>
                                </span>
                            </Heading>
                        </header>
                    </>
                )}
            </Transition>
        </Section>
    )
}