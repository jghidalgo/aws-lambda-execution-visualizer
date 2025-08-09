// AWS Lambda Execution Simulator
class LambdaSimulator {
    constructor() {
        this.containers = [];
        this.nextContainerId = 1;
        this.metrics = {
            activeContainers: 0,
            totalRequests: 0,
            coldStarts: 0,
            responseTimes: [],
        };
        this.containerPositions = [];
        this.initializePositions();
    }

    initializePositions() {
        // Pre-calculate positions for containers in a grid
        const containerArea = document.getElementById("lambda-containers");
        const cols = 8;
        const rows = 4;

        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                this.containerPositions.push({
                    left: 50 + col * 140,
                    top: 50 + row * 100,
                });
            }
        }
    }

    createContainer(isColdStart = true) {
        const containerId = `lambda-${this.nextContainerId++}`;
        const position = this.containerPositions[this.containers.length % this.containerPositions.length];

        const container = {
            id: containerId,
            status: isColdStart ? "cold" : "warm",
            element: null,
            lastUsed: Date.now(),
            executions: 0,
        };

        // Create DOM element
        const containerEl = document.createElement("div");
        containerEl.className = `lambda-container ${container.status}`;
        containerEl.style.left = `${position.left}px`;
        containerEl.style.top = `${position.top}px`;
        containerEl.innerHTML = `
            <div class="container-id">${containerId}</div>
            <div class="container-status">${container.status}</div>
        `;

        container.element = containerEl;
        document.getElementById("lambda-containers").appendChild(containerEl);

        this.containers.push(container);
        this.updateMetrics();

        if (isColdStart) {
            this.logExecution(`Cold start: Creating new container ${containerId}`, "cold");
            this.metrics.coldStarts++;
        } else {
            this.logExecution(`Reusing warm container ${containerId}`, "warm");
        }

        return container;
    }

    findAvailableContainer() {
        return this.containers.find((c) => c.status === "warm" || c.status === "idle");
    }

    executeRequest(requestId) {
        let container = this.findAvailableContainer();
        let responseTime;

        if (!container) {
            // Cold start required
            container = this.createContainer(true);
            responseTime = Math.random() * 2000 + 500; // 500-2500ms for cold start

            setTimeout(() => {
                container.status = "executing";
                container.element.className = "lambda-container executing";
                container.element.querySelector(".container-status").textContent = "executing";

                setTimeout(() => {
                    container.status = "warm";
                    container.element.className = "lambda-container warm";
                    container.element.querySelector(".container-status").textContent = "warm";
                    container.executions++;
                    this.logExecution(`Request ${requestId} completed in ${Math.round(responseTime)}ms`, "cold");
                }, 1000);
            }, responseTime - 1000);
        } else {
            // Warm start
            responseTime = Math.random() * 50 + 10; // 10-60ms for warm start
            container.status = "executing";
            container.element.className = "lambda-container executing";
            container.element.querySelector(".container-status").textContent = "executing";

            setTimeout(() => {
                container.status = "warm";
                container.element.className = "lambda-container warm";
                container.element.querySelector(".container-status").textContent = "warm";
                container.executions++;
                this.logExecution(`Request ${requestId} completed in ${Math.round(responseTime)}ms`, "warm");
            }, Math.min(responseTime, 100));
        }

        container.lastUsed = Date.now();
        this.metrics.totalRequests++;
        this.metrics.responseTimes.push(responseTime);
        this.updateMetrics();

        return responseTime;
    }

    simulateContainerTimeout() {
        // Simulate containers going idle after 5 minutes (simplified to 10 seconds for demo)
        setInterval(() => {
            const now = Date.now();
            this.containers.forEach((container) => {
                if (container.status === "warm" && now - container.lastUsed > 10000) {
                    container.status = "idle";
                    container.element.className = "lambda-container idle";
                    container.element.querySelector(".container-status").textContent = "idle";
                    this.logExecution(`Container ${container.id} went idle`, "warm");
                }
            });
            this.updateMetrics();
        }, 2000);
    }

    updateMetrics() {
        const activeCount = this.containers.filter((c) => c.status !== "idle").length;
        const avgResponseTime =
            this.metrics.responseTimes.length > 0
                ? Math.round(this.metrics.responseTimes.reduce((a, b) => a + b, 0) / this.metrics.responseTimes.length)
                : 0;

        document.getElementById("active-containers").textContent = activeCount;
        document.getElementById("total-requests").textContent = this.metrics.totalRequests;
        document.getElementById("cold-starts").textContent = this.metrics.coldStarts;
        document.getElementById("avg-response").textContent = `${avgResponseTime}ms`;
    }

    logExecution(message, type = "") {
        const logContent = document.getElementById("log-content");
        const timestamp = new Date().toLocaleTimeString();
        const logEntry = document.createElement("div");
        logEntry.className = `log-entry ${type}`;
        logEntry.textContent = `[${timestamp}] ${message}`;

        logContent.appendChild(logEntry);
        logContent.scrollTop = logContent.scrollHeight;

        // Keep only last 50 entries
        while (logContent.children.length > 50) {
            logContent.removeChild(logContent.firstChild);
        }
    }

    reset() {
        this.containers.forEach((container) => {
            container.element.remove();
        });
        this.containers = [];
        this.nextContainerId = 1;
        this.metrics = {
            activeContainers: 0,
            totalRequests: 0,
            coldStarts: 0,
            responseTimes: [],
        };
        this.updateMetrics();

        const logContent = document.getElementById("log-content");
        logContent.innerHTML = '<div class="log-entry">Simulation reset. Ready for new executions...</div>';
    }
}

