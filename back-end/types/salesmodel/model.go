package salesmodel

import (
	"errors"
	"math"
	"time"

	"github.com/NicoHernandezR/Go-backend-proyecto-titulo/types/usermodel"
	"github.com/NicoHernandezR/Go-backend-proyecto-titulo/types/workermodel"
	"gorm.io/gorm"
)

type RequestStatusTypeEnum string

const (
	RequestStatusTypeProgress  RequestStatusTypeEnum = "en curso"
	RequestStatusTypePending   RequestStatusTypeEnum = "pendiente"
	RequestStatusTypeCompleted RequestStatusTypeEnum = "completo"
	RequestStatusTypeCanceled  RequestStatusTypeEnum = "cancelado"
)

type RequestImageTypeEnum string

const (
	RequestImageTypeClient RequestImageTypeEnum = "cliente"
	RequestImageTypeWorker RequestImageTypeEnum = "trabajador"
)

type RequestImage struct {
	ID        uint                 `gorm:"primaryKey" json:"id"`
	Url       string               `gorm:"size:100;not null" json:"url"`
	Type      RequestImageTypeEnum `gorm:"type:varchar(20); not null" json:"type"`
	RequestID uint                 `json:"request_id"`                          // Clave foránea
	Request   Request              `gorm:"foreignKey:RequestID" json:"request"` // Referencia
}

type RequestNote struct {
	ID        uint    `gorm:"primaryKey" json:"id"`
	Url       string  `gorm:"size:100;not null" json:"url"`
	Text      string  `gorm:"size:100;not null" json:"text"`
	RequestID uint    `json:"request_id"`                          // Clave foránea
	Request   Request `gorm:"foreignKey:RequestID" json:"request"` // Referencia
}

type Request struct {
	ID           uint                   `gorm:"primaryKey" json:"id"`
	IsPublic     bool                   `gorm:"not null" json:"is_public"`
	Title        string                 `gorm:"size:100;not null" json:"title"`
	Description  string                 `gorm:"size:100;not null" json:"description"`
	SpecialityID uint                   `json:"speciality_id"`                             // Clave foránea
	Speciality   workermodel.Speciality `gorm:"foreignKey:SpecialityID" json:"speciality"` // Referencia
	Value        uint32                 `gorm:"not null" json:"value"`
	CreatedAt    time.Time              `gorm:"not null" json:"created_at"`
	EndsAt       time.Time              `gorm:"not null" json:"ends_at"`
	Status       RequestStatusTypeEnum  `gorm:"type:varchar(20);not null" json:"status"`
	Location     string                 `gorm:"size:100;not null" json:"location"`
	LocationText string                 `gorm:"size:100;not null" json:"location_text"`

	Images []RequestImage `gorm:"foreignKey:RequestID" json:"images"`
	Notes  []RequestNote  `gorm:"foreignKey:RequestID" json:"notes"`

	UserID uint           `json:"user_id"`
	User   usermodel.User `gorm:"foreignKey:UserID" json:"user"`
}

type RequestWorker struct {
	ID            uint                  `gorm:"primaryKey" json:"id"`
	Extra         *uint32               `gorm:"null" json:"extra"`
	DateStart     time.Time             `gorm:"not null" json:"date_start"`
	DateFinish    time.Time             `gorm:"not null" json:"date_finish"`
	DateAccepted  *time.Time            `gorm:"not null" json:"date_accepted"`
	DateCompleted *time.Time            `gorm:"not null" json:"date_completed"`
	Status        RequestStatusTypeEnum `gorm:"type:varchar(20);not null" json:"status"`
	StatusClient  RequestStatusTypeEnum `gorm:"type:varchar(20);not null" json:"status_client"`
	StatusWorker  RequestStatusTypeEnum `gorm:"type:varchar(20);not null" json:"status_worker"`

	RequestID uint    `gorm:"unique" json:"request_id"`            // Clave foránea
	Request   Request `gorm:"foreignKey:RequestID" json:"request"` // Referencia

	WorkerDetailID uint                     ` json:"worker_detail_id"`                              // Clave foránea
	WorkerDetail   workermodel.WorkerDetail `gorm:"foreignKey:WorkerDetailID" json:"worker_detail"` // Referencia
	// Reviews        []Review                 `gorm:"foreignKey:RequestWorkerID" json:"reviews"`
	// Payments       []Payment                `gorm:"foreignKey:RequestWorkerID" json:"payments"`
}

type Review struct {
	ID              uint          `gorm:"primaryKey" json:"id"`
	Rating          int8          `gorm:"not null" json:"rating"`
	Title           string        `gorm:"not null" json:"title"`
	Description     string        `gorm:"size:100;not null" json:"description"`
	CreatedAt       time.Time     `gorm:"not null" json:"created_at"`
	WorkerID        uint          `gorm:"not null" json:"worker_id"`
	RequestWorkerID uint          `gorm:"not null" json:"request_worker_id"`
	RequestWorker   RequestWorker `gorm:"constraint:OnDelete:CASCADE" json:"request_worker"`
}

