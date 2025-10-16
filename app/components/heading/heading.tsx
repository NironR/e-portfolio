import { Fragment } from "react";
import { classes } from '~/utils/styles';
import styles from './heading.module.css';

export const Heading = ({
    children,
    level = 1,
    as,
    align = 'auto',
    weight = 'medium',
    className,
    ...rest
                        }) => {
    const clampedLevel = Math.min(Math.max(level, 1), 5);
    const Commponent = as || `h${Math.max(clampedLevel, 1)}`;

    return (
        <Fragment>
            <Commponent
                className={classes(styles.heading, className)}
                data-align={align}
                data-weight={weight}
                data-level={clampedLevel}
                {...rest}
            >
                {children}
            </Commponent>
        </Fragment>
    )
}