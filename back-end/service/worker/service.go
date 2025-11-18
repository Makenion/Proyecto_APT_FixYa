package worker

import (
	"context"
	"strings"

	"github.com/NicoHernandezR/Go-backend-proyecto-titulo/types/workermodel"
)

// TODO pasar esto a algun utils o algo
const SecretKey = "secret"

type workerService struct {
	workerStore workermodel.WorkerStore
}

func (w *workerService) CreateWorker(ctx context.Context, workerId uint, worker *workermodel.RegisterWorkerPayload) (*workermodel.WorkerDetail, error) {
	certificates := []workermodel.Certificate{}

	for _, item := range worker.Certificates {
		certificates = append(certificates, workermodel.Certificate{
			Name:            item.Name,
			Url:             item.Url,
			CertificateType: item.CertificateType,
		})
	}

	specialityFilters := map[string]interface{}{
		"names": strings.Join(worker.Specialities, ","),
	}

	specialities, err := w.GetSpecialitiesByFilters(ctx, specialityFilters)
	println("specialities", len(specialities), err)

	if err != nil {
		return nil, err
	}

	newWorker := workermodel.WorkerDetail{
		Balance:      0,
		WorksCount:   0,
		ReviewCount:  0,
		ReviewAvg:    0,
		UserID:       workerId,
		Specialities: specialities,
		Certificates: certificates,
	}

	result, err := w.workerStore.CreateWorker(ctx, &newWorker)

	if err != nil {
		return nil, err
	}

	return result, nil
}

func (w *workerService) UpdateWorker(ctx context.Context, workerId string, worker *workermodel.UpdateWorkerDetailPayload) (*workermodel.WorkerDetail, error) {
	filters := map[string]interface{}{
		"user_id": workerId,
		"limit":   1,
	}
	details, err := w.GetWorkerByFilters(ctx, filters)
	println("details", details)
	if err != nil {
		return nil, err
	}
	if len(details) == 0 {
		return nil, nil
	}

	request, err := w.workerStore.UpdateWorker(ctx, workerId, worker)

	if err != nil {
		return nil, err
	}

	return request, nil
}

func (w *workerService) GetSpecialitiesByFilters(ctx context.Context, filters map[string]interface{}) ([]workermodel.Speciality, error) {
	return w.workerStore.GetSpecialitiesByFilters(ctx, filters)
}

func (w *workerService) GetWorkerByFilters(ctx context.Context, filters map[string]interface{}) ([]workermodel.WorkerDetail, error) {
	return w.workerStore.GetWorkerByFilters(ctx, filters)
}

func NewWorkerService(workerStore workermodel.WorkerStore) *workerService {
	return &workerService{workerStore: workerStore}
}
