FROM golang:1.23.4-alpine3.21 AS builder
WORKDIR /pixil-backend
COPY . .
RUN go build -o main .
CMD ["/pixil-backend/main"]
