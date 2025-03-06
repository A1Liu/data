package main

import (
	"context"
	"log"

	"a1liu.com/data/api/server"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	"github.com/awslabs/aws-lambda-go-api-proxy/httpadapter"
)

var adapter *httpadapter.HandlerAdapter

func init() {
	srv := server.CreateGqlServer()
	adapter = httpadapter.New(srv)

}

func lambdaHandler(ctx context.Context, req events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	rsp, err := adapter.ProxyWithContext(ctx, req)
	if err != nil {
		log.Println(err)
	}
	return rsp, err
}

func main() {
	lambda.Start(lambdaHandler)
}
