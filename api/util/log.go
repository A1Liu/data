package util

import (
	"os"

	"github.com/rs/zerolog"
)

type Log = zerolog.Logger

var L Log = Logger("default")

func Logger(name string) Log {
	return zerolog.New(os.Stdout).With().
		Timestamp().
		Caller().
		Str("name", name).
		Logger()
}
