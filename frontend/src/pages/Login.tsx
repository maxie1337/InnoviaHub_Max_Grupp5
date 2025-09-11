import { useContext, useState, type ChangeEvent, type FormEvent } from "react";
import { UserContext } from "../context/UserContext.tsx";
import { Link, useLocation, useNavigate } from "react-router";
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
            toast.error("Fyll i både e-post och lösenord.", {
                position: "top-center",
            });
        }
        const success = await login(data.email, data.password);

        if (success) {
            toast.success("Du är inloggad!", { position: "top-center" });
            const redirectPath = location.state?.from?.pathname || "/";
            navigate(redirectPath, { replace: true });
        } else {
            toast.error("Felaktigt användarnamn eller lösenord!", {
                position: "top-center",
            });
        }
    };

    return (
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
                    />
                    <FormInput
                        type="password"
                        name="password"
                        onChange={handleChange}
                        value={data.password}
                        placeholder="Lösenord"
                        label="Lösenord"
                        required
                    />
                    <Button design="outline" className="text-black">Logga in</Button>
                    <p>
                        Inget konto?{" "}
                        <span className="text-[#7a7a7a] cursor-pointer hover:text-black">
                            <Link to="/signup">Skapa konto här.</Link>
                        </span>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Login;
