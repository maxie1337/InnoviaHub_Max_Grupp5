import { useContext, useState, type ChangeEvent, type FormEvent } from "react";
import { UserContext } from "../context/UserContext.tsx";
import { Link, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import FormInput from "../components/Form/FormInput.tsx";
import Button from "../components/Button/Button.tsx";

const Login = () => {
    const { login } = useContext(UserContext);

    const location = useLocation();
    const navigate = useNavigate();

    const [data, setData] = useState({
        email: "",
        password: "",
    });

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setData({ ...data, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!data.email || !data.password) {
            toast.error("Fill in both email and password.", {
                position: "top-center",
            });
            return;
        }

        const success = await login(data.email, data.password);

        if (success) {
            toast.success("You are logged in!", { position: "top-center" });

            // Wait a bit for state to update, then check role
            setTimeout(() => {
                const currentUser = JSON.parse(
                    localStorage.getItem("user") || "{}"
                );
                console.log("Login successful, user role:", currentUser.role);
                if (currentUser.role === "Admin") {
                    console.log(
                        "Admin user detected, redirecting to admin dashboard"
                    );
                    navigate("/admin/dashboard", { replace: true });
                } else {
                    console.log(
                        "Regular user detected, redirecting to main page"
                    );
                    const redirectPath = location.state?.from?.pathname || "/";
                    navigate(redirectPath, { replace: true });
                }
            }, 100);
        } else {
            toast.error("Incorrect username or password!", {
                position: "top-center",
            });
        }
    };

    return (
        <div className="flex flex-col min-h-screen">
            <div className="flex flex-col min-h-screen items-center justify-center">
                <div className="flex flex-col items-center justify-center py-16 px-12 bg-true_blue-500 border-true_blue-100 border-2 rounded-xl mt-4 mx-4 gap-8 w-full max-w-md md:max-w-lg">
                    <h1 className="text-3xl font-bold text-white">Sign in</h1>
                    <form
                        className="flex flex-col gap-4 w-full"
                        onSubmit={handleSubmit}
                    >
                        <FormInput
                            type="email"
                            name="email"
                            onChange={handleChange}
                            value={data.email}
                            placeholder="Email"
                            label="Email"
                            required
                            validationRegex={/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/}
                            errorMessage="Enter a valid email address."
                        />
                        <FormInput
                            type="password"
                            name="password"
                            onChange={handleChange}
                            value={data.password}
                            placeholder="Password"
                            label="Password"
                            required
                            validationRegex={
                                /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z\d])[A-Za-z\d\S]{8,}$/
                            }
                            errorMessage="The password must be at least 8 characters long and contain a letter, a number and a special character."
                        />
                        <div className="flex justify-center my-6">
                            <Button
                                design="outline"
                                className="text-white border-white hover:bg-sapphire-900 hover:text-black hover:border-black"
                            >
                                Sign in
                            </Button>
                        </div>

                        <p className="text-white">
                            No account?{" "}
                            <span className="cursor-pointer font-semibold hover:text-black">
                                <Link to="/signup">
                                    Create an account here.
                                </Link>
                            </span>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
