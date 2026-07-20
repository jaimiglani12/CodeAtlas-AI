import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { AlertCircle } from "lucide-react";

import Input from "../common/Input";
import Button from "../common/Button";
import Spinner from "../common/Spinner";
import { useAuth } from "../../context/AuthContext";
import * as authApi from "../../api/auth";

interface FormValues {
    username: string;
    email: string;
    password: string;
}

export default function SignupForm() {

    const { login } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { isSubmitting, errors },
    } = useForm<FormValues>();

    async function onSubmit(values: FormValues) {
        setError(null);
        try {
            await authApi.signup(values);
        } catch {
            setError("Couldn't create that account. The username or email may already be taken.");
            return;
        }

        try {
            await login(values.email, values.password);
            navigate("/dashboard");
        } catch {
            setError("Account created, but automatic login failed. Please log in.");
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

            <div>
                <label className="mb-1.5 block text-xs font-medium text-parchment-dim">
                    Username
                </label>
                <Input
                    placeholder="jai"
                    {...register("username", { required: true, minLength: 3 })}
                />
                {errors.username && (
                    <p className="mt-1.5 text-xs text-walnut-300">At least 3 characters.</p>
                )}
            </div>

            <div>
                <label className="mb-1.5 block text-xs font-medium text-parchment-dim">
                    Email
                </label>
                <Input
                    type="email"
                    placeholder="jai@company.com"
                    {...register("email", { required: true })}
                />
                {errors.email && (
                    <p className="mt-1.5 text-xs text-walnut-300">Enter a valid email.</p>
                )}
            </div>

            <div>
                <label className="mb-1.5 block text-xs font-medium text-parchment-dim">
                    Password
                </label>
                <Input
                    type="password"
                    placeholder="••••••••"
                    {...register("password", { required: true, minLength: 8 })}
                />
                {errors.password && (
                    <p className="mt-1.5 text-xs text-walnut-300">At least 8 characters.</p>
                )}
            </div>

            {error && (
                <div className="flex items-start gap-2 rounded-sm border border-walnut-700 bg-ink px-3.5 py-3 text-sm text-walnut-300">
                    <AlertCircle size={16} className="mt-0.5 shrink-0" />
                    {error}
                </div>
            )}

            <Button type="submit" className="w-full justify-center" disabled={isSubmitting}>
                {isSubmitting ? <Spinner size={16} /> : "Create account"}
            </Button>

            <p className="text-center text-sm text-parchment-dim">
                Already have an account?{" "}
                <Link to="/login" className="text-olive-500 hover:text-olive-300">
                    Log in
                </Link>
            </p>

        </form>
    );
}
