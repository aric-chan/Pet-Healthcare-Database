# Pet Healthcare Database

A full-stack pet healthcare management system for pet owners to track pets, veterinary records, feeding schedules, vaccinations, and activities.

## Tech Stack

- **Frontend:** React, Axios, React Router
- **Backend:** Node.js, Express.js
- **Database:** Oracle DB

---

## Features

- **Owners** — Full CRUD; look up pets by owner email; find the owner with the most pets
- **Pets** — Full CRUD with ISA subtype support (Dog, Cat, OtherPet); breed and diet dropdowns populated from DB
- **Veterinarians** — Full CRUD; dynamic multi-condition search (AND/OR); configurable column projection
- **Appointments** — Full CRUD; inline edit and delete from table view
- **Reports** — Owner summary, monthly calorie tracking, upcoming appointments, overdue vaccines, active pets, vaccine history by pet, and relational division (owners who own every breed of a selected species)


## Getting Started

### Prerequisites

- Node.js
- Oracle DB instance
- `.env` file with the following variables:

```env
ORACLE_USER=your_user
ORACLE_PASS=your_password
ORACLE_HOST=your_host
ORACLE_PORT=1521
ORACLE_DBNAME=your_db
```

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd pet-healthcare-db

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### Running the App

```bash
# Start backend
cd backend
node server.js

# Start frontend (in a separate terminal)
cd frontend
npm start
```

---

## Database Schema

The schema is fully normalized to BCNF. Key design decisions:

- `breed → species` extracted into a separate `Breed` table
- `activity_type, duration_min → calories_burnt` extracted into `Activity_Calories`
- `prescription → dose_intervals` extracted into a `Prescription` table
- ISA inheritance for `Pet` subtypes: `Dog`, `Cat`, `OtherPet`
- `ON DELETE CASCADE` used where child records are meaningless without the parent (e.g. appointments cascade on pet deletion)

### Core Tables

| Table | Description |
|---|---|
| `Owner` | Pet owners with contact info |
| `Pet` | Core pet records linked to owner and diet |
| `Breed` | Breed-to-species mapping |
| `Dog / Cat / OtherPet` | ISA subtype tables |
| `Veterinarian` | Vet records with clinic and speciality |
| `Appointment` | Scheduled vet visits |
| `Vaccine / PetVaccine` | Vaccine definitions and per-pet history |
| `Activity / Activity_Calories` | Activity definitions and calorie data |
| `PetActivity` | Per-pet activity log |
| `Diet` | Diet types and calorie limits |
| `Medication` | Weak entity owned by Pet |

---

## SQL Highlights

| Feature | Query |
|---|---|
| Selection | Dynamic AND/OR filtering on Veterinarian |
| Projection | User-selected columns on Veterinarian |
| Join | Owner + Pet join by email |
| Aggregation (GROUP BY) | Monthly calories burned per pet |
| Aggregation (HAVING) | Pets with 2+ recorded activities |
| Nested Aggregation | Owner(s) with the most pets |
| Division | Owners who own every breed of a selected species |
