FROM golang:1.22-alpine AS builder

EXPOSE 8080
WORKDIR /api

COPY ./go.sum ./
COPY ./go.mod ./

RUN go mod download

COPY ./api ./api

RUN --mount=type=cache,target=/root/.cache/go-build \
  go build ./api/cmd/server/main.go

CMD ["./main"]
