/**
 * Scraper Module.
 */
import puppeteer from "puppeteer";

/**
 * Scrape Weather from NBC New York.
 */
let scrapeWeather = async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto('https://www.nbcnewyork.com/');
  await page.waitForSelector('div.weather-module-temp');
  const result = await page.evaluate(() => {
    let dataObj = {};
    let title = document.querySelectorAll('div.weather-module-temp');
    dataObj.current_temp = title[0].innerText;
    console.log("Weather Stuff", dataObj);
    return dataObj;
  });

  browser.close();
  return result;
};

/**
 * Scrape News from Associated Press (AP)
 */
const scrapeAP = async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'], headless: true });
  const page = await browser.newPage();
  await page.goto("https://apnews.com");
  await page.waitForSelector('h1');
  let result = await page.evaluate(() => {
    let headline = document.querySelector('h1') ? document.querySelector('h1').innerText : '';
    let snippet = document.querySelector('div.TopStories > div.fluid-wrapper > div > div > div > a > div > p') ? document.querySelector('div.TopStories > div.fluid-wrapper > div > div > div > a > div > p').innerText : '';
    let news = {
      headline: headline,
      snippet: snippet,
    };
    return news;
  });
  browser.close();
  return result;
};

/**
 * Combine all scraper into one.
 */
const fetchWeatherData = async (req, res) => { 
  let newsData = {};
  newsData.news = {};

  await scrapeWeather().then((value) => {
    newsData.weather = value;

  });

  await scrapeAP().then(value => {
    newsData.news.ap = value;
  });

  res.json(newsData);
}

export {
  fetchWeatherData
};
