import { ReactNode, ElementType, HTMLAttributes } from 'react';
import { classes } from '~/utils/styles';
import styles from './text.module.css';

// Define the shape of the props, extending standard HTML attributes
interface TextProps extends HTMLAttributes<HTMLElement> {
  children?: ReactNode;
  size?: 's' | 'm' | 'l' | 'xl';
  as?: ElementType;
  align?: 'auto' | 'start' | 'center' | 'right';
  weight?: 'auto' | 'light' | 'regular' | 'medium' | 'bold';
  secondary?: boolean;
  className?: string;
}

export const Text = ({
  children,
  size = 'm',
  as: Component = 'span',
  align = 'auto',
  weight = 'auto',
  secondary,
  className,
  ...rest
}: TextProps) => {
  return (
    <Component
      className={classes(styles.text, className)}
      data-align={align}
      data-size={size}
      data-weight={weight}
      data-secondary={secondary}
      {...rest}
    >
      {children}
    </Component>
  );
};