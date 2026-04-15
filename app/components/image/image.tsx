import { Button } from '~/components/button';
import { Icon } from '~/components/icon';
import { useTheme } from '~/components/theme-provider/theme-provider';
import { useReducedMotion } from 'framer-motion';
import { useHasMounted, useInViewport } from '~/hooks';
import {
    Fragment,
    useCallback,
    useEffect,
    useRef,
    useState,
    CSSProperties,
} from 'react';
import { resolveSrcFromSrcSet } from '~/utils/image';
import { classes, cssProps, numToMs } from '~/utils/styles';
import styles from './image.module.css';

// Define props for the main Image component
interface ImageProps extends React.HTMLAttributes<HTMLDivElement> {
    className?: string;
    style?: CSSProperties;
    reveal?: boolean;
    delay?: number;
    raised?: boolean;
    src?: string;
    srcSet?: string;
    placeholder?: string;
    alt?: string;
    play?: boolean;
    restartOnPause?: boolean;
    sizes?: string;
    width?: number | string;
    height?: number | string;
    noPauseButton?: boolean;
    cover?: boolean;
}

export const Image: React.FC<ImageProps> = ({
                                                className,
                                                style,
                                                reveal,
                                                delay = 0,
                                                raised,
                                                src: baseSrc,
                                                srcSet,
                                                placeholder,
                                                ...rest
                                            }) => {
    const [loaded, setLoaded] = useState(false);
    const { theme } = useTheme();
    const containerRef = useRef<HTMLDivElement>(null);
    const src = baseSrc || srcSet?.split(' ')[0];
    const inViewport = useInViewport(containerRef, !getIsVideo(src));

    const onLoad = useCallback(() => {
        setLoaded(true);
    }, []);

    return (
        <div
            className={classes(styles.image, className)}
            data-visible={inViewport || loaded}
            data-reveal={reveal}
            data-raised={raised}
            data-theme={theme}
            style={cssProps({ delay: numToMs(delay) }, style)}
            ref={containerRef}
        >
            <ImageElements
                delay={delay}
                onAssetLoad={onLoad}
                loaded={loaded}
                inViewport={inViewport}
                reveal={reveal}
                src={src}
                srcSet={srcSet}
                placeholder={placeholder}
                {...rest}
            />
        </div>
    );
};

// Define props for the internal ImageElements component
interface ImageElementsProps {
    onAssetLoad: () => void;
    loaded: boolean;
    inViewport: boolean;
    srcSet?: string;
    placeholder?: string;
    delay: number;
    src?: string;
    alt?: string;
    play?: boolean;
    restartOnPause?: boolean;
    reveal?: boolean;
    sizes?: string;
    width?: number | string;
    height?: number | string;
    noPauseButton?: boolean;
    cover?: boolean;
    [key: string]: any; // Allow other props to be spread to video/img
}

const ImageElements: React.FC<ImageElementsProps> = ({
                                                         onAssetLoad,
                                                         loaded,
                                                         inViewport,
                                                         srcSet,
                                                         placeholder,
                                                         delay,
                                                         src,
                                                         alt,
                                                         play = true,
                                                         restartOnPause,
                                                         reveal,
                                                         sizes,
                                                         width,
                                                         height,
                                                         noPauseButton,
                                                         cover,
                                                         ...rest
                                                     }) => {
    const reduceMotion = useReducedMotion();
    const [showPlaceholder, setShowPlaceholder] = useState(true);
    const [playing, setPlaying] = useState(!reduceMotion);
    const [videoSrc, setVideoSrc] = useState<string | undefined>();
    const [videoInteracted, setVideoInteracted] = useState(false);
    const placeholderRef = useRef<HTMLImageElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const isVideo = getIsVideo(src);
    const showFullRes = inViewport;
    const hasMounted = useHasMounted();

    useEffect(() => {
        if (loaded) {
            setShowPlaceholder(false);
        }
    }, [loaded]);

    useEffect(() => {
        const resolveVideoSrc = async () => {
            if (sizes) {
                const resolvedVideoSrc = await resolveSrcFromSrcSet({ 
                    srcSet: srcSet as string, 
                    sizes: sizes as string 
                });
                setVideoSrc(resolvedVideoSrc);
            }
        };

        if (isVideo && srcSet) {
            resolveVideoSrc();
        } else if (isVideo) {
            setVideoSrc(src);
        }
    }, [isVideo, sizes, src, srcSet]);

    useEffect(() => {
        if (!videoRef.current || !videoSrc) return;

        const playVideo = () => {
            setPlaying(true);
            if (videoRef.current) {
                videoRef.current.play();
            }
        };

        const pauseVideo = () => {
            setPlaying(false);
            if (videoRef.current) {
                videoRef.current.pause();
            }
        };

        if (!play) {
            if (videoRef.current) {
                videoRef.current.pause();
            }

            if (restartOnPause) {
                if (videoRef.current) {
                    videoRef.current.currentTime = 0;
                }
            }
        }

        if (videoInteracted) return;

        if (!inViewport) {
            pauseVideo();
        } else if (inViewport && !reduceMotion && play) {
            playVideo();
        }
    }, [inViewport, play, reduceMotion, restartOnPause, videoInteracted, videoSrc]);

    const togglePlaying = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();

        setVideoInteracted(true);

        if (videoRef.current?.paused) {
            setPlaying(true);
            videoRef.current.play();
        } else {
            setPlaying(false);
            if (videoRef.current) {
                videoRef.current.pause();
            }
        }
    };

    return (
        <div
            className={styles.elementWrapper}
            data-reveal={reveal}
            data-visible={inViewport || loaded}
            style={cssProps({ delay: numToMs(delay + 1000) })}
        >
            {isVideo && hasMounted && (
                <Fragment>
                    <video
                        muted
                        loop
                        playsInline
                        className={styles.element}
                        data-loaded={loaded}
                        data-cover={cover}
                        autoPlay={!reduceMotion}
                        onLoadStart={onAssetLoad}
                        src={videoSrc}
                        aria-label={alt}
                        ref={videoRef}
                        {...rest}
                    />
                    {!noPauseButton && (
                        <Button className={styles.button} onClick={togglePlaying}>
                            <Icon icon={playing ? 'pause' : 'play'} />
                            {playing ? 'Pause' : 'Play'}
                        </Button>
                    )}
                </Fragment>
            )}
            {!isVideo && (
                <img
                    className={styles.element}
                    data-loaded={loaded}
                    data-cover={cover}
                    onLoad={onAssetLoad}
                    decoding="async"
                    src={showFullRes ? src : undefined}
                    srcSet={showFullRes ? srcSet : undefined}
                    width={width}
                    height={height}
                    alt={alt}
                    sizes={sizes}
                    {...rest}
                />
            )}
            {showPlaceholder && (
                <img
                    aria-hidden
                    className={styles.placeholder}
                    data-loaded={loaded}
                    data-cover={cover}
                    style={cssProps({ delay: numToMs(delay) })}
                    ref={placeholderRef}
                    src={placeholder}
                    width={width}
                    height={height}
                    onTransitionEnd={() => setShowPlaceholder(false)}
                    decoding="async"
                    loading="lazy"
                    alt=""
                    role="presentation"
                />
            )}
        </div>
    );
};

function getIsVideo(src?: string): boolean {
    return typeof src === 'string' && src.includes('.mp4');
}