import { useEffect } from "react";

const ReloadPageAfterDelay = () => {
    useEffect(() => {
        // Set a delay of 2 seconds before reloading the page
        const timer = setTimeout(() => {
            window.location.reload();
        }, 5000); // 2000ms = 2 seconds

        // Cleanup the timer if the component unmounts
        return () => clearTimeout(timer);
    }, []); // Empty dependency array means this effect runs only once when the component mounts

    return (
        <div>
            <h1>Page will reload in 2 seconds...</h1>
        </div>
    );
};

export default ReloadPageAfterDelay;
