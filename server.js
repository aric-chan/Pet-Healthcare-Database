const express = require('express');
const loadEnvFile = require('./utils/envUtil');
const dbController = require('./controllers/dbController');
const envVariables = loadEnvFile('./.env');

// TODO: refactor insert, update, delete routes with specific routes for reporting entity
const reportRoutes = require('./routes/reportRoutes');
const ownerRoutes = require('./routes/ownerRoutes');
const petRoutes = require('./routes/petRoutes');
const vetRoutes = require('./routes/vetRoutes');
const appRoutes = require('./routes/appointmentRoutes');

const app = express();
const PORT = envVariables.PORT || 49201;



// middleware
app.use(express.static('public'));
app.use(express.json());

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
        return res.sendStatus(200);
    }

    next();
});

// routes
app.get('/check-db-connection', dbController.checkDbConnection);
app.use('/api/reports', reportRoutes);
app.use('/api/veterinarians', vetRoutes);
app.use('/api/appointments', appRoutes);
app.use('/api/owners', ownerRoutes);
app.use('/api/pets', petRoutes);

app.get("/", (req, res) => {
    res.send("this works!");
});

// start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
});
