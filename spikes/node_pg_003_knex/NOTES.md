
INSERT INTO "users__netlify" (own_id, email)
VALUES ('test', 'a@b.c')
ON CONFLICT (own_id)
DO
	INSERT
	UPDATE
		SET email = 'a@b.c'
		
		
SELECT roles FROM users
WHERE id = 1

SELECT * FROM "users__netlify"
WHERE own_id = 'abcd'
