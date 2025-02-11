FROM golang:1.23.4-alpine3.21 AS builder
RUN apk update
RUN apk add ffmpeg
WORKDIR /backend
COPY . .
RUN go build -o main .
CMD ["/backend/main"]
