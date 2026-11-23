import { Link } from '@remix-run/react';
import { Icon } from '~/components/icon';
import { Transition } from '~/components/transition';
import { classes } from '~/utils/styles';
import styles from './button.module.css';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    secondary?: boolean;
    href?: string;
    icon?: string;
    iconEnd?: string;
    iconHoverShift?: boolean;
    children: React.ReactNode;
}

export const Button = ({
                           secondary,
                           href,
                           icon,
                           iconEnd,
                           iconHoverShift,
                           children,
                           className,
                           ...rest
                       }: ButtonProps) => {
    const isLink = !!href;
    const Element = isLink ? Link : 'button';

    return (
        <Element
            className={classes(styles.button, className)}
            data-secondary={secondary}
            data-icon-hover-shift={iconHoverShift}
            to={href}
            {...rest}
        >
            {icon && <Icon icon={icon} />}
            {children}
            {iconEnd && <Icon icon={iconEnd} />}
        </Element>
    );
};
