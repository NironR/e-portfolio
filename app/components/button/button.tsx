import { Link } from '@remix-run/react';
import { Icon } from '~/components/icon';
import { Transition } from '~/components/transition';
import { classes } from '~/utils/styles';
import styles from './button.module.css';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    secondary?: boolean;
    href?: string;
    icon?: string;
    children: React.ReactNode;
}

export const Button = ({
                           secondary,
                           href,
                           icon,
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
            to={href}
            {...rest}
        >
            {icon && <Icon icon={icon} />}
            {children}
        </Element>
    );
};
