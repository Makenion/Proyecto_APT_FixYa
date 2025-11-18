package locationmodel

import "context"

type LocationService interface {
	GetComunaByFilters(ctx context.Context, filters map[string]interface{}) (*Comuna, error)
	GetRegionByFilters(ctx context.Context, filters map[string]interface{}) (*Region, error)
	GetCalleByFilters(ctx context.Context, filters map[string]interface{}) (*Calle, error)
	GetRegionsByFilters(ctx context.Context, filters map[string]interface{}) ([]Region, error)
	GetComunasByFilters(ctx context.Context, filters map[string]interface{}) ([]Comuna, error)
	CreateCalle(ctx context.Context, name string, comuna_id uint) (*Calle, error)
}

type LocationStore interface {
	GetComunaByFilters(ctx context.Context, filters map[string]interface{}) (*Comuna, error)
	GetRegionByFilters(ctx context.Context, filters map[string]interface{}) (*Region, error)
	GetCalleByFilters(ctx context.Context, filters map[string]interface{}) (*Calle, error)
	GetComunasByFilters(ctx context.Context, filters map[string]interface{}) ([]Comuna, error)
	GetRegionsByFilters(ctx context.Context, filters map[string]interface{}) ([]Region, error)
	CreateCalle(ctx context.Context, name string, comuna_id uint) (*Calle, error)
}
