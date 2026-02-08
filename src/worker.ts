import {workerData, parentPort} from "worker_threads";
import {run} from "./concurrency-with-batch";

(async () => {
	const {startIndex, endIndex} = workerData;

	await run({startIndex, endIndex});

	parentPort?.postMessage({
		startIndex,
		endIndex,
		status: "done"
	});
})();
