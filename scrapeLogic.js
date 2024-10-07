const puppeteer = require("puppeteer");
const axios = require("axios");
require("dotenv").config();

const scrapeLogic = async (res) => {
  const browser = await puppeteer.launch({
    args: [
      "--disable-setuid-sandbox",
      "--no-sandbox",
      "--single-process",
      "--no-zygote",
    ],
    executablePath:
      process.env.NODE_ENV === "production"
        ? process.env.PUPPETEER_EXECUTABLE_PATH
        : puppeteer.executablePath(),
  });
  try {
    const page = await browser.newPage();

    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
    
    await page.goto('https://www.coke2home.com/thunderwheels', {
      waitUntil: 'networkidle2',
      timeout: 60000,
    });

    const rewardsValue = await page.evaluate(() => {
      const labels = ['bike', 'fancode', 'fk gc'];
      const elements = document.querySelectorAll('.voucher-counts .group.flex .data .text');
      const rewards = {};

      elements.forEach((el, index) => {
        rewards[labels[index]] = el ? el.innerText : null;
      });

      console.log(rewards);
      return rewards;
    });

    // Send rewards value to Telegram bot
    const botToken = '7873333719:AAEBhl6XwnBm-FnrfjDvFv-jkqJhI4QMCRo'; // Add your bot token to .env
    const chatId = '558028408'; // Add your chat ID to .env
    const message = `${JSON.stringify(rewardsValue)}`;

    await axios.post(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      chat_id: chatId,
      text: message,
    });

    res.send(rewardsValue);
    
  } catch (e) {
    console.error(e);
    res.send(`Something went wrong while running Puppeteer: ${e}`);
  } finally {
    await browser.close();
  }
};

module.exports = { scrapeLogic };
