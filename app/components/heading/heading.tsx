import { Fragment, ReactNode, ElementType, HTMLAttributes } from "react";
import { classes } from '~/utils/styles';
import styles from './heading.module.css';

// Define the shape of the props, extending standard HTML heading attributes
interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  children?: ReactNode;
  level?: number;
  as?: ElementType;
  align?: 'auto' | 'start' | 'center' | 'right';
  weight?: 'light' | 'regular' | 'medium' | 'bold';
  className?: string;
}

export const Heading = ({
  children,
  level = 1,
  as,
  align = 'auto',
  weight = 'medium',
  className,
  ...rest
}: HeadingProps) => {
  // Clamp the level between 1 and 5 to ensure valid HTML heading tags
  const clampedLevel = Math.min(Math.max(level, 1), 5);
  
  // Fix typo "Commponent" and ensure the dynamic tag is typed correctly
  const Component = as || (`h${clampedLevel}` as ElementType);

  return (
    <Fragment>
      <Component
        className={classes(styles.heading, className)}
        data-align={align}
        data-weight={weight}
        data-level={clampedLevel}
        {...rest}
      >
        {children}
      </Component>
    </Fragment>
  );
};