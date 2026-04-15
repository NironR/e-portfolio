import profileImgPLaceholder from '~/assets/self-portrait-placeholder.svg';
import profileImg from '~/assets/self-portrait-placeholder.svg';
import profileImgLarge from '~/assets/self-portrait-placeholder.svg';
import { Image } from '~/components/image/image';
import { Fragment, useState } from "react";
import { Section } from "~/components/section/section";
import { Text } from "~/components/text/text";
import { DecoderText } from "~/components/decoder-text/decoder-text";
import { Button } from "~/components/button";
import { Transition } from "~/components/transition/transition";
import { Heading } from "~/components/heading/heading";
import { Divider } from "~/components/divider";
import styles from './profile.module.css';
import katakana from './katakana.svg';
import { media } from '~/utils/styles';

interface ProfileTextProps {
    visible: boolean;
    titleId: string;
}

interface ProfileProps {
    id: string;
    visible?: boolean;
    sectionRef: React.Ref<HTMLDivElement>;
}


const ProfileText = ({ visible, titleId }: ProfileTextProps) => {
    return (
        <Fragment>
            <Heading className={styles.title} data-visible={visible} level={3} id={titleId} as="h3">
                <DecoderText text="Hello there!" start={visible} delay={500} />
            </Heading>
            <Text className={styles.description} data-visible={visible} size="l" as="p" secondary={false}>
                I'm Ryan, a <strong>Software Engineer</strong> based in <strong>Sydney, Australia</strong>.
            </Text>
            <Text className={styles.description} data-visible={visible} size="l" as="p" secondary={false}>

                I work primarily with React and modern JavaScript (ES6+), creating responsive web/system applications that prioritise clean code and smooth user interactions. My approach combines technical expertise with strong problem-solving skills, ensuring that what I build not only works well but feels intuitive to use.
            </Text>
            <Text className={styles.description} data-visible={visible} size="l" as="p" secondary={false}>
                In my spare time, I enjoy problem-solving challenges, playing video games, and creating mods for them. I'm always open to hearing about new projects, so feel free to drop me a message!
            </Text>
        </Fragment>
    );
};

export const Profile = ({ id, visible = false, sectionRef }: ProfileProps) => {
    const [focused, setFocused] = useState(false);
    const titleId = `${id}-title`;

    return (
        <Section
            className={styles.profile}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            as="section"
            id={id}
            ref={sectionRef}
            aria-labelledby={titleId}
            tabIndex={-1}
        >
            <Transition in={visible || focused} timeout={0}>
                {({ visible, nodeRef }) => (
                    <div className={styles.content} ref={nodeRef as any}>
                        <div className={styles.column}>
                            <ProfileText visible={visible} titleId={titleId} />
                            <Button
                                secondary
                                className={styles.button}
                                data-visible={visible}
                                href="/contact"
                                icon="send"
                            >
                                Send me a message
                            </Button>
                        </div>
                        <div className={styles.column}>
                            <div className={styles.tag} aria-hidden>
                                <Divider
                                    notchWidth="64px"
                                    notchHeight="8px"
                                    collapsed={!visible}
                                    collapseDelay={1000}
                                />
                                <div className={styles.tagText} data-visible={visible}>
                                    About me
                                </div>
                            </div>
                            <div className={styles.image}>
                                <Image 
                                    reveal
                                    delay={100}
                                    placeholder={profileImgPLaceholder}
                                    srcSet={`${profileImg} 480w, ${profileImgLarge} 960w`}
                                    width = {960}
                                    height = {1280}
                                    sizes= {`(max-width: ${media.mobile}px) 100vw, 480px`}
                                    alt="Profile picture of myself, crazy right?"
                                />
                                <svg className={styles.svg} data-visible={visible} viewBox="0 0 136 766">
                                    <use href={`${katakana}#katakana-profile`} />
                                </svg>
                            </div>
                        </div>
                    </div>
                )}
            </Transition>
        </Section>
    );
};