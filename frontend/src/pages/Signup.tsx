import { useContext, useState, type ChangeEvent } from "react";
import { Link, useNavigate } from "react-router";
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
            toast.error("Ange ett namn.", {
                position: "top-center",
            });
            return;
        }

        if (!emailRegex.test(data.email)) {
            toast.error("Ogiltig e-postadress.", { position: "top-center" });
            return;
        }

        if (!passwordRegex.test(data.password)) {
            toast.error(
                "Lösenord måste vara minst 8 tecken och innehålla minst en bokstav och en siffra.",
                { position: "top-center" }
            );
            return;
        }

        if (data.password !== data.confirmPassword) {
            toast.error("Lösenorden matchar inte.", {
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
            toast.success("Ditt konto har skapats!", {
                position: "top-center",
            });
            navigate("/login");
        }
    };
    return (
        <div className="flex flex-col min-h-screen items-center justify-center bg-gradient-to-br from-oxford_blue-500 via-sapphire-500 to-yale_blue-500">
            <div
                className="flex flex-col items-center justify-center py-12 px-6 bg-oxford_blue-400/90 border border-oxford_blue-600 
                rounded-2xl shadow-2xl mt-4 mx-4 max-w-md w-full backdrop-blur-md"
            >
                <form
                    onSubmit={handleSubmit}
                    className="flex flex-col gap-8 w-full"
                    noValidate
                >
                    <FormInput
                        type="text"
                        name="firstName"
                        onChange={handleChange}
                        value={data.firstName}
                        placeholder="Förnamn"
                        label="Förnamn"
                        required
                        validationRegex={/^.{3,}$/}
                        errorMessage="Ange ett giltigt namn (minst 3 tecken)."
                    />

                    <FormInput
                        type="text"
                        name="lastName"
                        value={data.lastName}
                        onChange={handleChange}
                        placeholder="Efternamn"
                        label="Efternamn"
                        required
                        validationRegex={/^.{3,}$/}
                        errorMessage="Ange ett giltigt namn (minst 3 tecken)."
                    />

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

                    <FormInput
                        type="password"
                        name="confirmPassword"
                        onChange={handleChange}
                        value={data.confirmPassword}
                        placeholder="Bekräfta lösenord"
                        label="Bekräfta lösenord"
                        required
                        errorMessage="Bekräfta lösenordet."
                    />
                    <div className="flex justify-center my-6">
                        <Button
                            design="outline"
                            className="text-white border-white hover:bg-sapphire-600"
                        >
                            Skapa konto
                        </Button>
                    </div>
                    <p className="text-white">
                        Redan har du ett konto?{" "}
                        <span className="text-[#7a7a7a] cursor-pointer hover:text-black">
                            <Link to="/login">Logga in här.</Link>
                        </span>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Signup;
