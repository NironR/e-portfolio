import { VisuallyHidden } from "~/components/visually-hidden";
import { useReducedMotion, useSpring } from "framer-motion";
import { memo, useEffect, useRef, HTMLAttributes } from 'react';
import { delay } from '~/utils/delay';
import { classes } from '~/utils/styles';
import styles from './decoder-text.module.css';

// prettier-ignore
const glyphs: string[] = [
    'ア', 'イ', 'ウ', 'エ', 'オ',
    'カ', 'キ', 'ク', 'ケ', 'コ',
    'サ', 'シ', 'ス', 'セ', 'ソ',
    'タ', 'チ', 'ツ', 'テ', 'ト',
    'ナ', 'ニ', 'ヌ', 'ネ', 'ノ',
    'ハ', 'ヒ', 'フ', 'ヘ', 'ホ',
    'マ', 'ミ', 'ム', 'メ', 'モ',
    'ヤ', 'ユ', 'ヨ', 'ー',
    'ラ', 'リ', 'ル', 'レ', 'ロ',
    'ワ', 'ヰ', 'ヱ', 'ヲ', 'ン',
    'ガ', 'ギ', 'グ', 'ゲ', 'ゴ',
    'ザ', 'ジ', 'ズ', 'ゼ', 'ゾ',
    'ダ', 'ヂ', 'ヅ', 'デ', 'ド',
    'バ', 'ビ', 'ブ', 'ベ', 'ボ',
    'パ', 'ピ', 'プ', 'ペ', 'ポ',
];

const CharType = {
    Glyph: 'glyph',
    Value: 'value',
} as const;

type CharTypeKeys = typeof CharType[keyof typeof CharType];

interface CharItem {
    type: CharTypeKeys;
    value: string;
}

function shuffle(content: string[], output: CharItem[], position: number): CharItem[] {
    return content.map((value, index) => {
        if (index < position) {
            return { type: CharType.Value, value };
        }

        if (position % 1 < 0.5) {
            const rand = Math.floor(Math.random() * glyphs.length);
            return { type: CharType.Glyph, value: glyphs[rand] };
        }

        // Fallback safely if previous output for this index doesn't exist yet
        const prev = output[index]?.value;
        if (prev !== undefined) {
            return { type: CharType.Glyph, value: prev };
        }
        const rand = Math.floor(Math.random() * glyphs.length);
        return { type: CharType.Glyph, value: glyphs[rand] };
    });
}

interface DecoderTextProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
    text: string;
    start?: boolean;
    delay?: number;
    className?: string;
}

export const DecoderText = memo<DecoderTextProps>(
    ({ text, start = true, delay: startDelay = 0, className, ...rest }) => {
        const output = useRef<CharItem[]>([{ type: CharType.Glyph, value: '' }]);
        const container = useRef<HTMLSpanElement>(null);
        const reduceMotion = useReducedMotion();
        const decoderSpring = useSpring(0, { stiffness: 8, damping: 5 });

        useEffect(() => {
            const containerInstance = container.current;
            if (!containerInstance) return;

            const content = text.split('');
            // Initialize output to match content length to avoid undefined access during the first frames
            output.current = content.map(() => ({ type: CharType.Glyph, value: '' }));
            let animation: number | undefined;

            const renderOutput = () => {
                const characterMap = output.current.map(item => {
                    return `<span class="${styles[item.type]}">${item.value}</span>`;
                });
                containerInstance.innerHTML = characterMap.join('');
            };

            const unsubscribeSpring = decoderSpring.on('change', value => {
                output.current = shuffle(content, output.current, value);
                renderOutput();
            });

            const startSpring = async () => {
                await delay(startDelay);
                decoderSpring.set(content.length);
            };

            if (start && !animation && !reduceMotion) {
                startSpring();
            }

            if (reduceMotion) {
                output.current = content.map((value, index) => ({
                    type: CharType.Value,
                    value: content[index],
                }));
                renderOutput();
            }

            return () => {
                unsubscribeSpring?.();
            };
        }, [decoderSpring, reduceMotion, start, startDelay, text]);

        return (
            <span className={classes(styles.text, className)} {...rest}>
        <VisuallyHidden className={styles.label}>{text}</VisuallyHidden>
        <span aria-hidden className={styles.content} ref={container} />
      </span>
        );
    }
);

DecoderText.displayName = 'DecoderText';

