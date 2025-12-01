import Progressbar from "@/components/Progressbar/Progressbar";

export default function ScreenProgressbar() {
    const handleStart = () => {
        console.log("Progress started");
    }

    const handleComplete = () => {
        console.log("Progress completed");
    }
    
	return (
		<>
			<h2>ScreenProgressbar</h2>
			<Progressbar onStart={handleStart} onComplete={handleComplete} />
		</>
	);
}
