import https from "https";
import axios from "axios";

const LIMIT = 100;

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

const getPostsById = (id: number): Promise<Post> => {
	return client.get(`https://jsonplaceholder.typicode.com/posts/${id}`);
}

const buildConcurrentRequests = (limit: number) => {
	const promises = [];
	for (let i = 1; i <= limit; i++) {
		promises.push(getPostsById(i));
	}
	return promises;
}

(async () => {
	const promiseExecutionStartTime = performance.now();
	const response = await Promise.all(buildConcurrentRequests(LIMIT));
	console.log(`Fetched ${response.length} records`);
	const promiseExecutionEndTime = performance.now();
	console.log(`Total time taken to complete batch execution: ${promiseExecutionEndTime - promiseExecutionStartTime}`);
	const endTime = performance.now();
	console.log(`Total time taken to complete execution: ${endTime - startTime}`);
})();