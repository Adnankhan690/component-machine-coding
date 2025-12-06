import { useEffect, useRef, useState } from "react";

export const ConfigType = {
	HOUR: "hh",
	MINUTE: "mm",
	SECOND: "ss",
};

const countDownConfig = {
	[ConfigType.HOUR]: {
		label: "Hours",
		value: 0,
		toMs: 1000 * 60 * 60,
	},
	[ConfigType.MINUTE]: {
		label: "Minutes",
		value: 0,
		toMs: 1000 * 60,
	},
	[ConfigType.SECOND]: {
		label: "Seconds",
		value: 0,
		toMs: 1000,
	},
};

const configSequence = [ConfigType.HOUR, ConfigType.MINUTE, ConfigType.SECOND];

// ✅ Logic to resume -> on pause store the remaining time in initialTimeRef as ms,
// on start use that ms to add to current time and set as initialTimeRef

const formatTime = (miliseconds: number) => {
	// logic to convert -> miliseconds / 1unit of (hour, minute, second) % restrict using (mod[24,60,60])
	// 1unit i.e. 1hour = 1 / (1000 * 60 * 60) ms
	// 1unit i.e. 1minute = 1 / (1000 * 60) ms
	// 1unit i.e. 1second = 1 / 1000 ms
	// 1unit i.e. 1milisecond = 1 ms or 1 % 1000 ms
	const hour = Math.floor(miliseconds / (1000 * 60 * 60)) % 24;
	const minute = Math.floor(miliseconds / (1000 * 60)) % 60;
	const seconds = Math.floor(miliseconds / 1000) % 60;
	const miliSec = miliseconds % 1000;

	const formattedHour = hour.toString().padStart(2, "0");
	const formattedMinute = minute.toString().padStart(2, "0");
	const formattedSeconds = seconds.toString().padStart(2, "0");
	const formattedMiliSec = miliSec.toString().padStart(3, "0");

	return `${formattedHour}:${formattedMinute}:${formattedSeconds}.${formattedMiliSec}`;
};

export default function CountDown() {
	const [configs, setConfigs] = useState(structuredClone(countDownConfig));
	const initialTimeRef = useRef<null | number>(null);
	const intervalRef = useRef<null | number>(null);
	const [time, setTime] = useState(0);

	const handleInputChange = (
		e: React.ChangeEvent<HTMLInputElement>,
		config: string
	) => {
		const { value } = e.target;
		if (isNaN(Number(value))) return;

		const newConfigs = {
			...configs,
			[config]: { ...configs[config], value: Number(value) % 100 },
		};
		setConfigs(newConfigs);
	};

	useEffect(() => {
		console.log(configs);
	}, [configs]);

	const handleStartCountDown = () => {
		if (intervalRef.current) return;

		const currentDate = new Date().getTime();

		const totalMs = configSequence.reduce((acc, curr) => {
			return acc + configs[curr].value * configs[curr].toMs;
		}, 0);

		if (!initialTimeRef.current) {
			initialTimeRef.current = currentDate + totalMs;
		} else {
			// ✅ add the remaining time to current date
			initialTimeRef.current = currentDate + time;
		}

		intervalRef.current = setInterval(() => {
			const now = new Date().getTime();
			const distance = initialTimeRef.current - now;
			setTime(distance);
		}, 100);
	};

	const handleStopCountDown = () => {
		setTime(0);
		initialTimeRef.current = null;
		if (intervalRef.current) {
			clearInterval(intervalRef.current);
			intervalRef.current = null;
		}

		setConfigs(structuredClone(countDownConfig));
	};

	const handlePauseCountDown = () => {
		if (intervalRef.current) {
			clearInterval(intervalRef.current);
			intervalRef.current = null;
		}

		// ✅ set the remaining time to initialTimeRef
		initialTimeRef.current = time;
	};

	const isStartDisabled = configSequence.every(
		(config) => configs[config].value === 0
	);

	return (
		<div>
			<div>
				{configSequence.map((config, index) => {
					return (
						<input
							type="text"
							key={index}
							value={configs[config].value}
							onChange={(e) => handleInputChange(e, config)}
							maxLength={2}
						/>
					);
				})}
			</div>

			<div>{formatTime(time)}</div>

			<div>
				<button disabled={isStartDisabled} onClick={handleStartCountDown}>
					{time === 0 ? "start" : "resume"}
				</button>
				<button onClick={handleStopCountDown}>stop</button>
				<button onClick={handlePauseCountDown}>pause</button>
			</div>
		</div>
	);
}
