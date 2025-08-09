# AWS Lambda Execution Visualizer

An interactive web application that demonstrates how AWS Lambda functions execute, including cold starts, warm starts, concurrent executions, and container lifecycle management.

## Features

- **Visual Container Management**: See Lambda containers being created, executed, and managed in real-time
- **Cold Start Simulation**: Experience the full cold start process with realistic timing
- **Warm Start Demonstration**: Compare performance with container reuse
- **Concurrent Execution**: Visualize how AWS Lambda handles multiple simultaneous requests
- **Performance Metrics**: Track response times, cold starts, and active containers
- **Real-time Logging**: Detailed execution log with timestamps and color coding

## Live Demo

🚀 **[Try the live demo here](https://[username].github.io/aws-lambda-execution-visualizer/)**

## How to Run Locally

1. Clone this repository:
   ```bash
   git clone https://github.com/[username]/aws-lambda-execution-visualizer.git
   cd aws-lambda-execution-visualizer
   ```

2. Open `index.html` in your web browser, or serve it locally:
   ```bash
   # Using Python 3
   python -m http.server 8000
   
   # Using Python 2
   python -m SimpleHTTPServer 8000
   
   # Using Node.js (if you have http-server installed)
   npx http-server
   ```

3. Navigate to `http://localhost:8000` in your browser

4. Click the simulation buttons to see different Lambda execution scenarios
5. Watch the visual containers and metrics update in real-time
6. Check the execution log for detailed information

## What You'll Learn

### Cold Start Process
- Container initialization (100-3000ms typical)
- Runtime setup and code loading
- Performance impact on first requests
- When cold starts occur

### Warm Start Benefits
- Container reuse (1-100ms typical)
- Significant performance improvement
- How AWS optimizes for subsequent requests

### Concurrency Behavior
- One container per concurrent execution
- Automatic scaling based on demand
- Container lifecycle management
- Resource optimization strategies

## Simulation Scenarios

### Cold Start
Demonstrates the complete cold start process when no warm containers are available.

### Warm Start  
Shows how existing containers are reused for better performance.

### Concurrent Requests
Simulates multiple simultaneous requests requiring multiple containers.

### High Load Test
Tests system behavior under sustained high request volume.

## Key Concepts Visualized

- **Container States**: Cold, Warm, Executing, Idle
- **Execution Timeline**: Visual representation of request processing
- **Performance Metrics**: Response times, cold start frequency
- **Resource Management**: Container creation and cleanup

## Sample Lambda Function

```javascript
exports.handler = async (event) => {
    // This code runs after container initialization
    console.log('Processing request:', event);
    
    // Your business logic here
    const result = await processData(event.data);
    
    return {
        statusCode: 200,
        body: JSON.stringify({
            message: 'Success',
            result: result,
            timestamp: new Date().toISOString()
        })
    };
};
```

## Understanding the Visualization

- **Red Containers**: Cold start in progress
- **Green Containers**: Warm and ready for reuse
- **Blue Containers**: Currently executing requests
- **Gray Containers**: Idle (will be cleaned up)

Perfect for understanding AWS Lambda performance characteristics and optimization strategies!

## Deployment

This project is designed to be hosted on GitHub Pages:

1. Fork or create a new repository on GitHub
2. Upload all files to the repository
3. Go to repository Settings → Pages
4. Select "Deploy from a branch" and choose "main" branch
5. Your site will be available at `https://[username].github.io/[repository-name]/`

## Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.