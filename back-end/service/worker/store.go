package worker

import (
	"context"
	"fmt"
	"strings"

	"github.com/NicoHernandezR/Go-backend-proyecto-titulo/types/workermodel"
	"gorm.io/gorm"
)

type Store struct {
	db *gorm.DB
}

func NewStore(db *gorm.DB) *Store {
	return &Store{db: db}
}

func (s *Store) CreateWorker(ctx context.Context, worker *workermodel.WorkerDetail) (*workermodel.WorkerDetail, error) {
	result := s.db.WithContext(ctx).Model(&workermodel.WorkerDetail{}).Create(&worker)

	if result.Error != nil {

		return nil, result.Error
	}

	if result.RowsAffected == 0 {

		return nil, fmt.Errorf("failed to create worker")
	}

	getWorker := workermodel.WorkerDetail{}
	workerResult := s.db.WithContext(ctx).Preload("Specialities").Preload("Certificates").First(&getWorker, worker.ID)

	if workerResult.Error != nil {
		return nil, workerResult.Error
	}

	return &getWorker, nil
}

func (s *Store) UpdateWorker(ctx context.Context, workerId string, worker *workermodel.UpdateWorkerDetailPayload) (*workermodel.WorkerDetail, error) {
	var detail workermodel.WorkerDetail
	findResult := s.db.WithContext(ctx).Where("UserID = ?", workerId).First(&detail)
	if findResult.Error != nil {
		return nil, findResult.Error
	}
	data := workermodel.UpdateWorkerDetail{}

	if worker.Description != nil {
		data.Description = worker.Description
	}

	if worker.AvailabilityText != nil {
		data.AvailabilityText = worker.AvailabilityText
	}

	result := s.db.WithContext(ctx).Model(&detail).Updates(data)
	if result.Error != nil {
		return nil, result.Error
	}

	if len(worker.Certificates) > 0 {
		certificatesResult := s.db.WithContext(ctx).Model(&detail).Association("Certificates").Replace(worker.Certificates)
		if certificatesResult != nil {
			return nil, certificatesResult
		}
	}

	if len(worker.Specialities) > 0 {
		specialitiesResult := s.db.WithContext(ctx).Model(&detail).Association("Specialities").Replace(worker.Specialities)
		if specialitiesResult != nil {
			return nil, specialitiesResult
		}
	}
	s.db.WithContext(ctx).Preload("Certificates").First(&detail, detail.ID)
	s.db.WithContext(ctx).Preload("Specialities").First(&detail, detail.ID)
	return &detail, nil
}

func (s *Store) GetSpecialitiesByFilters(ctx context.Context, filters map[string]interface{}) ([]workermodel.Speciality, error) {
	var specialities []workermodel.Speciality
	var expectedCount *int
	query := s.db.WithContext(ctx).Model(&workermodel.Speciality{})
	if filters["id"] != nil {
		query = query.Where("ID = ?", filters["id"])
	}
	if filters["names"] != nil {
		names := strings.Split(filters["names"].(string), ",")
		count := len(names)
		expectedCount = &count
		query = query.Where("name IN ?", names)
	}
	limit := 100
	if l, ok := filters["limit"].(int); ok && l > 0 {
		limit = l
	}
	offset := 0
	if o, ok := filters["offset"].(int); ok && o >= 0 {
		offset = o
	}
	query = query.Limit(limit).Offset(offset)
	result := query.Find(&specialities)
	println("result", result)

	if result.Error != nil {
		return nil, result.Error
	}
	if expectedCount != nil && *expectedCount != len(specialities) {
		return nil, fmt.Errorf("se esperaban %d especialidades, pero se encontraron %d", *expectedCount, len(specialities))
	}
	return specialities, nil
}

func (s *Store) GetWorkerByFilters(ctx context.Context, filters map[string]interface{}) ([]workermodel.WorkerDetail, error) {
	var details []workermodel.WorkerDetail
	query := s.db.WithContext(ctx).Model(&workermodel.WorkerDetail{})
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
	result := query.Find(&details)
	if result.Error != nil {
		return nil, result.Error
	}
	return details, nil
}
