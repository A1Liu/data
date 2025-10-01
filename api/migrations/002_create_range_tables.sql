-- Write your migrate up statements here

CREATE TABLE preflop_range_collection (
  id UUID NOT NULL PRIMARY KEY DEFAULT generate_uuid(),
  name text NOT NULL
);

CREATE TABLE preflop_range (
  id UUID NOT NULL PRIMARY KEY DEFAULT generate_uuid(),
  collection_id UUID NOT NULL,
  position text NOT NULL,
  facing_raise_from text NOT NULL,
  decisions jsonb NOT NULL
);

CREATE INDEX preflop_range_collection_id ON preflop_range (
  collection_id,
);

---- create above / drop below ----

DROP INDEX preflop_range_collection_id;
DROP TABLE preflop_range;
DROP TABLE preflop_range_collection;

-- Write your migrate down statements here. If this migration is irreversible
-- Then delete the separator line above.
