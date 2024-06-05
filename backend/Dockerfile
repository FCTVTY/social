# Use an official Golang runtime as the base image
FROM golang:1.22 AS builder

# Set the current working directory inside the container
WORKDIR /app

# Copy the Go module files and download dependencies
COPY go.mod .
COPY go.sum .
COPY config.go .
RUN go mod download

# Copy the rest of the application source code
COPY . .

# Build the Go application
RUN go build -o main .

# Use a minimal base image to reduce the image size
FROM alpine:latest

# Set the current working directory inside the containerå√å
WORKDIR /root/

# Copy the binary from the builder stage to the current directory in the container
COPY --from=builder /app/main .
COPY --from=builder /app/.env.prod .
# Expose port 3001 to the outside world
EXPOSE 3001
# Set the environment variable to "prod"
ENV ENV=prod
# Command to run the Go application
CMD ["./main"]
