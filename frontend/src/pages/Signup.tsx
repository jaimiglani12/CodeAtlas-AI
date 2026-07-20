import AuthLayout from "../layouts/AuthLayout";
import SignupForm from "../components/auth/SignupForm";

export default function Signup() {
    return (
        <AuthLayout
            title="Create your account"
            subtitle="Start mapping your first repository in minutes."
        >
            <SignupForm />
        </AuthLayout>
    );
}
