// Import express module. Docs: https://expressjs.com
const express = require('express');
// Import adios module. Docs: https://axios-http.com
const axios = require("axios")

// Create an express instance
const app = express();

//////////////////////////////////////
// Complete the following variables //
//////////////////////////////////////
const discordWebhook = "https://discord.com/api/webhooks/channelId/webhookToken" // Your webhook link: https://support.discord.com/hc/en-us/articles/228383668-Intro-to-Webhooks
const discordAnalyticsToken = "TOKEN" // Your Discord Analytics bot token here: https://docs.discordanalytics.xyz/get-started/bot-registration
const port = 3000 // Port to listen

// Create route /webhook who can handle a POST request
app.post('/webhook', async (req, res) => {
  // Extract request body
  const { botId, voterId, provider, date } = req.body;

  // Check if request is sent by Discord Analytics
  if (req.headers.authorization !== discordAnalyticsToken) return res.status(401).send("Invalid token")

  // Initialize Discord message content
  const formData = new FormData()

  // Add content to the message
  if (provider !== "test") formData.append("content", `User <@${voterId}> voted for <@${botId}> on ${provider} at <t:${new Date(date).getTime()}:>! Thanks a lot ♥️`)
  else formData.append("content", "Test received from Discord Analytics!")

  // Send message to Discord
  await axios.post(discordWebhook, formData, {
    headers: formData.getHeaders()
  })

  // Tell Discord Analytics that everything is ok
  res.status(200).send("OK")
});

// Create a route to test if app is live
app.get("/", (req, res) => {
  res.status(200).send("App is live!")
})

// Launch app
app.listen(port, () => {
    console.log('Server is running on port ' + port);
});