// Initialize simulator
const simulator = new LambdaSimulator();

// Simulation functions
function simulateColdStart() {
    simulator.logExecution("Simulating cold start scenario...", "cold");
    simulator.executeRequest(`REQ-${Date.now()}`);
}

function simulateWarmStart() {
    if (simulator.containers.length === 0) {
        simulator.logExecution("No warm containers available. Creating one first...", "warm");
        simulator.createContainer(true);
        setTimeout(() => {
            simulator.containers[0].status = "warm";
            simulator.containers[0].element.className = "lambda-container warm";
            simulator.containers[0].element.querySelector(".container-status").textContent = "warm";
            simulateWarmStart();
        }, 1000);
        return;
    }

    simulator.logExecution("Simulating warm start scenario...", "warm");
    simulator.executeRequest(`REQ-${Date.now()}`);
}

function simulateConcurrentRequests() {
    simulator.logExecution("Simulating 5 concurrent requests...", "concurrent");

    for (let i = 0; i < 5; i++) {
        setTimeout(() => {
            simulator.executeRequest(`CONCURRENT-${Date.now()}-${i}`);
        }, i * 100);
    }
}

function simulateHighLoad() {
    simulator.logExecution("Simulating high load (20 requests over 10 seconds)...", "concurrent");

    for (let i = 0; i < 20; i++) {
        setTimeout(() => {
            simulator.executeRequest(`LOAD-${Date.now()}-${i}`);
        }, i * 500);
    }
}

function resetSimulation() {
    simulator.reset();
}

// Start container timeout simulation
simulator.simulateContainerTimeout();

// Initial log message
simulator.logExecution("AWS Lambda Simulator initialized. Click buttons to simulate different scenarios.", "");

// Add some educational console logs
console.log("=== AWS Lambda Execution Patterns ===");
console.log("Cold Start: New container creation (100-3000ms)");
console.log("Warm Start: Reuse existing container (1-100ms)");
console.log("Concurrency: Multiple containers for parallel requests");
console.log("Container Lifecycle: Active → Warm → Idle → Terminated");
console.log("=== Try the simulation buttons above! ===");
