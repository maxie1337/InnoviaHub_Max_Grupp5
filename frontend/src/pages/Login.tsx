import { useContext, useState, type ChangeEvent, type FormEvent } from "react";
import { UserContext } from "../context/UserContext.tsx";
import { Link, useLocation, useNavigate } from "react-router";
import toast from "react-hot-toast";
import FormInput from "../components/Form/FormInput.tsx";
import Button from "../components/Button/Button.tsx";
import Navbar from "../components/navbar";

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
            toast.error("Fyll i både e-post och lösenord.", {
                position: "top-center",
            });
            return;
        }

        const success = await login(data.email, data.password);

        if (success) {
            toast.success("Du är inloggad!", { position: "top-center" });
            
            // Wait a bit for state to update, then check role
            setTimeout(() => {
                const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
                console.log('Login successful, user role:', currentUser.role);
                if (currentUser.role === "Admin") {
                    console.log('Admin user detected, redirecting to admin dashboard');
                    navigate("/admin/dashboard", { replace: true });
                } else {
                    console.log('Regular user detected, redirecting to main page');
                    const redirectPath = location.state?.from?.pathname || "/";
                    navigate(redirectPath, { replace: true });
                }
            }, 100);
        } else {
            toast.error("Felaktigt användarnamn eller lösenord!", {
                position: "top-center",
            });
        }
    };

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <div className="flex flex-col min-h-screen items-center justify-center">
                <div className="flex flex-col items-center justify-center py-8 px-6 bg-delft_blue-900 border-delft_blue-100 border-2 rounded-xl mt-4 mx-4 gap-8">
                <h1 className="text-3xl font-bold">Logga in</h1>
                <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                    <FormInput
                        type="email"
                        name="email"
                        onChange={handleChange}
                        value={data.email}
                        placeholder="E-post"
                        label="E-post"
                        required
                        validationRegex={/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/}
                        errorMessage="Ange en giltig e-postadress."
                    />
                    <FormInput
                        type="password"
                        name="password"
                        onChange={handleChange}
                        value={data.password}
                        placeholder="Lösenord"
                        label="Lösenord"
                        required
                        validationRegex={
                            /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z\d])[A-Za-z\d\S]{8,}$/
                        }
                        errorMessage="Lösenordet måste vara minst 8 tecken, innehålla en bokstav, en siffra och ett specialtecken."
                    />
                    <div className="flex justify-center my-6">
                        <Button
                            design="outline"
                            className="text-white border-white hover:bg-sapphire-600"
                        >
                            Logga in
                        </Button>
                    </div>

                    <p className="text-white">
                        Inget konto?{" "}
                        <span className="text-[#7a7a7a] cursor-pointer hover:text-black">
                            <Link to="/signup">Skapa konto här.</Link>
                        </span>
                    </p>
                </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
