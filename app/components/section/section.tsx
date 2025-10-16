import { forwardRef, ElementType, ComponentPropsWithRef } from 'react';
import { classes } from "~/utils/styles";
import styles from './section.module.css';

type SectionProps<T extends ElementType = 'div'> = {
    as?: T;
    children?: React.ReactNode;
    className?: string;
} & Omit<ComponentPropsWithRef<T>, 'as' | 'children' | 'className'>;

export const Section = forwardRef(
    <T extends ElementType = 'div'>(
        { as, children, className, ...rest }: SectionProps<T>,
        ref: React.ForwardedRef<any>
    ) => {
        const Component = as || 'div';

        return (
            <Component className={classes(styles.section, className)} ref={ref} {...rest}>
                {children}
            </Component>
        );
    }
);

Section.displayName = 'Section';