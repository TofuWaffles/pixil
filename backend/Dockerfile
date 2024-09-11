FROM golang:1.19.0-alpine3.16 AS builder
WORKDIR /pixil-backend
COPY . .
RUN go build -o main .
CMD ["/pixil-backend/main"]
