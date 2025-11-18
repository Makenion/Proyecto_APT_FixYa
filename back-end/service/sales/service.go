package sales

import (
	"context"
	"time"

	"github.com/NicoHernandezR/Go-backend-proyecto-titulo/types/salesmodel"
)

type saleService struct {
	saleStore salesmodel.SaleStore
}

func NewSaleService(saleStore salesmodel.SaleStore) *saleService {
	return &saleService{saleStore: saleStore}
}

func (s *saleService) GetReviewsByFilters(ctx context.Context, filters map[string]interface{}) ([]salesmodel.Review, error) {
	return s.saleStore.GetReviewsByFilters(ctx, filters)
}

func (s *saleService) GetRequestsByFilters(ctx context.Context, filters map[string]interface{}) ([]salesmodel.Request, error) {
	return s.saleStore.GetRequestsByFilters(ctx, filters)
}

func (s *saleService) GetRequestsWorkersByFilters(ctx context.Context, filters map[string]interface{}) ([]salesmodel.RequestWorker, error) {
	return s.saleStore.GetRequestsWorkersByFilters(ctx, filters)
}

func (s *saleService) DeleteRequestWorker(ctx context.Context, id uint) error {
	return s.saleStore.DeleteRequestWorker(ctx, id)
}

func (s *saleService) DeleteRequest(ctx context.Context, id uint) error {
	return s.saleStore.DeleteRequest(ctx, id)
}

func (s *saleService) CreateReview(ctx context.Context, payload *salesmodel.RegisterReviewPayload) (*salesmodel.Review, error) {
	review := salesmodel.Review{
		Rating:          payload.Rating,
		Title:           payload.Title,
		Description:     payload.Description,
		CreatedAt:       time.Time{},
		WorkerID:        payload.WorkerID,
		RequestWorkerID: payload.RequestWorkerID,
	}
	err := s.saleStore.CreateReview(ctx, review)

	if err != nil {
		return nil, err
	}

	return &review, nil
}

func (s *saleService) CreateRequest(ctx context.Context, userId uint, payload *salesmodel.RegisterRequestPayload) (*salesmodel.Request, error) {
	images := []salesmodel.RequestImage{}
	notes := []salesmodel.RequestNote{}
	for _, image := range payload.Images {
		images = append(images, salesmodel.RequestImage{
			Url:  image.Url,
			Type: image.Type,
		})
	}
	for _, note := range payload.Notes {
		notes = append(notes, salesmodel.RequestNote{
			Url:  note.Url,
			Text: note.Text,
		})
	}
	request := salesmodel.Request{
		IsPublic:     *payload.IsPublic,
		Title:        payload.Title,
		Description:  payload.Description,
		SpecialityID: payload.SpecialityID,
		Value:        payload.Value,
		EndsAt:       payload.EndsAt,
		Status:       payload.Status,
		Location:     payload.Location,
		LocationText: payload.LocationText,
		UserID:       userId,
		Images:       images,
		Notes:        notes,
		CreatedAt:    time.Time{},
	}

	err := s.saleStore.CreateRequest(ctx, request)

	if err != nil {
		return nil, err
	}

	return &request, nil
}

func (s *saleService) CreateRequestWorker(ctx context.Context, workerId uint, payload *salesmodel.RegisterRequestWorkerPayload) (*salesmodel.RequestWorker, error) {
	request := salesmodel.RequestWorker{
		DateStart:      payload.DateStart,
		DateFinish:     payload.DateFinish,
		StatusClient:   salesmodel.RequestStatusTypeProgress,
		Status:         salesmodel.RequestStatusTypeProgress,
		StatusWorker:   payload.StatusWorker,
		RequestID:      payload.RequestID,
		WorkerDetailID: workerId,
	}

	err := s.saleStore.CreateRequestWorker(ctx, request)

	if err != nil {
		return nil, err
	}

	return &request, nil
}

func (s *saleService) UpdateRequest(ctx context.Context, id string, payload *salesmodel.UpdateRequestPayload) (*salesmodel.Request, error) {
	filters := map[string]interface{}{
		"id":    id,
		"limit": 1,
	}
	requests, err := s.GetRequestsByFilters(ctx, filters)
	if err != nil {
		return nil, err
	}
	if len(requests) == 0 {
		return nil, nil
	}

	request, err := s.saleStore.UpdateRequest(ctx, id, payload)

	if err != nil {
		return nil, err
	}

	return request, nil
}
func (s *saleService) UpdateRequestWorker(ctx context.Context, id string, payload *salesmodel.UpdateRequestWorkerPayload) (*salesmodel.RequestWorker, error) {
	filters := map[string]interface{}{
		"id":    id,
		"limit": 1,
	}
	requests, err := s.GetRequestsWorkersByFilters(ctx, filters)
	if err != nil {
		return nil, err
	}
	if len(requests) == 0 {
		return nil, nil
	}

	r, err := s.saleStore.UpdateRequestWorker(ctx, id, payload)
	if err != nil {
		return nil, err
	}

	return r, nil
}
