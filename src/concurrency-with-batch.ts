import https from "https";
import axios from "axios";

const httpsAgent = new https.Agent({
	keepAlive: true,
	maxSockets: 100,
});

const client = axios.create({
	httpsAgent
});

const startTime = performance.now();

interface BatchIndexes {
	startIndex: number;
	endIndex: number;
}

interface Post {
	id: number;
	userId: number;
	title: string;
	body: string;
}

const TOTAL_REQUESTS = 100;
const BATCH_SIZE = 4;

const getPostsById = (id: number): Promise<Post> => {
	return client.get(`https://jsonplaceholder.typicode.com/posts/${id}`);
}

const getBatchIndexes = (totalRequests: number, batchSize: number): BatchIndexes[] => {
	const batchIndexes: BatchIndexes[] = [];
	for (let i = 0; i < batchSize; i++) {
		const startIndex = Math.floor((i * totalRequests) / batchSize) + 1;
		const endIndex = Math.floor(((i + 1) * totalRequests) / batchSize);
		batchIndexes.push({startIndex, endIndex})
	}
	return batchIndexes;
}

const buildConcurrentRequests = () => {
	const batchPromises = [];
	const batchIndexes: BatchIndexes[] = getBatchIndexes(TOTAL_REQUESTS, BATCH_SIZE);
	for (const batch of batchIndexes) {
		const promises = [];
		for (let i = batch.startIndex; i <= batch.endIndex; i++) {
			promises.push(getPostsById(i));
		}
		batchPromises.push(promises);
	}
	return batchPromises;
}

const executeBatchPromises = async () => {
	const batchPromises = buildConcurrentRequests();
	for (const [index, batch] of batchPromises.entries()) {
		const batchExecutionStartTime = performance.now();
		const response = await Promise.all(batch);
		console.log(`Fetched ${response.length} records from index ${index}`)
		const batchExecutionEndTime = performance.now();
		console.log(`Total time to complete batch ${index + 1}: ${batchExecutionEndTime - batchExecutionStartTime}`);
	}
}

export const run = async (batchIndexes: BatchIndexes) => {
	const {startIndex, endIndex} = batchIndexes;
	for (let i = startIndex; i <= endIndex; i++) {
		const promiseExecutionStartTime = performance.now();
		await executeBatchPromises();
		const promiseExecutionEndTime = performance.now();
		console.log(`Total time taken to complete batch ${i} execution: ${promiseExecutionEndTime - promiseExecutionStartTime}`);
	}

	const endTime = performance.now();
	console.log(`Total time taken to complete execution: ${endTime - startTime}`);
	console.log('--------------------------------------------------------------');
}

// For running concurrency with batch on single thread.
// run({ startIndex: 1, endIndex: 10 });