type Payment struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	Status    string    `gorm:"not null" json:"status"`
	Token     string    `gorm:"not null" json:"token"`
	Method    string    `gorm:"not null" json:"method"`
	Total     uint32    `gorm:"not null" json:"total"`
	Extra     *uint32   `gorm:"null" json:"extra"`
	Title     string    `gorm:"not null" json:"title"`
	CreatedAt time.Time `gorm:"not null" json:"created_at"`

	RequestWorkerID uint          `gorm:"not null" json:"request_worker_id"`
	RequestWorker   RequestWorker `gorm:"constraint:OnDelete:CASCADE" json:"request_worker"`
}

// AfterCreate se dispara después de insertar una nueva review
func (r *Review) AfterCreate(tx *gorm.DB) (err error) {
	if r.WorkerID == 0 {
		return nil
	}
	return updateWorkerReviewStats(tx, r.WorkerID)
}

// AfterDelete se dispara después de borrar una review
func (r *Review) AfterDelete(tx *gorm.DB) (err error) {
	if r.WorkerID == 0 {
		return nil
	}
	return updateWorkerReviewStats(tx, r.WorkerID)
}

func updateWorkerReviewStats(tx *gorm.DB, workerDetailID uint) (err error) {

	var result struct {
		ReviewCount int64
		ReviewAvg   float64
	}

	err = tx.Model(&Review{}).
		Select("COUNT(*) as review_count, AVG(rating) as review_avg").
		Where("worker_id = ?", workerDetailID).
		Scan(&result).Error

	if err != nil {
		return err
	}

	roundedAvg := int8(math.Round(result.ReviewAvg))

	updateData := workermodel.WorkerDetail{
		ReviewCount: uint(result.ReviewCount),
		ReviewAvg:   roundedAvg,
	}

	err = tx.Model(&workermodel.WorkerDetail{}).
		Where("id = ?", workerDetailID).
		Updates(updateData).Error

	return err
}

func (rw *RequestWorker) AfterCreate(tx *gorm.DB) (err error) {
	if rw.WorkerDetailID == 0 {
		return nil
	}
	return updateWorkerWorkCount(tx, rw.WorkerDetailID)
}

func (rw *RequestWorker) AfterDelete(tx *gorm.DB) (err error) {
	if rw.WorkerDetailID == 0 {
		return nil
	}
	return updateWorkerWorkCount(tx, rw.WorkerDetailID)
}

func (rw *RequestWorker) AfterUpdate(tx *gorm.DB) (err error) {
	if rw.WorkerDetailID == 0 {
		return nil
	}
	if err_portfolio := createPortfolioEntryOnCompletion(tx, rw); err_portfolio != nil {
		return err_portfolio
	}

	return updateWorkerWorkCount(tx, rw.WorkerDetailID)
}

func createPortfolioEntryOnCompletion(tx *gorm.DB, rw *RequestWorker) (err error) {
	if rw.DateCompleted == nil {
		return nil
	}

	var request = rw.Request
	if err := tx.Preload("Images").First(&request, rw.RequestID).Error; err != nil {
		return err
	}

	if len(request.Images) == 0 {
		return nil
	}

	firstImage := request.Images[0]
	imageUrl := firstImage.Url

	var existingPortfolio workermodel.WorkerPortFolio
	err = tx.Where("request_worker_id = ?", rw.ID).First(&existingPortfolio).Error

	if err == nil {
		if existingPortfolio.Url != imageUrl {
			return tx.Model(&existingPortfolio).Update("url", imageUrl).Error
		}
		return nil

	} else if errors.Is(err, gorm.ErrRecordNotFound) {
		newPortfolio := workermodel.WorkerPortFolio{
			RequestWorkerID: rw.ID,
			WorkerDetailID:  rw.WorkerDetailID,
			Url:             imageUrl,
		}
		return tx.Create(&newPortfolio).Error

	} else {
		return err
	}
}

func updateWorkerWorkCount(tx *gorm.DB, workerDetailID uint) (err error) {
	var workCount int64
	statusCompleted := RequestStatusTypeCompleted

	err = tx.Model(&RequestWorker{}).
		Where("worker_detail_id = ? AND status = ?", workerDetailID, statusCompleted).
		Count(&workCount).Error

	if err != nil {
		return err
	}

	err = tx.Model(&workermodel.WorkerDetail{}).
		Where("id = ?", workerDetailID).
		Update("works_count", uint(workCount)).Error

	return err
}
