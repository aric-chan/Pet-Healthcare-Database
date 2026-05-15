
-- PETCARE DATABASE SETUP

-- DROP TABLES

BEGIN EXECUTE IMMEDIATE 'DROP TABLE PetActivity'; EXCEPTION WHEN OTHERS THEN NULL; END;
/
BEGIN EXECUTE IMMEDIATE 'DROP TABLE Activity'; EXCEPTION WHEN OTHERS THEN NULL; END;
/
BEGIN EXECUTE IMMEDIATE 'DROP TABLE Activity_Calories'; EXCEPTION WHEN OTHERS THEN NULL; END;
/
BEGIN EXECUTE IMMEDIATE 'DROP TABLE PetVaccine'; EXCEPTION WHEN OTHERS THEN NULL; END;
/
BEGIN EXECUTE IMMEDIATE 'DROP TABLE Vaccine'; EXCEPTION WHEN OTHERS THEN NULL; END;
/
BEGIN EXECUTE IMMEDIATE 'DROP TABLE Prescription'; EXCEPTION WHEN OTHERS THEN NULL; END;
/
BEGIN EXECUTE IMMEDIATE 'DROP TABLE Medication'; EXCEPTION WHEN OTHERS THEN NULL; END;
/
BEGIN EXECUTE IMMEDIATE 'DROP TABLE Dog'; EXCEPTION WHEN OTHERS THEN NULL; END;
/
BEGIN EXECUTE IMMEDIATE 'DROP TABLE Cat'; EXCEPTION WHEN OTHERS THEN NULL; END;
/
BEGIN EXECUTE IMMEDIATE 'DROP TABLE OtherPet'; EXCEPTION WHEN OTHERS THEN NULL; END;
/
BEGIN EXECUTE IMMEDIATE 'DROP TABLE Appointment'; EXCEPTION WHEN OTHERS THEN NULL; END;
/
BEGIN EXECUTE IMMEDIATE 'DROP TABLE Pet'; EXCEPTION WHEN OTHERS THEN NULL; END;
/
BEGIN EXECUTE IMMEDIATE 'DROP TABLE Owner'; EXCEPTION WHEN OTHERS THEN NULL; END;
/
BEGIN EXECUTE IMMEDIATE 'DROP TABLE Breed'; EXCEPTION WHEN OTHERS THEN NULL; END;
/
BEGIN EXECUTE IMMEDIATE 'DROP TABLE Diet'; EXCEPTION WHEN OTHERS THEN NULL; END;
/
BEGIN EXECUTE IMMEDIATE 'DROP TABLE Veterinarian'; EXCEPTION WHEN OTHERS THEN NULL; END;
/
BEGIN EXECUTE IMMEDIATE 'DROP TABLE Clinic'; EXCEPTION WHEN OTHERS THEN NULL; END;
/


-- TABLE CREATION

CREATE TABLE Clinic (
    clinic VARCHAR2(200) PRIMARY KEY,
    speciality VARCHAR2(100) NOT NULL
);

CREATE TABLE Veterinarian (
    vet_id NUMBER PRIMARY KEY,
    name VARCHAR2(100) NOT NULL,
    clinic VARCHAR2(200) NOT NULL,
    speciality VARCHAR2(80),
    FOREIGN KEY (clinic) REFERENCES Clinic(clinic) ON DELETE CASCADE
);

CREATE TABLE Owner (
    owner_id NUMBER PRIMARY KEY,
    name VARCHAR2(100) NOT NULL,
    address VARCHAR2(200),
    phone_number VARCHAR2(20) NOT NULL UNIQUE,
    email VARCHAR2(120) NOT NULL UNIQUE,
    vet_id NUMBER,
    FOREIGN KEY (vet_id) REFERENCES Veterinarian(vet_id) ON DELETE SET NULL
);

CREATE TABLE Breed (
    breed VARCHAR2(60) PRIMARY KEY,
    species VARCHAR2(15) NOT NULL
);

CREATE TABLE Diet (
    diet_type VARCHAR2(30) PRIMARY KEY,
    description VARCHAR2(200) NOT NULL,
    frequency VARCHAR2(40),
    max_calories NUMBER
);

