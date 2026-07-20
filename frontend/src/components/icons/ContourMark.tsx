interface Props {
    className?: string;
    size?: number;
}

export default function ContourMark({ className, size = 20 }: Props) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 20 20"
            fill="none"
            aria-hidden="true"
            className={className}
        >
            <path
                d="M2 14C4 14 4 8 6 8C8 8 8 14 10 14C12 14 12 8 14 8C16 8 16 14 18 14"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
            />
        </svg>
    );
}
