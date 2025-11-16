import React from 'react';
import { classes, cssProps, numToMs } from '~/utils/styles';
import styles from './divider.module.css';

export interface DividerProps extends React.HTMLAttributes<HTMLDivElement> {
    lineWidth?: string | number;
    lineHeight?: string | number;
    notchWidth?: string | number;
    notchHeight?: string | number;
    collapseDelay?: number;
    collapsed?: boolean;
}

export const Divider: React.FC<DividerProps> = ({
                                                    lineWidth = '100%',
                                                    lineHeight = '2px',
                                                    notchWidth = '90px',
                                                    notchHeight = '10px',
                                                    collapseDelay = 0,
                                                    collapsed = false,
                                                    className,
                                                    style,
                                                    ...rest
                                                }) => {
    return (
        <div
            className={classes(styles.divider, className)}
            style={cssProps(
                {
                    lineWidth,
                    lineHeight,
                    notchWidth,
                    notchHeight,
                    collapseDelay: numToMs(collapseDelay),
                },
                styles
            )}
            {...rest}
        >
            <div className={styles.line} data-collapsed={collapsed} />

            <div
                className={styles.notch}
                data-collapsed={collapsed}
                style={cssProps({
                    collapseDelay: numToMs(collapseDelay + 160),
                })}
            />
        </div>
    );
};