CREATE TABLE Pet (
    pet_id NUMBER PRIMARY KEY,
    owner_id NUMBER NOT NULL,
    diet_type VARCHAR2(30),
    name VARCHAR2(80),
    breed VARCHAR2(60),
    birth_date DATE,
    FOREIGN KEY (owner_id) REFERENCES Owner(owner_id) ON DELETE CASCADE,
    FOREIGN KEY (diet_type) REFERENCES Diet(diet_type) ON DELETE SET NULL,
    FOREIGN KEY (breed) REFERENCES Breed(breed) ON DELETE SET NULL
);

CREATE TABLE Dog (
    pet_id NUMBER PRIMARY KEY,
    leash_training CHAR(1),
    favorite_toy VARCHAR2(80),
    FOREIGN KEY (pet_id) REFERENCES Pet(pet_id) ON DELETE CASCADE
);

CREATE TABLE Cat (
    pet_id NUMBER PRIMARY KEY,
    indoor_only CHAR(1),
    litter_box_type VARCHAR2(40),
    FOREIGN KEY (pet_id) REFERENCES Pet(pet_id) ON DELETE CASCADE
);

CREATE TABLE OtherPet (
    pet_id NUMBER PRIMARY KEY,
    habitat_type VARCHAR2(60),
    diet_preferences VARCHAR2(120),
    FOREIGN KEY (pet_id) REFERENCES Pet(pet_id) ON DELETE CASCADE
);

CREATE TABLE Medication (
    pet_id NUMBER,
    med_name VARCHAR2(80),
    dose VARCHAR2(60),
    frequency VARCHAR2(40),
    admin_amount VARCHAR2(60),
    start_date DATE,
    end_date DATE,
    PRIMARY KEY (pet_id, med_name),
    FOREIGN KEY (pet_id) REFERENCES Pet(pet_id) ON DELETE CASCADE
);

CREATE TABLE Prescription (
    vaccine_name VARCHAR2(80) PRIMARY KEY,
    dose_intervals VARCHAR2(80)
);

CREATE TABLE Vaccine (
    vaccine_name VARCHAR2(80),
    manufacturer VARCHAR2(80),
    target_species VARCHAR2(40) NOT NULL,
    prescription VARCHAR2(200),
    PRIMARY KEY (vaccine_name, manufacturer),
    FOREIGN KEY (vaccine_name) REFERENCES Prescription(vaccine_name) ON DELETE CASCADE
);

CREATE TABLE PetVaccine (
    pet_id NUMBER,
    vaccine_name VARCHAR2(80),
    manufacturer VARCHAR2(80),
    vaccination_date DATE,
    next_due_date DATE,
    PRIMARY KEY (pet_id, vaccine_name, manufacturer, vaccination_date),
    FOREIGN KEY (pet_id) REFERENCES Pet(pet_id) ON DELETE CASCADE,
    FOREIGN KEY (vaccine_name, manufacturer)
        REFERENCES Vaccine(vaccine_name, manufacturer)
);

CREATE TABLE Activity_Calories (
    activity_type VARCHAR2(100),
    duration_min NUMBER,
    calories_burnt NUMBER NOT NULL,
    PRIMARY KEY (activity_type, duration_min)
);

CREATE TABLE Activity (
    activity_name VARCHAR2(80) PRIMARY KEY,
    activity_type VARCHAR2(40) NOT NULL,
    duration_min NUMBER,
    location VARCHAR2(80),
    FOREIGN KEY (activity_type, duration_min)
        REFERENCES Activity_Calories(activity_type, duration_min)
);

CREATE TABLE PetActivity (
    pet_id NUMBER,
    activity_name VARCHAR2(80),
    activity_date DATE,
    PRIMARY KEY (pet_id, activity_name, activity_date),
    FOREIGN KEY (pet_id) REFERENCES Pet(pet_id) ON DELETE CASCADE,
    FOREIGN KEY (activity_name) REFERENCES Activity(activity_name)
);

