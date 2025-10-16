import { forwardRef, ElementType, ComponentPropsWithRef } from 'react';
import { classes } from '~/utils/styles';
import styles from './visually-hidden.module.css';

type VisuallyHiddenProps<T extends ElementType = 'span'> = {
    as?: T;
    children?: React.ReactNode;
    className?: string;
    showOnFocus?: boolean;
    visible?: boolean;
} & Omit<ComponentPropsWithRef<T>, 'as' | 'children' | 'className'>;

export const VisuallyHidden = forwardRef(
    <T extends ElementType = 'span'>(
        {
            className,
            showOnFocus,
            as,
            children,
            visible,
            ...rest
        }: VisuallyHiddenProps<T>,
        ref: React.ForwardedRef<any>
    ) => {
        const Component = as || 'span';

        return (
            <Component
                className={classes(styles.hidden, className)}
                data-hidden={!visible && !showOnFocus}
                data-show-on-focus={showOnFocus}
                ref={ref}
                {...rest}
            >
                {children}
            </Component>
        );
    }
);

VisuallyHidden.displayName = 'VisuallyHidden';