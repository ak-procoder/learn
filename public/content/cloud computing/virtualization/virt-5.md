---
id: virt-5
title: Docker - Container Platform
type: text
---

## What is Docker?

**Definition**: Platform for developing, shipping, and running applications in containers

**Components**:
- **Docker Engine**: Container runtime
- **Docker CLI**: Command-line interface
- **Docker Desktop**: Desktop application (Windows/Mac)
- **Docker Hub**: Public container registry
- **Docker Compose**: Multi-container applications

## Docker Architecture

### Components

**Docker Daemon (dockerd)**:
- Runs on host
- Manages containers, images, networks, volumes
- Listens for Docker API requests

**Docker Client (docker)**:
- Command-line tool
- Communicates with daemon
- User interface to Docker

**Docker Registry**:
- Stores Docker images
- Public (Docker Hub) or private
- Push and pull images

**Architecture**:
```
[Docker Client] --API--> [Docker Daemon]
                              |
                              +-- [Containers]
                              +-- [Images]
                              +-- [Networks]
                              +-- [Volumes]
                              |
                         [Registry]
```

## Docker Images

### Creating Images

**Dockerfile**: Text file with instructions

**Example Dockerfile**:
```dockerfile
# Base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application code
COPY . .

# Expose port
EXPOSE 3000

# Define startup command
CMD ["node", "server.js"]
```

### Dockerfile Instructions

**FROM**: Base image

**WORKDIR**: Set working directory

**COPY/ADD**: Copy files into image

**RUN**: Execute commands (build time)

**CMD**: Default command (runtime)

**ENTRYPOINT**: Configurable command

**EXPOSE**: Document ports

**ENV**: Set environment variables

**ARG**: Build arguments

**VOLUME**: Define mount points

### Image Layers

**Layer Caching**:
- Each instruction creates a layer
- Layers are cached
- Unchanged layers reused
- Order matters for build speed

**Best Practices**:
- Order commands by change frequency
- Combine commands with &&
- Use .dockerignore
- Multi-stage builds

### Multi-Stage Builds

**Purpose**: Smaller final images

**Example**:
```dockerfile
# Build stage
FROM node:18 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Production stage
FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY package*.json ./
RUN npm ci --only=production
CMD ["node", "dist/server.js"]
```

**Benefits**:
- Smaller images
- Exclude build tools
- Security improvement

## Docker Containers

### Container Lifecycle

**Create**:
```bash
docker create <image>
```

**Start**:
```bash
docker start <container>
```

**Run** (create + start):
```bash
docker run <image>
```

**Stop**:
```bash
docker stop <container>
```

**Remove**:
```bash
docker rm <container>
```

### Common Container Commands

**Run container**:
```bash
docker run -d -p 8080:80 --name myapp nginx
```
- `-d`: Detached mode
- `-p`: Port mapping (host:container)
- `--name`: Container name

**List containers**:
```bash
docker ps        # Running containers
docker ps -a     # All containers
```

**View logs**:
```bash
docker logs <container>
docker logs -f <container>  # Follow
```

**Execute command**:
```bash
docker exec -it <container> /bin/bash
```

**Inspect container**:
```bash
docker inspect <container>
```

**Container stats**:
```bash
docker stats
```

## Docker Networking

### Network Types

**Bridge** (default):
- Private network
- Containers can communicate
- NAT to outside

**Host**:
- Use host network
- No isolation
- Better performance

**None**:
- No networking
- Complete isolation

**Custom Bridge**:
- User-defined networks
- Better isolation
- Service discovery

**Commands**:
```bash
docker network create mynetwork
docker run --network mynetwork myapp
```

## Docker Volumes

### Storage Types

**Volumes** (Recommended):
- Managed by Docker
- Persist data
- Can be shared

**Bind Mounts**:
- Map host directory
- Direct access
- Development use

**tmpfs Mounts**:
- Memory storage
- Temporary data

**Commands**:
```bash
docker volume create mydata
docker run -v mydata:/data myapp
docker run -v /host/path:/container/path myapp
```

## Docker Compose

### Multi-Container Applications

**docker-compose.yml**:
```yaml
version: '3.8'
services:
  web:
    build: .
    ports:
      - "8080:80"
    depends_on:
      - db
    environment:
      - DB_HOST=db
  db:
    image: postgres:15
    volumes:
      - db-data:/var/lib/postgresql/data
    environment:
      - POSTGRES_PASSWORD=secret

volumes:
  db-data:
```

**Commands**:
```bash
docker-compose up -d     # Start services
docker-compose down      # Stop and remove
docker-compose ps        # List services
docker-compose logs      # View logs
```

## Docker Best Practices

**Images**:
- Use official base images
- Keep images small
- Use specific tags (not :latest in prod)
- Scan for vulnerabilities
- Multi-stage builds

**Containers**:
- One process per container
- Don't run as root
- Use read-only filesystems when possible
- Set resource limits
- Health checks

**Security**:
- Regularly update images
- Scan for vulnerabilities
- Use secrets management
- Limit container privileges
- Network segmentation
