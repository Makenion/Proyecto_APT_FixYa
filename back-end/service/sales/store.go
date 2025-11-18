package sales

import (
	"context"
	"fmt"

	"github.com/NicoHernandezR/Go-backend-proyecto-titulo/types/salesmodel"
	"gorm.io/gorm"
)

type Store struct {
	db *gorm.DB
}

func NewStore(db *gorm.DB) *Store {
	return &Store{db: db}
}

func (s *Store) CreateReview(ctx context.Context, review salesmodel.Review) error {
	result := s.db.WithContext(ctx).Model(&salesmodel.Review{}).Create(&review)

	if result.Error != nil {

		return result.Error
	}

	if result.RowsAffected == 0 {

		return fmt.Errorf("failed to create review")
	}

	return nil
}

func (s *Store) GetReviewsByFilters(ctx context.Context, filters map[string]interface{}) ([]salesmodel.Review, error) {
	var users []salesmodel.Review
	query := s.db.WithContext(ctx).Model(&salesmodel.Review{})
	if filters["id"] != nil {
		query = query.Where("ID = ?", filters["id"])
	}
	limit := 10
	if l, ok := filters["limit"].(int); ok && l > 0 {
		limit = l
	}
	offset := 0
	if o, ok := filters["offset"].(int); ok && o >= 0 {
		offset = o
	}
	query = query.Limit(limit).Offset(offset)
	result := query.Find(&users)
	if result.Error != nil {
		return nil, result.Error
	}
	return users, nil
}

func (s *Store) CreateRequest(ctx context.Context, r salesmodel.Request) error {
	result := s.db.WithContext(ctx).Model(&salesmodel.Request{}).Create(&r)

	if result.Error != nil {

		return result.Error
	}

	if result.RowsAffected == 0 {

		return fmt.Errorf("failed to create request")
	}

	return nil
}

func (s *Store) CreateRequestWorker(ctx context.Context, rw salesmodel.RequestWorker) error {
	result := s.db.WithContext(ctx).Model(&salesmodel.RequestWorker{}).Create(&rw)

	if result.Error != nil {

		return result.Error
	}

	if result.RowsAffected == 0 {

		return fmt.Errorf("failed to create request worker")
	}

	return nil
}

func (s *Store) DeleteRequestWorker(ctx context.Context, id uint) error {
	var request salesmodel.RequestWorker
	result := s.db.WithContext(ctx).Model(&salesmodel.RequestWorker{}).Where("id = ?", id).Delete(&request)
	if result.Error != nil {
		return result.Error
	}
	if result.RowsAffected == 0 {
		return fmt.Errorf("failed to delete request worker")
	}
	return nil
}

func (s *Store) DeleteRequest(ctx context.Context, id uint) error {
	var request salesmodel.Request
	result := s.db.WithContext(ctx).Model(&salesmodel.Request{}).Where("id = ?", id).Delete(&request)
	if result.Error != nil {
		return result.Error
	}
	if result.RowsAffected == 0 {
		return fmt.Errorf("failed to delete request")
	}
	return nil
}

func (s *Store) GetRequestsByFilters(ctx context.Context, filters map[string]interface{}) ([]salesmodel.Request, error) {
	var requests []salesmodel.Request
	query := s.db.WithContext(ctx).Model(&salesmodel.Request{})
	if filters["id"] != nil {
		query = query.Where("ID = ?", filters["id"])
	}
	limit := 10
	if l, ok := filters["limit"].(int); ok && l > 0 {
		limit = l
	}
	offset := 0
	if o, ok := filters["offset"].(int); ok && o >= 0 {
		offset = o
	}
	query = query.Limit(limit).Offset(offset)
	result := query.Find(&requests)
	if result.Error != nil {
		return nil, result.Error
	}
	return requests, nil
}

func (s *Store) GetRequestsWorkersByFilters(ctx context.Context, filters map[string]interface{}) ([]salesmodel.RequestWorker, error) {
	var requestWorkers []salesmodel.RequestWorker
	query := s.db.WithContext(ctx).Model(&salesmodel.RequestWorker{})
	if filters["id"] != nil {
		query = query.Where("ID = ?", filters["id"])
	}
	limit := 10
	if l, ok := filters["limit"].(int); ok && l > 0 {
		limit = l
	}
	offset := 0
	if o, ok := filters["offset"].(int); ok && o >= 0 {
		offset = o
	}
	query = query.Limit(limit).Offset(offset)
	result := query.Find(&requestWorkers)
	if result.Error != nil {
		return nil, result.Error
	}
	return requestWorkers, nil
}

func (s *Store) UpdateRequest(ctx context.Context, id string, payload *salesmodel.UpdateRequestPayload) (*salesmodel.Request, error) {
	var request salesmodel.Request
	findResult := s.db.WithContext(ctx).Where("id = ?", id).First(&request)
	if findResult.Error != nil {
		return nil, findResult.Error
	}
	updatePayload := salesmodel.UpdateRequest{
		IsPublic:    payload.IsPublic,
		Title:       payload.Title,
		Description: payload.Description,
		Value:       payload.Value,
		EndsAt:      payload.EndsAt,
		Status:      payload.Status,
	}
	result := s.db.WithContext(ctx).Model(&request).Updates(updatePayload)
	if result.Error != nil {
		return nil, result.Error
	}
	if len(payload.Notes) > 0 {
		notesResult := s.db.WithContext(ctx).Model(&request).Association("Notes").Replace(payload.Notes)
		if notesResult != nil {
			return nil, notesResult
		}
	}
	if len(payload.Images) > 0 {
		imagesResult := s.db.WithContext(ctx).Model(&request).Association("Images").Replace(payload.Images)
		if imagesResult != nil {
			return nil, imagesResult
		}
	}
	s.db.WithContext(ctx).Preload("Notes").First(&request, request.ID)
	s.db.WithContext(ctx).Preload("Images").First(&request, request.ID)
	return &request, nil
}
func (s *Store) UpdateRequestWorker(ctx context.Context, id string, payload *salesmodel.UpdateRequestWorkerPayload) (*salesmodel.RequestWorker, error) {
	var requestWorker salesmodel.RequestWorker
	findResult := s.db.WithContext(ctx).Where("id = ?", id).First(&requestWorker)
	if findResult.Error != nil {
		return nil, findResult.Error
	}
	result := s.db.WithContext(ctx).Model(&requestWorker).Updates(payload)
	if result.Error != nil {
		return nil, result.Error
	}
	return &requestWorker, nil
}
