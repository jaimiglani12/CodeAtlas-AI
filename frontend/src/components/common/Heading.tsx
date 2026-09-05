import clsx from "clsx";

interface Props {
    eyebrow?: string;
    title: string;
    subtitle?: string;
    align?: "left" | "center";
}

export default function Heading({
    eyebrow,
    title,
    subtitle,
    align = "left",
}: Props) {
    return (
        <div className={clsx(align === "center" && "mx-auto max-w-2xl text-center")}>

            {
                eyebrow && (
                    <span
                        className={clsx(
                            "inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-olive-500",
                            align === "center" && "justify-center"
                        )}
                    >
                        <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
                            <circle cx="6.5" cy="6.5" r="6" stroke="currentColor" strokeWidth="1" />
                            <circle cx="6.5" cy="6.5" r="3" stroke="currentColor" strokeWidth="1" />
                        </svg>
                        {eyebrow}
                    </span>
                )
            }

            <h2 className="mt-4 font-sans text-4xl font-semibold leading-tight tracking-[-0.025em] text-parchment">
                {title}
            </h2>

            {
                subtitle && (
                    <p className="mt-4 max-w-2xl text-[15.5px] leading-7 text-parchment-dim">
                        {subtitle}
                    </p>
                )
            }

        </div>
    );
}
