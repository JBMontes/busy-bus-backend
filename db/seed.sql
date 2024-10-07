\c busy_bus_app

INSERT INTO bus (name) VALUES
('Bus 101'),
('Bus 102'),
('Bus 103'),
('Bus 104'),
('Bus 105');


INSERT INTO drivers (name, license_number, telephone, bus_id, email, password_hash) VALUES
('John Doe', 'LIC12345', '555-1111', 1, 'john.doe@example.com', 'hashedpassword1'),
('Jane Smith', 'LIC67890', '555-2222', 2, 'jane.smith@example.com', 'hashedpassword2'),
('Mike Johnson', 'LIC54321', '555-3333', 3, 'mike.johnson@example.com', 'hashedpassword3'),
('Emma Brown', 'LIC98765', '555-4444', 4, 'emma.brown@example.com', 'hashedpassword4'),
('Chris Davis', 'LIC24680', '555-5555', 5, 'chris.davis@example.com', 'hashedpassword5');


INSERT INTO matrons (name, telephone, bus_id, work_id, company, school, email, password_hash) VALUES
('Anna Wilson', '555-6666', 1, 101, 'Company A', 'School A', 'anna.wilson@example.com', 'hashedpassword6'),
('Betty Moore', '555-7777', 2, 102, 'Company B', 'School B', 'betty.moore@example.com', 'hashedpassword7'),
('Cindy Clark', '555-8888', 3, 103, 'Company C', 'School C', 'cindy.clark@example.com', 'hashedpassword8'),
('Diana White', '555-9999', 4, 104, 'Company D', 'School D', 'diana.white@example.com', 'hashedpassword9'),
('Eva Black', '555-1010', 5, 105, 'Company E', 'School E', 'eva.black@example.com', 'hashedpassword10');


INSERT INTO parents (name, telephone, address, bus_id, email, password_hash) VALUES
('James King', '555-2020', '123 Main St', 1, 'james.king@example.com', 'hashedpassword11'),
('Linda Green', '555-3030', '456 Oak St', 2, 'linda.green@example.com', 'hashedpassword12'),
('George Hill', '555-4040', '789 Pine St', 3, 'george.hill@example.com', 'hashedpassword13'),
('Susan Adams', '555-5050', '101 Maple St', 4, 'susan.adams@example.com', 'hashedpassword14'),
('Karen Lee', '555-6060', '202 Elm St', 5, 'karen.lee@example.com', 'hashedpassword15');


INSERT INTO students (name, parent_id, school, medical_history, bus_id) VALUES
('Tom King', 1, 'School A', 'Asthma', 1),
('Lucy Green', 2, 'School B', 'None', 2),
('Charlie Hill', 3, 'School C', 'Peanut Allergy', 3),
('Megan Adams', 4, 'School D', 'None', 4),
('Ryan Lee', 5, 'School E', 'Diabetes', 5);


INSERT INTO attendance (student_id, date, present) VALUES
(1, '2024-09-28', TRUE),
(2, '2024-09-28', TRUE),
(3, '2024-09-28', FALSE),
(4, '2024-09-28', TRUE),
(5, '2024-09-28', FALSE);


INSERT INTO notifications (message, recipient_id, recipient_type, sent_at) VALUES
('Bus 101 will be delayed by 10 minutes', 1, 'parent', NOW()),
('Bus 102 has arrived at the school', 2, 'parent', NOW()),
('Bus 103 is on schedule', 3, 'parent', NOW()),
('Bus 104 will arrive at your stop in 5 minutes', 4, 'parent', NOW()),
('Bus 105 has left the school', 5, 'parent', NOW());
