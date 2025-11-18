package salesmodel

import "context"

type SaleService interface {
	CreateReview(ctx context.Context, payload *RegisterReviewPayload) (*Review, error)
	GetReviewsByFilters(ctx context.Context, filters map[string]interface{}) ([]Review, error)
	CreateRequest(ctx context.Context, userId uint, payload *RegisterRequestPayload) (*Request, error)
	CreateRequestWorker(ctx context.Context, workerId uint, payload *RegisterRequestWorkerPayload) (*RequestWorker, error)
	DeleteRequestWorker(ctx context.Context, id uint) error
	DeleteRequest(ctx context.Context, id uint) error
	GetRequestsByFilters(ctx context.Context, filters map[string]interface{}) ([]Request, error)
	GetRequestsWorkersByFilters(ctx context.Context, filters map[string]interface{}) ([]RequestWorker, error)
	UpdateRequest(ctx context.Context, id string, payload *UpdateRequestPayload) (*Request, error)
	UpdateRequestWorker(ctx context.Context, id string, payload *UpdateRequestWorkerPayload) (*RequestWorker, error)
}

type SaleStore interface {
	CreateReview(ctx context.Context, review Review) error
	GetReviewsByFilters(ctx context.Context, filters map[string]interface{}) ([]Review, error)
	CreateRequest(ctx context.Context, r Request) error
	CreateRequestWorker(ctx context.Context, rw RequestWorker) error
	DeleteRequestWorker(ctx context.Context, id uint) error
	DeleteRequest(ctx context.Context, id uint) error
	GetRequestsByFilters(ctx context.Context, filters map[string]interface{}) ([]Request, error)
	GetRequestsWorkersByFilters(ctx context.Context, filters map[string]interface{}) ([]RequestWorker, error)
	UpdateRequest(ctx context.Context, id string, payload *UpdateRequestPayload) (*Request, error)
	UpdateRequestWorker(ctx context.Context, id string, payload *UpdateRequestWorkerPayload) (*RequestWorker, error)
}
