/**
 * Simple web scrapper using Google Puppeteer. 
 * Scrape/crawl weather and news data from different websites.
 */
import express from "express";
import { fetchWeatherData } from "../src/modules/weather";

const app = express();
const serverPort = 3002;

// Default Route.
app.get('/', (req, res) => res.send('Hello World!'));

// News & Weather Route.
app.all('/fetch_weather', fetchWeatherData);

// Catch unmatched routes
app.all('*', (req, res) => {
  res.json({ status: 404, message: 'Page not found.' });
});

// Start the server.
app.listen(serverPort, () => {
  console.log(`server started on: ${serverPort}`);
});
