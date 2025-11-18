package workermodel

import "context"

type WorkerService interface {
	CreateWorker(ctx context.Context, workerId uint, worker *RegisterWorkerPayload) (*WorkerDetail, error)
	UpdateWorker(ctx context.Context, workerId string, worker *UpdateWorkerDetailPayload) (*WorkerDetail, error)
	GetWorkerByFilters(ctx context.Context, filters map[string]interface{}) ([]WorkerDetail, error)
	GetSpecialitiesByFilters(ctx context.Context, filters map[string]interface{}) ([]Speciality, error)
}

type WorkerStore interface {
	CreateWorker(ctx context.Context, worker *WorkerDetail) (*WorkerDetail, error)
	UpdateWorker(ctx context.Context, workerId string, worker *UpdateWorkerDetailPayload) (*WorkerDetail, error)
	GetWorkerByFilters(ctx context.Context, filters map[string]interface{}) ([]WorkerDetail, error)
	GetSpecialitiesByFilters(ctx context.Context, filters map[string]interface{}) ([]Speciality, error)
}
