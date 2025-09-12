package model

type User struct {
	ID    string `json:"id"`
	Name  string `json:"name"`
	Email string `json:"email"`
}

type PgTable struct {
	Name string `json:"name"`
}

type TableExport struct {
	Name    string           `json:"name"`
	Version int32            `json:"version"`
	Rows    []map[string]any `json:"rows"`
}
