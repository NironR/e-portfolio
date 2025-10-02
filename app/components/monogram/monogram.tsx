import { forwardRef } from 'react';
import { classes } from '~/utils/styles';
import styles from './monogram.module.css';
import logoLight from '~/assets/logo-theme-light.png';
import logoDark from '~/assets/logo-theme-dark.png';
import { useTheme } from '~/components/theme-provider/theme-provider';

export const Monogram = forwardRef(({ highlight, className, ...props }: any, ref) => {
    const { theme } = useTheme();
    const src = theme === 'dark' ? logoDark : logoLight;

    return (
        <span
            aria-hidden
            className={classes(styles.monogram, className)}
            ref={ref as any}
            {...props}
        >
            <img alt="" className={styles.base} src={src} />
            <span
                className={styles.fill}
                style={{
                    WebkitMaskImage: `url(${src})`,
                    maskImage: `url(${src})`,
                    WebkitMaskRepeat: 'no-repeat',
                    maskRepeat: 'no-repeat',
                    WebkitMaskSize: 'contain',
                    maskSize: 'contain',
                    WebkitMaskPosition: 'center',
                    maskPosition: 'center',
                } as any}
            />
        </span>
    );
});
