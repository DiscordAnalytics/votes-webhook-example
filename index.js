// Import itty-router module. Docs: https://itty.dev/itty-router
import { Router } from 'itty-router';

// Create an itty router instance
const router = Router();

//////////////////////////////////////
// Complete the following variables //
//////////////////////////////////////
const discordWebhook = "https://discord.com/api/webhooks/channelId/webhookToken" // Your webhook link: https://support.discord.com/hc/en-us/articles/228383668-Intro-to-Webhooks
const discordAnalyticsToken = "TOKEN" // Your Discord Analytics bot token here: https://docs.discordanalytics.xyz/get-started/bot-registration
const port = 3000 // Port to listen

// Create route /webhook who can handle a POST request
router.post('/webhook', async (request) => {
  // Extract request body
  const txt = await request.text();
  const { bot_id, voter_id, provider, date } = JSON.parse(txt)

  if (!bot_id || !voter_id || !provider || !date) return new Response("Invalid body", { status: 400 })

  // Check if request is sent by Discord Analytics
  if (!request.headers.get("Authorization") || request.headers.get("Authorization") !== discordAnalyticsToken) return new Response("Unauthorized", { status: 401 })

  // Send message to Discord
  await fetch(discordWebhook, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      content: provider === "test" ? "Test received from Discord Analytics!" : `User <@${voter_id}> voted for <@${bot_id}> on ${provider} at <t:${(new Date(date).getTime()/1000).toFixed(0)}>! Thanks a lot ♥️`
    })
  })

  // Tell Discord Analytics that everything is ok
  return new Response("OK", { status: 200 })
});

// Create a route to test if app is live
router.get("/", (request) => {
  return new Response("App is live!", { status: 200 })
})

// If route does not exist, return 404 error
router.all('*', () => new Response('Not found', { status: 404 }));

export default {
	fetch: router.handle,
};