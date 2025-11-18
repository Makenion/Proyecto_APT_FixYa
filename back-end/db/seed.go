package db

import (
	"github.com/NicoHernandezR/Go-backend-proyecto-titulo/types/locationmodel"
	"github.com/NicoHernandezR/Go-backend-proyecto-titulo/types/usermodel"
	"github.com/NicoHernandezR/Go-backend-proyecto-titulo/types/workermodel"
	"gorm.io/gorm"
)

func SeedDB(db *gorm.DB) {

	var userTypes = []usermodel.UserType{
		{
			ID:   1,
			Name: "admin",
		},
		{
			ID:   2,
			Name: "cliente",
		},
		{
			ID:   3,
			Name: "trabajador",
		},
	}
	for _, item := range userTypes {
		db.FirstOrCreate(&item, usermodel.UserType{Name: item.Name})
	}

	var specialities = []workermodel.Speciality{
		{
			Name:        "pintor",
			Description: " ",
		},
	}
	for _, item := range specialities {
		db.FirstOrCreate(&item, workermodel.Speciality{Name: item.Name})
	}

	regionValparaiso := locationmodel.Region{
		Name: "valparaiso",
	}
	db.FirstOrCreate(&regionValparaiso, locationmodel.Region{Name: regionValparaiso.Name})

	var comunas = []locationmodel.Comuna{
		{
			Name:     "quilpue",
			RegionID: regionValparaiso.ID,
		},
	}

	for _, item := range comunas {
		db.FirstOrCreate(&item, locationmodel.Comuna{
			Name:     item.Name,
			RegionID: item.RegionID,
		})
	}
}
