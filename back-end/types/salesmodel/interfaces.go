package salesmodel

import "context"

type SaleService interface {
	CreateReview(ctx context.Context, payload *RegisterReviewPayload) (*Review, error)
	GetReviewsByFilters(ctx context.Context, filters map[string]interface{}) ([]Review, error)
	CreateRequest(ctx context.Context, userId uint, payload *RegisterRequestPayload) (*Request, error)
	GetRequestsClienteByFilters(ctx context.Context, filters map[string]interface{}) ([]Request, error)
	GetRequestsTrabajadorByFilters(ctx context.Context, filters map[string]interface{}) ([]Request, error)
	CreateRequestWorker(ctx context.Context, payload *RegisterRequestWorkerPayload) (*RequestWorker, error)
	DeleteRequestWorker(ctx context.Context, id uint) error
	DeleteRequest(ctx context.Context, id uint) error
	GetRequestsByFilters(ctx context.Context, filters map[string]interface{}) ([]Request, error)
	GetRequestsWorkersByFilters(ctx context.Context, filters map[string]interface{}) ([]RequestWorker, error)
	GetValueClientByFilters(ctx context.Context, filters map[string]interface{}) ([]RequestValueWorker, error)
	SetStatusValueCliente(ctx context.Context, parametros map[string]interface{}) error
	UpdateRequest(ctx context.Context, id string, payload *UpdateRequestPayload) (*Request, error)
	UpdateRequestWorker(ctx context.Context, id string, payload *UpdateRequestWorkerPayload) (*RequestWorker, error)
	CreateValorPropuesto(ctx context.Context, payload *CreateValorPropuestoPayload) (*RequestValueWorker, error)
}

type SaleStore interface {
	CreateReview(ctx context.Context, review Review) error
	GetReviewsByFilters(ctx context.Context, filters map[string]interface{}) ([]Review, error)
	GetRequestsClienteByFilters(ctx context.Context, filters map[string]interface{}) ([]Request, error)
	GetRequestsTrabajadorByFilters(ctx context.Context, filters map[string]interface{}) ([]Request, error)
	CreateRequest(ctx context.Context, r Request) error
	CreateRequestWorker(ctx context.Context, rw RequestWorker) error
	DeleteRequestWorker(ctx context.Context, id uint) error
	DeleteRequest(ctx context.Context, id uint) error
	GetRequestsByFilters(ctx context.Context, filters map[string]interface{}) ([]Request, error)
	GetRequestsWorkersByFilters(ctx context.Context, filters map[string]interface{}) ([]RequestWorker, error)
	GetValueClientByFilters(ctx context.Context, filters map[string]interface{}) ([]RequestValueWorker, error)
	SetStatusValueCliente(ctx context.Context, parametros map[string]interface{}) error
	UpdateRequest(ctx context.Context, id string, payload *UpdateRequestPayload) (*Request, error)
	UpdateRequestWorker(ctx context.Context, id string, payload *UpdateRequestWorkerPayload) (*RequestWorker, error)
	CreateValorPropuesto(ctx context.Context, payload *RequestValueWorker) (*RequestValueWorker, error)
}
