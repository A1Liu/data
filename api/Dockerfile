FROM golang:1.22-alpine AS builder

EXPOSE 8080
WORKDIR /api

COPY ./go.sum ./
COPY ./go.mod ./

RUN go mod download

COPY ./api ./api

RUN go build ./api/server.go

CMD ["./server"]
