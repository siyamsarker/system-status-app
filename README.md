# System Status App

A Node.js application that provides real-time system metrics and information through a REST API endpoint. The application collects various system metrics including CPU usage, memory utilization, disk usage, network statistics, and IP information.

## Features

- Real-time system metrics monitoring
- CPU load statistics
- Memory usage information
- Disk usage statistics
- Network interface information
- Public and private IP addresses (IPv4 and IPv6)
- OS information
- Process statistics
- Network traffic monitoring
- Containerized deployment support
- Kubernetes-ready configuration

## Prerequisites

- Node.js 18.x or later
- npm 8.x or later
- Docker 20.x or later (for containerized deployment)
- Kubernetes 1.20+ (for Kubernetes deployment)

## Local Development Setup

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd system-status-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the application:
   ```bash
   node server.js
   ```

The application will be available at `http://localhost:6001`.

## API Endpoints

### GET /api/status

Returns a JSON object containing various system metrics:

```json
{
  "cpu": 25.5,
  "mem": {
    "total": 16777216,
    "used": 8388608,
    "free": 8388608
  },
  "disk": {
    "total": 1000000000,
    "used": 500000000
  },
  "os": {
    "platform": "linux",
    "distro": "Ubuntu",
    "release": "20.04"
  },
  "uptime": 3600,
  "processes": 100,
  "network": {
    "rx": 1000000,
    "tx": 500000
  },
  "privateIpv4": "192.168.1.100",
  "privateIpv6": "fe80::1",
  "publicIpv4": "203.0.113.1",
  "publicIpv6": "2001:db8::1"
}
```

## Docker Deployment

1. Build the Docker image:
   ```bash
   docker build -t status-app:latest .
   ```

2. Run the container:
   ```bash
   docker run -d -p 6001:6001 --name status-app status-app:latest
   ```

The application will be available at `http://localhost:6001`.

## Kubernetes Deployment

The application includes Kubernetes manifests in the `manifests/` directory for deploying to a Kubernetes cluster.

1. Create the namespace:
   ```bash
   kubectl apply -f manifests/namespace.yaml
   ```

2. Create the ConfigMap:
   ```bash
   kubectl apply -f manifests/configmap.yaml
   ```

3. Deploy the application:
   ```bash
   kubectl apply -f manifests/deployment.yaml
   ```

4. Create the service:
   ```bash
   kubectl apply -f manifests/service.yaml
   ```

5. (Optional) Apply HPA for auto-scaling:
   ```bash
   kubectl apply -f manifests/hpa.yaml
   ```

### Kubernetes Configuration Details

The Kubernetes deployment includes:

- Replicated deployment (3 pods by default)
- Resource limits and requests
- Liveness and readiness probes
- Security context configuration
- ConfigMap for environment variables
- Horizontal Pod Autoscaling (optional)
- Non-root user execution

### Resource Requirements

The deployment is configured with the following resource requirements:

```yaml
resources:
  requests:
    cpu: "100m"
    memory: "128Mi"
  limits:
    cpu: "500m"
    memory: "512Mi"
```

### Security Configurations

The deployment implements several security best practices:

- Non-root user execution
- Read-only root filesystem
- Dropped capabilities
- No privilege escalation
- Secure probe configuration

## Environment Variables

- `PORT`: Application port (default: 6001)
- `NODE_ENV`: Node.js environment

## Dependencies

- express: ^5.1.0 - Web framework
- node-fetch: ^3.3.2 - HTTP client
- systeminformation: ^5.25.11 - System metrics collection

## Development Guidelines

1. Never commit `node_modules` to the repository
2. Always use the provided Dockerfile for containerization
3. Follow the security guidelines in Kubernetes deployments
4. Test the application thoroughly before deployment

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

ISC License
