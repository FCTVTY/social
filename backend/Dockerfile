# Use an official Golang runtime as the base image
FROM golang:1.23 AS builder

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
RUN go build -o /main

# Expose port 3001 to the outside world
EXPOSE 3001
# Set the environment variable to "prod"
ENV ENV=prod
# Command to run the Go application
CMD ["/main"]
