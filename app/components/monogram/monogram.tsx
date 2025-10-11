import { forwardRef, useId } from 'react';
import { classes } from '~/utils/styles';
import styles from './monogram.module.css';

export const Monogram = forwardRef(({ highlight, className, ...props }: any, ref) => {
    const id = useId();
    const clipId = `${id}monogram-clip`;

    return (
        <svg
            aria-hidden
            className={classes(styles.monogram, className)}
            width="48"
            height="62"
            viewBox="0 0 42.93 55.96"
            ref={ref}
            {...props}
        >
            <defs>
                <clipPath id={clipId}>
                    <path d="M27.63,33.22l.21.05,5.41,6.48h8.62c.4-.1.45-.48.16-.77l-11.89-14.32c-.02-.08-.02-.15.06-.19.08.03.15.04.24.04.38,0,.88-.06,1.23-.03.08,0,.16.05.22.1l4.88,5.88c.3.31.34.39.77.21,1.28-.53,2.62-2,3.21-3.23,2.18-4.55-.93-9.65-5.86-10.03l-15.98.04c-.14.07-.21.21-.2.36l.02,6.33,6.94,8.41-.07.11h-1.61l-.17-.12-12.53-15.09-.33-.1c-2.13.14-4.49-.18-6.59,0-.21.02-.39.05-.52.24v21.97s.18.17.18.17l8.26.04c.25,0,.36-.13.4-.36l-.03-5.98-7.3-8.85s.06-.08.09-.09c.1-.04,1.32-.05,1.49-.02.05,0,.1.02.14.05l12.66,15.2.23.06h7.25c.16.02.4-.22.4-.36v-6.18Z" />
                </clipPath>
            </defs>
            <rect clipPath={`url(#${clipId})`} width="100%" height="100%" />
            {highlight && (
                <g clipPath={`url(#${clipId})`}>
                    <rect className={styles.highlight} width="100%" height="100%" />
                </g>
            )}
        </svg>
    );
});