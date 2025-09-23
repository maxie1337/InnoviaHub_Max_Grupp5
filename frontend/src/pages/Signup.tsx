import { useContext, useState, type ChangeEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext.tsx";
import toast from "react-hot-toast";
import FormInput from "../components/Form/FormInput.tsx";
import Button from "../components/Button/Button.tsx";

const Signup = () => {
    const navigate = useNavigate();
    const { register } = useContext(UserContext);

    const [data, setData] = useState({
        email: "",
        firstName: "",
        lastName: "",
        password: "",
        confirmPassword: "",
    });

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setData({ ...data, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
        const passwordRegex =
            /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z\d])[A-Za-z\d\S]{8,}$/;

        // Validation
        if (!data.firstName || !data.lastName) {
            toast.error("Enter a name.", {
                position: "top-center",
            });
            return;
        }

        if (!emailRegex.test(data.email)) {
            toast.error("Invalid email address.", { position: "top-center" });
            return;
        }

        if (!passwordRegex.test(data.password)) {
            toast.error(
                "The password must be at least 8 characters long and contain a letter, a number and a special character.",
                { position: "top-center" }
            );
            return;
        }

        if (data.password !== data.confirmPassword) {
            toast.error("The passwords do not match.", {
                position: "top-center",
            });
            return;
        }

        const success = await register(
            data.email,
            data.firstName,
            data.lastName,
            data.password,
            data.confirmPassword
        );

        if (success) {
            toast.success("Your account has been created!", {
                position: "top-center",
            });
            navigate("/login");
        }
    };
    return (
        <div className="flex flex-col min-h-screen">
            <div className="flex flex-col items-center justify-center my-12">
                <div className="flex flex-col items-center justify-center py-16 px-12 bg-true_blue-500 border-true_blue-100 border-2 rounded-xl mt-4 mx-4 gap-8 w-full max-w-md md:max-w-lg">
                    <h1 className="text-3xl font-bold my-4 text-white">
                        Sign up
                    </h1>
                    <form
                        onSubmit={handleSubmit}
                        className="flex flex-col gap-4 w-full"
                    >
                        <FormInput
                            type="text"
                            name="firstName"
                            onChange={handleChange}
                            value={data.firstName}
                            placeholder="First name"
                            label="First name"
                            required
                            validationRegex={/^.{3,}$/}
                            errorMessage="Enter a valid name (at least 3 characters)."
                        />

                        <FormInput
                            type="text"
                            name="lastName"
                            value={data.lastName}
                            onChange={handleChange}
                            placeholder="Last name"
                            label="Last name"
                            required
                            validationRegex={/^.{3,}$/}
                            errorMessage="Enter a valid name (at least 3 characters)."
                        />

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

                        <FormInput
                            type="password"
                            name="confirmPassword"
                            onChange={handleChange}
                            value={data.confirmPassword}
                            placeholder="Confirm Password"
                            label="Confirm Password"
                            required
                            errorMessage="Confirm the password."
                        />
                        <div className="flex justify-center my-6">
                            <Button
                                design="outline"
                                className="text-white border-white hover:bg-sapphire-900 hover:text-black hover:border-black"
                            >
                                Create account
                            </Button>
                        </div>
                        <p className="text-white">
                            Already have an account?{" "}
                            <span className="font-semibold cursor-pointer hover:text-black">
                                <Link to="/login">Sign in here.</Link>
                            </span>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Signup;
