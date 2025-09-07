require("dotenv").config();
require("./config/db");

const express = require('express');
const cors = require("cors");
const errorHandler = require('./middleware/errorHandler');
const app = express();

const routes = require("./routes/index");
const generatePDF = require("./services/generateTicket");
const { initReservationCron } = require('./crons/reservationCron');
const cartAbandonmentCron = require('./crons/cartAbandonmentCron');
const reservationCron = require('./crons/reservationCron');
const cartReminderCron = require('./crons/cartReminderCron');

app.set('trust proxy', true); 

// cors
app.use(cors());

// Midlleware
app.use(express.json({ limit: "500mb" }));


const { chromium } = require('playwright');

(async () => {
    const browser = await chromium.launch({ headless: true }); // Obligatoire sur un serveur
    const page = await browser.newPage();
    await page.goto('https://example.com');
    await page.screenshot({ path: 'test.png' });
    await browser.close();
    console.log('Test réussi, capture d’écran enregistrée.');
});


app.use("/api/", routes);
app.use("/templates", express.static("templates"));
app.use("/", express.static("uploads"));
app.use("/", express.static("uploads/products"));
app.use("/", express.static("uploads/documents"));
app.use("/", express.static("uploads/videos"));
app.use("/", express.static("uploads/logo"));

// Initialize cron jobs
// initReservationCron();
cartAbandonmentCron.start();
cartReminderCron.start();

// Gestion globale des erreurs 
app.use(errorHandler);

// Démarrage du passerelle api
const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Passerelle API fonctionnant sur le ports ${port}`);
});