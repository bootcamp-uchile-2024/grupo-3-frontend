UPDATE plantas
SET pet_friendly = 0
WHERE pet_friendly = 1;

UPDATE plantas
SET pet_friendly = 1
WHERE pet_friendly = 2;

ALTER TABLE plantas
MODIFY COLUMN pet_friendly TINYINT(1) NOT NULL;