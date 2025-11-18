package locationmodel

type Region struct {
	ID   uint   `gorm:"primaryKey" json:"id"`
	Name string `gorm:"size:100;not null" json:"name"`
}

type Comuna struct {
	ID       uint   `gorm:"primaryKey" json:"id"`
	Name     string `gorm:"size:100;not null" json:"name"`
	RegionID uint   `gorm:"column:region_id" json:"region_id"` // Clave foránea
	Region   Region `gorm:"foreignKey:RegionID" json:"region"` // Referencia
}

type Calle struct {
	ID       uint   `gorm:"primaryKey" json:"id"`
	Name     string `gorm:"size:100;not null" json:"name"`
	ComunaID uint   `gorm:"column:comuna_id" json:"comuna_id"` // Clave foránea
	Comuna   Comuna `gorm:"foreignKey:ComunaID" json:"comuna"` // Referencia
}
