package util

import (
	"context"
	"iter"
)

func GoIter[T any](ctx context.Context, iterator iter.Seq[T]) iter.Seq[T] {
	ctx, cancel := context.WithCancel(ctx)
	iterChan := make(chan T, 2)

	iterGoroutine := func() {
		defer close(iterChan)

		for item := range iterator {
			select {
			case iterChan <- item:
				continue
			case <-ctx.Done():
				return
			}
		}
	}

	go iterGoroutine()

	return func(yield func(T) bool) {
		for item := range iterChan {
			if !yield(item) {
				cancel()
				return
			}
		}
	}

}

func GoIter2[T any, S any](ctx context.Context, iterator iter.Seq2[T, S]) iter.Seq2[T, S] {
	type Pair struct {
		item1 T
		item2 S
	}
	ctx, cancel := context.WithCancel(ctx)
	iterChan := make(chan Pair, 2)

	iterGoroutine := func() {
		for item1, item2 := range iterator {
			select {
			case iterChan <- Pair{item1, item2}:
				continue
			case <-ctx.Done():
				return
			}
		}

		close(iterChan)
	}

	go iterGoroutine()

	return func(yield func(T, S) bool) {
		for pair := range iterChan {
			if !yield(pair.item1, pair.item2) {
				cancel()
				return
			}
		}
	}

}
