# Concurrency & Threads

This repository contains small experiments to understand:
- async concurrency in Node.js
- batching of async operations
- parallel execution using `worker_threads`

---

## Files Overview

| File | Description |
|---|---|
| `concurrency.ts` | Simple async concurrency example |
| `concurrency-with-batch.ts` | Async batching logic (single-threaded) |
| `threads.ts` | Spawns worker threads and distributes work |
| `worker.ts` | Worker thread that executes batched logic |

---

## How to Run

### 1. Run simple async concurrency

```bash
ts-node .\src\concurrency.ts
```

### 2. Concurrency with batch

```bash
ts-node .\src\concurrency-with-batch.ts  
```

### 3. Concurrency with batch and worker threads
```bash
tsc
ts-node .\src\threads.ts  
```