import { NavLink } from "react-router-dom";
import { LayoutDashboard, Settings } from "lucide-react";
import clsx from "clsx";

import ContourMark from "../icons/ContourMark";

const items = [
    { title: "Dashboard", icon: LayoutDashboard, to: "/dashboard" },
    { title: "Settings", icon: Settings, to: "/settings" },
];

export default function Sidebar() {
    return (
        <aside className="flex w-60 flex-col border-r border-line bg-ink">

            <div className="flex items-center gap-2 border-b border-line px-6 py-[22px] font-display text-lg font-semibold text-parchment">
                <ContourMark size={18} className="text-olive-500" />
                CodeAtlas AI
            </div>

            <nav className="flex-1 space-y-1 p-4">

                {items.map((item) => {

                    const Icon = item.icon;

                    return (

                        <NavLink
                            key={item.title}
                            to={item.to}
                            className={({ isActive }) =>
                                clsx(
                                    "relative flex w-full items-center gap-3 rounded-sm px-4 py-2.5 text-sm transition-colors",
                                    isActive
                                        ? "bg-olive-800 text-olive-300"
                                        : "text-parchment-dim hover:bg-ink-raised hover:text-parchment"
                                )
                            }
                        >
                            {({ isActive }) => (
                                <>
                                    {isActive && (
                                        <span className="absolute left-0 top-1/2 h-4 w-[3px] -translate-y-1/2 rounded-full bg-olive-500" />
                                    )}
                                    <Icon size={17} />
                                    {item.title}
                                </>
                            )}
                        </NavLink>

                    );

                })}

            </nav>

            <div className="border-t border-line p-4 font-mono text-[11px] text-parchment-faint">
                v0.1 — checkpoint 2
            </div>

        </aside>
    );
}
