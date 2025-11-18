package main

import (
	"log"

	"github.com/NicoHernandezR/Go-backend-proyecto-titulo/cmd/api"
	"github.com/NicoHernandezR/Go-backend-proyecto-titulo/config"
	"github.com/NicoHernandezR/Go-backend-proyecto-titulo/db"
	"github.com/NicoHernandezR/Go-backend-proyecto-titulo/types/locationmodel"
	"github.com/NicoHernandezR/Go-backend-proyecto-titulo/types/salesmodel"
	"github.com/NicoHernandezR/Go-backend-proyecto-titulo/types/usermodel"
	"github.com/NicoHernandezR/Go-backend-proyecto-titulo/types/workermodel"

	"gorm.io/gorm"
)

func main() {
	// Configuración de la conexión MySQL para GORM
	// dsnAdmin := buildDSN(config.Envs.DBAdmin, config.Envs.DBPasswordAdmin)
	// dsnUser := buildDSN(config.Envs.DBUserAdmin, config.Envs.DBPasswordUser)
	// dsnWorker := buildDSN(config.Envs.DBWorkerAdmin, config.Envs.DBPasswordWorker)
	// dsnSales := buildDSN(config.Envs.DBSalesAdmin, config.Envs.DBPasswordSales)
	// dsnLocation := buildDSN(config.Envs.DBLocationAdmin, config.Envs.DBPasswordLocation)

	dsn := config.Envs.DirectDatabase
	// Conexión a la base de datos con GORM
	gormDB, err := db.GormPostgresConnection(dsn)
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}

	// Migrar modelos (aquí irían tus structs)
	// if err := migrateModels(gormDB); err != nil {
	// 	log.Fatal("Failed to migrate models:", err)
	// }
	// db.SeedDB(gormDB)

	// userDB, err := db.GormMySQLConnection(dsnUser)
	// if err != nil {
	//	log.Fatal("Failed to connect to database:", err)
	// }
	//
	// workerDB, err := db.GormMySQLConnection(dsnWorker)
	// if err != nil {
	//	log.Fatal("Failed to connect to database:", err)
	// }
	//
	// salesDB, err := db.GormMySQLConnection(dsnSales)
	// if err != nil {
	//	log.Fatal("Failed to connect to database:", err)
	// }
	//
	// locationDB, err := db.GormMySQLConnection(dsnLocation)
	// if err != nil {
	//	log.Fatal("Failed to connect to database:", err)
	// }

	// Pasar gormDB a tu APIServer en lugar de *sql.DB
	// server := api.NewAPIServer(":8080", userDB, workerDB, salesDB, locationDB)
	server := api.NewAPIServer(":8080", gormDB, gormDB, gormDB, gormDB)
	log.Println("Conectado a :8080")
	if err := server.Run(); err != nil {
		log.Fatal(err)
	}
}

func buildDSN(user string, password string) string {
	return user + ":" + password +
		"@tcp(" + config.Envs.DBAddress + ")/" +
		config.Envs.DBName + "?charset=utf8mb4&parseTime=True&loc=Local"
}

// Función para migrar modelos (ejemplo)
func migrateModels(db *gorm.DB) error {
	return db.AutoMigrate(
		&locationmodel.Region{},
		&locationmodel.Comuna{},
		&locationmodel.Calle{},

		&usermodel.User{},
		&usermodel.UserMetadata{},
		&usermodel.UserType{},

		&workermodel.Certificate{},
		&workermodel.Speciality{},
		&workermodel.WorkerDetail{},
		&workermodel.WorkerSpeciality{},
		&workermodel.WorkerPortFolio{},

		&salesmodel.RequestImage{},
		&salesmodel.RequestNote{},
		&salesmodel.Request{},
		&salesmodel.RequestWorker{},
		&salesmodel.Review{},
		&salesmodel.Payment{},
	)
}
