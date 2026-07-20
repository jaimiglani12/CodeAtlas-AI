import { useEffect, useRef, useState } from "react";
import { ChevronRight, LogOut, Settings } from "lucide-react";
import { Link } from "react-router-dom";
import clsx from "clsx";

import { useAuth } from "../../context/AuthContext";

interface Crumb {
    label: string;
    to?: string;
}

interface Props {
    breadcrumb: Crumb[];
}

export default function Topbar({ breadcrumb }: Props) {

    const { user, logout } = useAuth();

    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function onClick(e: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setMenuOpen(false);
            }
        }
        if (menuOpen) document.addEventListener("mousedown", onClick);
        return () => document.removeEventListener("mousedown", onClick);
    }, [menuOpen]);

    const initial = user?.username?.[0]?.toUpperCase() ?? "?";

    return (

        <header className="flex items-center justify-between border-b border-line bg-ink px-8 py-4">

            <div className="flex items-center gap-2 font-mono text-sm text-parchment-dim">

                {breadcrumb.map((crumb, i) => (

                    <span key={crumb.label} className="flex items-center gap-2">
                        {i > 0 && <ChevronRight size={13} className="text-parchment-faint" />}
                        <span className={i === breadcrumb.length - 1 ? "text-parchment" : ""}>
                            {crumb.label}
                        </span>
                    </span>

                ))}

            </div>

            <div className="flex items-center gap-5">

                <div ref={menuRef} className="relative">

                    <button
                        onClick={() => setMenuOpen((v) => !v)}
                        className={clsx(
                            "flex h-9 w-9 items-center justify-center rounded-full border font-mono text-sm text-parchment transition-colors",
                            menuOpen
                                ? "border-olive-500 bg-ink-raised-2"
                                : "border-line-strong bg-ink-raised hover:border-olive-700"
                        )}
                    >
                        {initial}
                    </button>

                    {
                        menuOpen && (

                            <div className="absolute right-0 top-11 w-48 origin-top-right animate-[menu-in_120ms_ease-out] rounded-sm border border-line bg-ink-raised py-1.5 shadow-xl shadow-black/40">

                                <div className="border-b border-line px-3.5 py-2.5">
                                    <p className="truncate text-sm text-parchment">{user?.username ?? "Account"}</p>
                                    <p className="mt-0.5 truncate text-xs text-parchment-faint">{user?.email}</p>
                                </div>

                                <Link
                                    to="/settings"
                                    onClick={() => setMenuOpen(false)}
                                    className="flex w-full items-center gap-2 px-3.5 py-2 text-sm text-parchment-dim transition-colors hover:bg-ink hover:text-parchment"
                                >
                                    <Settings size={15} />
                                    Settings
                                </Link>

                                <button
                                    onClick={logout}
                                    className="flex w-full items-center gap-2 px-3.5 py-2 text-sm text-parchment-dim transition-colors hover:bg-ink hover:text-walnut-300"
                                >
                                    <LogOut size={15} />
                                    Log out
                                </button>

                            </div>

                        )
                    }

                </div>

            </div>

        </header>
    );
}