CREATE TABLE Appointment (
    appointment_id NUMBER PRIMARY KEY,
    pet_id NUMBER NOT NULL,
    vet_id NUMBER NOT NULL,
    appt_date DATE NOT NULL,
    appt_type VARCHAR2(40) NOT NULL,
    notes VARCHAR2(300),
    UNIQUE (vet_id, pet_id, appt_date),
    FOREIGN KEY (pet_id) REFERENCES Pet(pet_id) ON DELETE CASCADE,
    FOREIGN KEY (vet_id) REFERENCES Veterinarian(vet_id)
);

-- SAMPLE DATA (>=5 rows)

INSERT INTO Clinic VALUES ('Downtown Vet', 'General');
INSERT INTO Clinic VALUES ('Animal Health Center', 'Surgery');
INSERT INTO Clinic VALUES ('Pet Wellness Clinic', 'Dermatology');
INSERT INTO Clinic VALUES ('Happy Pets Clinic', 'Dental');
INSERT INTO Clinic VALUES ('Westside Vet', 'Emergency');

INSERT INTO Veterinarian VALUES (1,'Dr Smith','Downtown Vet','General');
INSERT INTO Veterinarian VALUES (2,'Dr Lee','Animal Health Center','Surgery');
INSERT INTO Veterinarian VALUES (3,'Dr Chen','Pet Wellness Clinic','Dermatology');
INSERT INTO Veterinarian VALUES (4,'Dr Patel','Happy Pets Clinic','Dental');
INSERT INTO Veterinarian VALUES (5,'Dr Adams','Westside Vet','Emergency');

INSERT INTO Owner VALUES (1,'Alice','Vancouver','1111111111','alice@email.com',1);
INSERT INTO Owner VALUES (2,'Bob','Burnaby','2222222222','bob@email.com',2);
INSERT INTO Owner VALUES (3,'Charlie','Richmond','3333333333','charlie@email.com',3);
INSERT INTO Owner VALUES (4,'Diana','Surrey','4444444444','diana@email.com',4);
INSERT INTO Owner VALUES (5,'Ethan','Delta','5555555555','ethan@email.com',5);

INSERT INTO Breed VALUES ('Golden Retriever','Dog');
INSERT INTO Breed VALUES ('Bulldog','Dog');
INSERT INTO Breed VALUES ('Persian','Cat');
INSERT INTO Breed VALUES ('Siamese','Cat');
INSERT INTO Breed VALUES ('Hamster','OtherPet');
INSERT INTO Breed VALUES ('Poodle', 'Dog');
INSERT INTO Breed VALUES ('Beagle', 'Dog');

INSERT INTO Diet VALUES ('High Protein','Active dogs','2/day',500);
INSERT INTO Diet VALUES ('Weight Control','Low calorie diet','2/day',300);
INSERT INTO Diet VALUES ('Kitten Diet','High nutrients','3/day',250);
INSERT INTO Diet VALUES ('Senior Diet','Older pets','2/day',350);
INSERT INTO Diet VALUES ('Small Animal Diet','Hamster mix','1/day',100);

INSERT INTO Pet VALUES (1,1,'High Protein','Buddy','Golden Retriever',DATE '2020-01-01');
INSERT INTO Pet VALUES (2,2,'Weight Control','Max','Bulldog',DATE '2019-05-10');
INSERT INTO Pet VALUES (3,3,'Kitten Diet','Luna','Persian',DATE '2021-07-15');
INSERT INTO Pet VALUES (4,4,'Senior Diet','Milo','Siamese',DATE '2018-03-20');
INSERT INTO Pet VALUES (5,5,'Small Animal Diet','Nibbles','Hamster',DATE '2022-02-02');
INSERT INTO Pet VALUES (6, 1, 'High Protein', 'Rex', 'Bulldog', DATE '2021-02-01');
INSERT INTO Pet VALUES (7, 1, 'Weight Control', 'Charlie', 'Poodle', DATE '2022-03-12');
INSERT INTO Pet VALUES (8, 1, 'Senior Diet', 'Snoopy', 'Beagle', DATE '2017-11-05');
INSERT INTO Pet VALUES (9, 2, 'High Protein', 'Rocky', 'Poodle', DATE '2023-01-01');

