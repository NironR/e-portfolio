import React, {
    useEffect,
    useRef,
    useState,
    type MutableRefObject,
    type ReactNode,
    type RefObject,
} from "react";
import { AnimatePresence, usePresence } from "framer-motion";

/** Transition states */
type Status = "entering" | "entered" | "exiting" | "exited";

/** One number for both, or split enter/exit timeouts */
type Timeout = number | { enter: number; exit: number };

type RenderArgs = {
    visible: boolean;
    status: Status;
    nodeRef: RefObject<HTMLElement>;
};

type TransitionBaseProps = {
    /** Render-prop: receive { visible, status, nodeRef } */
    children: (args: RenderArgs) => ReactNode;
    /** Single timeout in ms, or { enter, exit } */
    timeout?: Timeout;
    /** Called at the start/end of phases */
    onEnter?: () => void;
    onEntered?: () => void;
    onExit?: () => void;
    onExited?: () => void;
    /** Start in 'exited' (true) or 'entered' (false) */
    initial?: boolean;
    /** Provide your own ref if you attach it to the transitioning element */
    nodeRef?: RefObject<HTMLElement>;
};

export type TransitionProps = TransitionBaseProps & {
    /** Show/hide flag (prop name mirrors react-transition-group) */
    in: boolean;
    /** If true, remove from tree when hidden */
    unmount?: boolean;
};

type TransitionContentProps = TransitionBaseProps & {
    in: boolean;
    enterTimeout: MutableRefObject<ReturnType<typeof setTimeout> | undefined>;
    exitTimeout: MutableRefObject<ReturnType<typeof setTimeout> | undefined>;
};

export const Transition: React.FC<TransitionProps> = ({
                                                          children,
                                                          in: show,
                                                          unmount = true,
                                                          initial = true,
                                                          ...rest
                                                      }) => {
    const enterTimeout = useRef<ReturnType<typeof setTimeout>>();
    const exitTimeout = useRef<ReturnType<typeof setTimeout>>();

    useEffect(() => {
        if (show) {
            if (exitTimeout.current) clearTimeout(exitTimeout.current);
        } else {
            if (enterTimeout.current) clearTimeout(enterTimeout.current);
        }
    }, [show]);

    return (
        <AnimatePresence>
            {(show || !unmount) && (
            <TransitionContent
                enterTimeout={enterTimeout}
    exitTimeout={exitTimeout}
    in={show}
    initial={initial}
    {...rest}
>
    {children}
    </TransitionContent>
)}
    </AnimatePresence>
);
};

const TransitionContent: React.FC<TransitionContentProps> = ({
                                                                 children,
                                                                 timeout = 0,
                                                                 enterTimeout,
                                                                 exitTimeout,
                                                                 onEnter,
                                                                 onEntered,
                                                                 onExit,
                                                                 onExited,
                                                                 initial = true,
                                                                 nodeRef: providedNodeRef,
                                                                 in: show,
                                                             }) => {
    const [status, setStatus] = useState<Status>(initial ? "exited" : "entered");
    const [isPresent, safeToRemove] = usePresence();
    const [hasEntered, setHasEntered] = useState<boolean>(!initial);

    const splitTimeout = typeof timeout === "object" && timeout !== null;
    const getEnter = (t: Timeout): number =>
        typeof t === "number" ? t : t.enter;
    const getExit = (t: Timeout): number =>
        typeof t === "number" ? t : t.exit;

    const internalNodeRef = useRef<HTMLElement>(null);
    const nodeRef = providedNodeRef ?? internalNodeRef;

    const visible = hasEntered && show ? isPresent : false;

    // ENTER
    useEffect(() => {
        if (hasEntered || !show) return;

        const actualTimeout = splitTimeout ? getEnter(timeout) : (timeout as number);

        if (enterTimeout.current) clearTimeout(enterTimeout.current);
        if (exitTimeout.current) clearTimeout(exitTimeout.current);

        setHasEntered(true);
        setStatus("entering");
        onEnter?.();

        // Force reflow
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        nodeRef.current?.offsetHeight;

        enterTimeout.current = setTimeout(() => {
            setStatus("entered");
            onEntered?.();
        }, actualTimeout);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [onEnter, onEntered, timeout, status, show, hasEntered, splitTimeout, nodeRef]);

    // EXIT
    useEffect(() => {
        if (isPresent && show) return;

        const actualTimeout = splitTimeout ? getExit(timeout) : (timeout as number);

        if (enterTimeout.current) clearTimeout(enterTimeout.current);
        if (exitTimeout.current) clearTimeout(exitTimeout.current);

        setStatus("exiting");
        onExit?.();

        // Force reflow
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        nodeRef.current?.offsetHeight;

        exitTimeout.current = setTimeout(() => {
            setStatus("exited");
            safeToRemove?.();
            onExited?.();
        }, actualTimeout);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isPresent, onExit, safeToRemove, timeout, onExited, show, splitTimeout, nodeRef]);

    return <>{children({ visible, status, nodeRef })}</>;
};
