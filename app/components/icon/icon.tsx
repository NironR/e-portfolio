import { forwardRef } from "react";
import styles from "./icon.module.css";
import sprites from "./icons.svg";
import { classes } from "~/utils/styles";

export interface IconProps extends React.SVGProps<SVGSVGElement> {
    icon: string;
    className?: string;
    size?: number;
}

export const Icon = forwardRef<SVGSVGElement, IconProps>(
    ({ icon, className, size = 24, ...rest }, ref) => {
        return (
            <svg
                aria-hidden="true"
                ref={ref}
                className={classes(styles.icon, className)}
                width={size}
                height={size}
                {...rest}
            >
                <use href={`${sprites}#${icon}`} />
            </svg>
        );
    }
);

Icon.displayName = "Icon";
