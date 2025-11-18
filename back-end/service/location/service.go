package location

import (
	"context"

	"github.com/NicoHernandezR/Go-backend-proyecto-titulo/types/locationmodel"
	"github.com/NicoHernandezR/Go-backend-proyecto-titulo/utils/customserros"
)

type locationService struct {
	locationStore locationmodel.LocationStore
}

func NewLocationService(store locationmodel.LocationStore) *locationService {
	return &locationService{locationStore: store}
}

// CreateCalle implements locationmodel.LocationService.
func (l *locationService) CreateCalle(ctx context.Context, name string, comuna_id uint) (*locationmodel.Calle, error) {
	filters := map[string]interface{}{
		"id": comuna_id,
	}
	_, err := l.locationStore.GetCalleByFilters(ctx, filters)

	if err != nil {
		return nil, customserros.ErrComunaDontExists
	}

	return l.locationStore.CreateCalle(ctx, name, comuna_id)
}

// GetCalleByName implements locationmodel.LocationService.
func (l *locationService) GetCalleByFilters(ctx context.Context, filters map[string]interface{}) (*locationmodel.Calle, error) {
	return l.locationStore.GetCalleByFilters(ctx, filters)
}
func (l *locationService) GetComunasByFilters(ctx context.Context, filters map[string]interface{}) ([]locationmodel.Comuna, error) {
	return l.locationStore.GetComunasByFilters(ctx, filters)
}

// GetComunaByID implements locationmodel.LocationService.
func (l *locationService) GetComunaByFilters(ctx context.Context, filters map[string]interface{}) (*locationmodel.Comuna, error) {
	return l.locationStore.GetComunaByFilters(ctx, filters)
}

func (l *locationService) GetRegionsByFilters(ctx context.Context, filters map[string]interface{}) ([]locationmodel.Region, error) {
	return l.locationStore.GetRegionsByFilters(ctx, filters)
}

// GetRegionByID implements locationmodel.LocationService.
func (l *locationService) GetRegionByFilters(ctx context.Context, filters map[string]interface{}) (*locationmodel.Region, error) {
	return l.locationStore.GetRegionByFilters(ctx, filters)
}