INSERT INTO Dog VALUES (1,'Y','Ball');
INSERT INTO Dog VALUES (2,'N','Rope');
INSERT INTO Dog VALUES (6, 'Y', 'Frisbee');
INSERT INTO Dog VALUES (7, 'Y', 'Squeaky Bone');
INSERT INTO Dog VALUES (8, 'N', 'Wood Stick');
INSERT INTO Dog VALUES (9, 'Y', 'Tennis Ball');

INSERT INTO Cat VALUES (3,'Y','Covered');
INSERT INTO Cat VALUES (4,'N','Open');

INSERT INTO OtherPet VALUES (5,'Cage','Seeds');

INSERT INTO Prescription VALUES ('Rabies','1 year');
INSERT INTO Prescription VALUES ('Distemper','1 year');
INSERT INTO Prescription VALUES ('Parvo','1 year');
INSERT INTO Prescription VALUES ('Feline Leukemia','1 year');
INSERT INTO Prescription VALUES ('Hamster Flu','6 months');

INSERT INTO Vaccine VALUES ('Rabies','Pfizer','Dog','Required');
INSERT INTO Vaccine VALUES ('Distemper','Moderna','Dog','Required');
INSERT INTO Vaccine VALUES ('Parvo','Zoetis','Dog','Required');
INSERT INTO Vaccine VALUES ('Feline Leukemia','Bayer','Cat','Optional');
INSERT INTO Vaccine VALUES ('Hamster Flu','PetLab','OtherPet','Optional');

INSERT INTO Activity_Calories VALUES ('Walking',30,120);
INSERT INTO Activity_Calories VALUES ('Running',20,200);
INSERT INTO Activity_Calories VALUES ('Playing',15,90);
INSERT INTO Activity_Calories VALUES ('Swimming',25,180);
INSERT INTO Activity_Calories VALUES ('Climbing',10,60);

INSERT INTO Activity VALUES ('Morning Walk','Walking',30,'Park');
INSERT INTO Activity VALUES ('Dog Run','Running',20,'Field');
INSERT INTO Activity VALUES ('Fetch','Playing',15,'Backyard');
INSERT INTO Activity VALUES ('Pool Swim','Swimming',25,'Pool');
INSERT INTO Activity VALUES ('Cat Tower','Climbing',10,'Home');

INSERT INTO PetActivity VALUES (1,'Morning Walk',DATE '2024-01-01');
INSERT INTO PetActivity VALUES (1,'Dog Run',DATE '2024-01-02');
INSERT INTO PetActivity VALUES (2,'Fetch',DATE '2024-01-03');
INSERT INTO PetActivity VALUES (3,'Cat Tower',DATE '2024-01-04');
INSERT INTO PetActivity VALUES (4,'Morning Walk',DATE '2024-01-05');

INSERT INTO Appointment VALUES (1,1,1,DATE '2024-03-01','Checkup','Healthy');
INSERT INTO Appointment VALUES (2,2,2,DATE '2024-03-02','Vaccination','Rabies');
INSERT INTO Appointment VALUES (3,3,3,DATE '2024-03-03','Dermatology','Skin check');
INSERT INTO Appointment VALUES (4,4,4,DATE '2024-03-04','Dental','Cleaning');
INSERT INTO Appointment VALUES (5,5,5,DATE '2024-03-05','Emergency','Injury');

INSERT INTO Medication VALUES (1, 'Apoquel', '16mg', '1/day', '1 tablet', DATE '2024-03-10', DATE '2024-03-24');
INSERT INTO Medication VALUES (2, 'Carprofen', '75mg', '2/day', '1 tablet', DATE '2024-03-15', DATE '2024-03-22');
INSERT INTO Medication VALUES (3, 'Amoxicillin', '50mg', '2/day', '2ml liquid', DATE '2024-03-01', DATE '2024-03-11');
INSERT INTO Medication VALUES (4, 'Gabapentin', '100mg', '3/day', '1 capsule', DATE '2024-02-20', DATE '2024-05-20');
INSERT INTO Medication VALUES (5, 'Enrofloxacin', '2.5mg', '1/day', '0.1ml liquid', DATE '2024-03-25', DATE '2024-03-31');

COMMIT;

SELECT COUNT(*) FROM Owner;
SELECT COUNT(*) FROM Pet;
SELECT COUNT(*) FROM Veterinarian;