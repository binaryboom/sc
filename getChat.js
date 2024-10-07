const axios = require("axios");
require("dotenv").config();

const getChatId = async () => {
  const botToken = '7873333719:AAEBhl6XwnBm-FnrfjDvFv-jkqJhI4QMCRo'; // Load your bot token from .env
  const url = `https://api.telegram.org/bot${botToken}/getUpdates`;

  try {
    const response = await axios.get(url);
    
    // Check if there are any messages in the result
    if (response.data.ok && response.data.result.length > 0) {
      const message = response.data.result[0].message; // Get the first message object
      const chatId = message.chat.id; // Extract the chat ID
      
      console.log(`Chat ID: ${chatId}`); // Log the chat ID
    } else {
      console.log("No updates found.");
    }
  } catch (error) {
    console.error("Error fetching updates:", error);
  }
};

getChatId();
