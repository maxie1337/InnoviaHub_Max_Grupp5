import { useEffect, useRef } from "react";
import Lottie from "lottie-react";
import LoadingSpinner from "@/components/AnimatedIcons/simple-loading.json";

type AnimatedSimpleLoadingProps = {
    loop?: boolean;
    autoplay?: boolean;
    style?: React.CSSProperties;
};

const AnimatedSimpleLoading = ({
    loop = true,
    autoplay = true,
    style = {},
}: AnimatedSimpleLoadingProps) => {
    const lottieRef = useRef<any>(null);

    useEffect(() => {
        if (lottieRef.current) {
            lottieRef.current.play();
        }
    }, []);

    return (
        <Lottie
            lottieRef={lottieRef}
            animationData={LoadingSpinner}
            loop={loop}
            autoplay={autoplay}
            style={{ width: 100, height: 100, ...style }}
        />
    );
};

export default AnimatedSimpleLoading;
