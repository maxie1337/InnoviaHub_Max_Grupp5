type ButtonProps = {
    children: React.ReactNode;
    design?: "outline" | "nav" | "outline-small" | "default";
    type?: "button" | "submit" | "reset";
    className?: string;
    disabled?: boolean;
    onClick?: () => void;
};

const Button = ({ children, onClick, className, design }: ButtonProps) => {
    if (design === "outline") {
        return (
            <button
                className={
                    className +
                    " " +
                    "transition flex items-center justify-center cursor-pointer w-fit h-[45px] sm:h-[55px] border-solid border-2 rounded-md text-sm sm:text-xl font-semibold text-center px-4 py-2 uppercase italic"
                }
                onClick={onClick}
            >
                {children}
            </button>
        );
    }
    return (
        <button
            className={
                className +
                " " +
                "cursor-pointer w-[240px] h-[45px] border-black border-solid border-2 rounded-2xl text-black hover:bg-white"
            }
            type="submit"
            onClick={onClick}
        >
            {children}
        </button>
    );
};

export default Button;
