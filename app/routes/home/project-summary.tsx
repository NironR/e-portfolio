import { Button } from '~/components/button';
import { Divider } from '~/components/divider';
import { Heading } from '~/components/heading';
import { Loader } from '~/components/loader';
import { deviceModels } from '~/components/model/device-models';
import { Section } from '~/components/section';
import { Text } from '~/components/text';
import { useTheme } from '~/components/theme-provider/theme-provider';
import { Transition } from '~/components/transition';
import { useHydrated, useWindowSize } from '~/hooks';
import { Suspense, lazy, useState } from 'react';
import { cssProps, media } from '~/utils/styles';
import katakana from './katakana.svg';
import styles from './project-summary.module.css';

const Model = lazy(() =>
    import('~/components/model').then(module => ({ default: module.Model }))
);

interface ProjectTexture {
    srcSet: string;
    placeholder: string;
}

interface ProjectSummaryProps {
    id: string;
    visible?: boolean;
    sectionRef: React.Ref<HTMLDivElement>;
    index: number;
    title: string;
    description: string;
    model: {
        type: 'laptop' | 'phone';
        alt: string;
        textures: ProjectTexture[];
    };
    buttonText: string;
    buttonLink: string;
    alternate?: boolean;
}

export function ProjectSummary({
    id,
    visible: sectionVisible = false,
    sectionRef,
    index,
    title,
    description,
    model,
    buttonText,
    buttonLink,
    alternate,
    ...rest
}: ProjectSummaryProps) {
    const [focused, setFocused] = useState(false);
    const [modelLoaded, setModelLoaded] = useState(false);
    const { theme } = useTheme();
    const { width } = useWindowSize();
    const isHydrated = useHydrated();
    const titleId = `${id}-title`;
    const isMobile = width <= media.tablet;
    const svgOpacity = theme === 'light' ? 0.7 : 1;
    const indexText = index < 10 ? `0${index}` : index;
    const phoneSizes = `(max-width: ${media.tablet}px) 30vw, 20vw`;
    const laptopSizes = `(max-width: ${media.tablet}px) 80vw, 40vw`;

    function handleModelLoad() {
        setModelLoaded(true);
    }

    function renderKatakana(device: 'laptop' | 'phone', visible: boolean) {
        return (
            <svg
                data-visible={visible && modelLoaded}
                data-light={theme === 'light'}
                style={cssProps({ opacity: svgOpacity })}
                className={styles.svg}
                data-device={device}
                viewBox="0 0 751 136"
            >
                <use href={`${katakana}#katakana-project`} />
            </svg>
        );
    }

    function renderDetails(visible: boolean) {
        return (
            <div className={styles.details}>
                <div aria-hidden className={styles.index}>
                    <Divider
                        notchWidth="64px"
                        notchHeight="8px"
                        collapsed={!visible}
                        collapseDelay={1000}
                    />
                    <span className={styles.indexNumber} data-visible={visible}>
                        {indexText}
                    </span>
                </div>
                <Heading
                    level={3}
                    as="h2"
                    className={styles.title}
                    data-visible={visible}
                    id={titleId}
                >
                    {title}
                </Heading>
                <Text className={styles.description} data-visible={visible} as="p">
                    {description}
                </Text>
                <div className={styles.button} data-visible={visible}>
                    <Button iconHoverShift href={buttonLink} iconEnd="arrow-right">
                        {buttonText}
                    </Button>
                </div>
            </div>
        );
    }

    function renderPreview(visible: boolean) {
        const device = model.type;
        const models =
            device === 'laptop'
                ? [{ ...deviceModels.laptop, texture: { ...model.textures[0], sizes: laptopSizes } }]
                : [
                      {
                          ...deviceModels.phone,
                          position: { x: -0.6, y: 1.1, z: 0 },
                          texture: { ...model.textures[0], sizes: phoneSizes },
                      },
                      {
                          ...deviceModels.phone,
                          position: { x: 0.6, y: -0.5, z: 0.3 },
                          texture: { ...model.textures[1], sizes: phoneSizes },
                      },
                  ];

        return (
            <div className={styles.preview}>
                {renderKatakana(device, visible)}
                <div className={styles.model} data-device={device}>
                    {!modelLoaded && (
                        <Loader center className={styles.loader} data-visible={visible} />
                    )}
                    {isHydrated && visible && (
                        <Suspense>
                            <Model
                                alt={model.alt}
                                cameraPosition={{ x: 0, y: 0, z: device === 'laptop' ? 8 : 11.5 }}
                                showDelay={device === 'laptop' ? 700 : 300}
                                onLoad={handleModelLoad}
                                show={visible}
                                models={models}
                            />
                        </Suspense>
                    )}
                </div>
            </div>
        );
    }

    return (
        <Section
            className={styles.summary}
            data-alternate={alternate}
            data-first={index === 1}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            as="section"
            aria-labelledby={titleId}
            ref={sectionRef}
            id={id}
            tabIndex={-1}
            {...rest}
        >
            <div className={styles.content}>
                <Transition in={sectionVisible || focused}>
                    {({ visible }) => (
                        <>
                            {!alternate && !isMobile && (
                                <>
                                    {renderDetails(visible)}
                                    {renderPreview(visible)}
                                </>
                            )}
                            {(alternate || isMobile) && (
                                <>
                                    {renderPreview(visible)}
                                    {renderDetails(visible)}
                                </>
                            )}
                        </>
                    )}
                </Transition>
            </div>
        </Section>
    );
}
