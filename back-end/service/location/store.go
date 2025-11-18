package location

import (
	"context"

	"github.com/NicoHernandezR/Go-backend-proyecto-titulo/types/locationmodel"
	"github.com/NicoHernandezR/Go-backend-proyecto-titulo/utils/customserros"
	"gorm.io/gorm"
)

type Store struct {
	db *gorm.DB
}

func NewStore(db *gorm.DB) *Store {
	return &Store{db: db}
}

// CreateCalle implements locationmodel.LocationStore.
func (s *Store) CreateCalle(ctx context.Context, name string, comuna_id uint) (*locationmodel.Calle, error) {
	calle := locationmodel.Calle{Name: name,
		ComunaID: comuna_id}
	result := s.db.WithContext(ctx).Model(&locationmodel.Calle{}).Create(&calle) // GORM maneja la inserción

	if result.Error != nil {
		return nil, result.Error
	}

	if result.RowsAffected == 0 {
		return nil, customserros.ErrCantCreateCalle
	}

	return &calle, nil
}

// GetCalleByName implements locationmodel.LocationStore.
func (s *Store) GetCalleByFilters(ctx context.Context, filters map[string]interface{}) (*locationmodel.Calle, error) {
	var calle locationmodel.Calle
	query := s.db.WithContext(ctx).Model(&locationmodel.Calle{})

	if filters["id"] != nil {
		query.Where("ID = ?", filters["id"])
	}

	if filters["name"] != nil {
		query.Where("Name = ?", filters["name"])
	}

	result := query.First(&calle)

	if result.Error != nil {
		if result.Error == gorm.ErrRecordNotFound {
			return nil, customserros.ErrCalleDontExists
		}
		return nil, result.Error
	}

	return &calle, nil
}

// GetComunaByID implements locationmodel.LocationStore.

func (s *Store) GetComunaByFilters(ctx context.Context, filters map[string]interface{}) (*locationmodel.Comuna, error) {
	var comuna locationmodel.Comuna
	query := s.db.WithContext(ctx).Model(&locationmodel.Comuna{})

	if filters["id"] != nil {
		query.Where("ID = ?", filters["id"])
	}

	if filters["name"] != nil {
		query.Where("Name = ?", filters["name"])
	}

	result := query.First(&comuna)

	if result.Error != nil {
		if result.Error == gorm.ErrRecordNotFound {
			return nil, customserros.ErrComunaDontExists
		}
		return nil, result.Error
	}

	return &comuna, nil
}

func (s *Store) GetComunasByFilters(ctx context.Context, filters map[string]interface{}) ([]locationmodel.Comuna, error) {
	var users []locationmodel.Comuna
	query := s.db.WithContext(ctx).Model(&locationmodel.Comuna{})
	if filters["id"] != nil {
		query = query.Where("ID = ?", filters["id"])
	}

	if filters["region_id"] != nil {
		query = query.Preload("Region")
		query = query.Where("region_id = ?", filters["region_id"])
	}
	if filters["email"] != nil {
		query = query.Where("Email = ?", filters["email"])
	}
	if filters["user_type"] != nil {
		query = query.Where("UserType = ?", filters["user_type"])
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

func (s *Store) GetRegionsByFilters(ctx context.Context, filters map[string]interface{}) ([]locationmodel.Region, error) {
	var users []locationmodel.Region
	query := s.db.WithContext(ctx).Model(&locationmodel.Region{})
	if filters["id"] != nil {
		query = query.Where("ID = ?", filters["id"])
	}
	if filters["name"] != nil {
		query.Where("Name = ?", filters["name"])
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

// GetRegionByID implements locationmodel.LocationStore.

func (s *Store) GetRegionByFilters(ctx context.Context, filters map[string]interface{}) (*locationmodel.Region, error) {
	var region locationmodel.Region
	query := s.db.WithContext(ctx).Model(&locationmodel.Region{})

	if filters["id"] != nil {
		query.Where("ID = ?", filters["id"])
	}

	if filters["name"] != nil {
		query.Where("Name = ?", filters["name"])
	}

	result := query.First(&region)

	if result.Error != nil {
		if result.Error == gorm.ErrRecordNotFound {
			return nil, customserros.ErrComunaDontExists
		}
		return nil, result.Error
	}

	return &region, nil
}
