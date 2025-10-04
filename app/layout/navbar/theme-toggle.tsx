import { useId } from 'react';
import { Button } from '~/components/button';
import styles from './theme-toggle.module.css';

export const ThemeToggle = () => {
    return (
        <Button>
            <svg>
                <defs>
                    <circle className={styles.circle} data-mask={true} cx="19" cy="19" r="13" />
                    <circle className={styles.maskl} cx="25" cy="14" r="9" />
                </defs>
            </svg>
        </Button>
    );
};