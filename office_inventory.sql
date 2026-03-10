CREATE SCHEMA IF NOT EXISTS office_inventory;
USE office_inventory;

CREATE TABLE categories (
                            id INT AUTO_INCREMENT PRIMARY KEY,
                            name VARCHAR(255) NOT NULL,
                            description TEXT
);

CREATE TABLE locations (
                           id INT AUTO_INCREMENT PRIMARY KEY,
                           name VARCHAR(255) NOT NULL,
                           description TEXT
);

CREATE TABLE items (
                       id INT AUTO_INCREMENT PRIMARY KEY,
                       category_id INT NOT NULL,
                       location_id INT NOT NULL,
                       name VARCHAR(255) NOT NULL,
                       description TEXT,
                       image VARCHAR(255),
                       registration_date DATE NOT NULL,

                       CONSTRAINT fk_item_category
                           FOREIGN KEY (category_id) REFERENCES categories (id) ON DELETE RESTRICT,
                       CONSTRAINT fk_item_location
                           FOREIGN KEY (location_id) REFERENCES locations (id) ON DELETE RESTRICT
);

INSERT INTO categories (name, description) VALUES
                                               ('Мебель', 'Офисная мебель, столы, стулья, шкафы'),
                                               ('Компьютерное оборудование', 'Ноутбуки, мониторы, периферия'),
                                               ('Бытовая техника', 'Кухонная техника для офиса');

INSERT INTO locations (name, description) VALUES
                                              ('Кабинет директора', 'Главный офис, 2 этаж'),
                                              ('Офис 204', 'Рабочий кабинет отдела продаж'),
                                              ('Учительская', 'Комната отдыха преподавателей');

INSERT INTO items (category_id, location_id, name, description, image, registration_date) VALUES
                                                                                              (1, 1, 'Кресло руководителя кожаное', 'Черное кожаное кресло', NULL, '2026-03-08'),
                                                                                              (2, 2, 'Ноутбук HP Probook 450', 'Ноутбук для менеджера', NULL, '2026-03-05'),
                                                                                              (3, 3, 'Кофемашина Delonghi', 'Для общего пользования', NULL, '2026-03-01');