import { Link } from "react-router-dom";
import { Compass } from "lucide-react";

import Button from "../components/common/Button";
import ContourMark from "../components/icons/ContourMark";

export default function NotFound() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-5 bg-ink px-6 text-center">

            <Link to="/" className="flex items-center gap-2 font-display text-lg font-semibold text-parchment">
                <ContourMark className="text-olive-500" />
                CodeAtlas AI
            </Link>

            <div className="flex h-12 w-12 items-center justify-center rounded-sm border border-line-strong bg-ink-raised text-parchment-dim">
                <Compass size={20} />
            </div>

            <div>
                <h1 className="font-display text-2xl font-medium text-parchment">Page not found</h1>
                <p className="mt-2 text-sm text-parchment-dim">
                    The page you're looking for doesn't exist or may have moved.
                </p>
            </div>

            <Link to="/dashboard">
                <Button variant="secondary">Back to dashboard</Button>
            </Link>

        </div>
    );
}
