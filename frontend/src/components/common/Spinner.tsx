import clsx from "clsx";

interface Props {
    size?: number;
    className?: string;
}

export default function Spinner({ size = 20, className }: Props) {
    return (
        <div
            role="status"
            aria-label="Loading"
            className={clsx(
                "animate-spin rounded-full border-2 border-line-strong border-t-olive-500",
                className
            )}
            style={{ width: size, height: size }}
        />
    );
}
