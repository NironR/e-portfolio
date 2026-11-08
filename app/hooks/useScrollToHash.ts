import { useReducedMotion } from 'framer-motion';
import { useLocation, useNavigate } from '@remix-run/react';
import { useCallback, useRef } from 'react';

export function useScrollToHash() {
    const scrollTimeout = useRef<ReturnType<typeof setTimeout>>();
    const location = useLocation();
    const navigate = useNavigate();
    const reduceMotion = useReducedMotion();

    const scrollToHash = useCallback(
        (hash: string, onDone?: () => void) => {
            const id = hash.split('#')[1];
            const targetElement = document.getElementById(id);

            // Section may not exist yet (e.g. /#project-1 before projects are added)
            if (!targetElement) {
                onDone?.();
                return;
            }

            targetElement.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });

            const handleScroll = () => {
                clearTimeout(scrollTimeout.current);

                scrollTimeout.current = setTimeout(() => {
                    window.removeEventListener('scroll', handleScroll);

                    if (window.location.pathname === location.pathname) {
                        onDone?.();
                        navigate(`${location.pathname}#${id}`, { preventScrollReset: true });
                    }
                }, 50);
            };

            window.addEventListener('scroll', handleScroll);

            return () => {
                window.removeEventListener('scroll', handleScroll);
                clearTimeout(scrollTimeout.current);
            };
        },
        [navigate, reduceMotion, location.pathname]
    );

    return scrollToHash;
}
