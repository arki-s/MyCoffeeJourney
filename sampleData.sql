assets/sqlite3 mySQLiteDB.db

CREATE TABLE IF NOT EXISTS coffeeBean (
id INTEGER PRIMARY KEY AUTOINCREMENT,
name TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS coffeeBrand (
id INTEGER PRIMARY KEY AUTOINCREMENT,
name TEXT NOT NULL);

CREATE TABLE IF NOT EXISTS coffee (
id INTEGER PRIMARY KEY AUTOINCREMENT,
brand_id INTEGER,
name TEXT NOT NULL,
photo BLOB,
favorite INTEGER DEFAULT 0,
drinkCount INTEGER DEFAULT 0,
comment TEXT,
roast INTEGER DEFAULT 3,
body INTEGER DEFAULT 3,
sweetness INTEGER DEFAULT 3,
fruity INTEGER DEFAULT 3,
bitter INTEGER DEFAULT 3,
aroma INTEGER DEFAULT 3,
FOREIGN KEY (brand_id) REFERENCES coffeeBrand (id));

CREATE TABLE IF NOT EXISTS inclusion (
id INTEGER PRIMARY KEY AUTOINCREMENT,
coffee_id INTEGER,
bean_id INTEGER,
FOREIGN KEY (coffee_id) REFERENCES coffee (id),
FOREIGN KEY (bean_id) REFERENCES coffeeBean (id));

CREATE TABLE IF NOT EXISTS record (
id INTEGER PRIMARY KEY AUTOINCREMENT,
coffee_id INTEGER,
startDate INTEGER NOT NULL,
endDate INTEGER,
gram INTEGER DEFAULT 0,
cost INTEGER DEFAULT 0,
grindSize INTEGER DEFAULT 3,
FOREIGN KEY (coffee_id) REFERENCES coffee (id));

CREATE TABLE IF NOT EXISTS review (
id INTEGER PRIMARY KEY AUTOINCREMENT,
record_id INTEGER,
rating INTEGER DEFAULT 3,
comment TEXT,
date INTEGER NOT NULL,
FOREIGN KEY (record_id) REFERENCES record (id));


INSERT INTO coffeeBrand (name) VALUES ("小川珈琲");
INSERT INTO coffeeBrand (name) VALUES ("タリーズコーヒー");
INSERT INTO coffeeBrand (name) VALUES ("AGF");
INSERT INTO coffeeBrand (name) VALUES ("カルディ");
INSERT INTO coffeeBrand (name) VALUES ("無印良品");

INSERT INTO coffeeBean (name) VALUES ("コロンビア");
INSERT INTO coffeeBean (name) VALUES ("ブラジル");
INSERT INTO coffeeBean (name) VALUES ("インドネシア");
INSERT INTO coffeeBean (name) VALUES ("エチオピア");
INSERT INTO coffeeBean (name) VALUES ("グアテマラ");
INSERT INTO coffeeBean (name) VALUES ("ペルー");
INSERT INTO coffeeBean (name) VALUES ("ベトナム");


INSERT INTO coffee (name, roast, body, sweetness, fruity, bitter, aroma, brand_id) VALUES ("マイルドカルディ" ,2, 3, 3, 3, 3, 2, 4);
INSERT INTO inclusion (coffee_id, bean_id) VALUES (1, 1);
INSERT INTO inclusion (coffee_id, bean_id) VALUES (1, 2);

INSERT INTO coffee (name, roast, body, sweetness, fruity, bitter, aroma, brand_id) VALUES ("マンデリンフレンチ" ,4, 4, 1, 1, 4, 4, 4);
INSERT INTO inclusion (coffee_id, bean_id) VALUES (2, 3);

SELECT coffee.id, coffee.name, coffee.photo, coffee.favorite, coffee.drinkCount, coffee.comment, coffee.roast, coffee.body, coffee.sweetness, coffee.fruity, coffee.bitter, coffee.aroma, coffeeBrand.name AS brand, GROUP_CONCAT(coffeeBean.name) AS beans
FROM coffee
JOIN coffeeBrand ON coffeeBrand.id = coffee.brand_id
JOIN inclusion ON inclusion.coffee_id = coffee.id
JOIN coffeeBean ON coffeeBean.id = inclusion.bean_id
GROUP BY coffee.name
;
