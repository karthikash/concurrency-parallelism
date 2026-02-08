import {Worker} from "worker_threads";
import os from "os";
import path from "path";

const TOTAL_REQUESTS = 1000;
const THREADS = os.cpus().length; // 8 for you

for (let i = 0; i < THREADS; i++) {
	const startIndex = Math.floor((i * TOTAL_REQUESTS) / THREADS) + 1;
	const endIndex = Math.floor(((i + 1) * TOTAL_REQUESTS) / THREADS);

	const worker = new Worker(
		path.resolve(__dirname, "../dist/worker.js"),
		{
			workerData: {startIndex, endIndex}
		}
	);

	worker.on("message", msg => {
		console.log(`Worker ${i} done`, msg);
	});

	worker.on("error", console.error);
}
