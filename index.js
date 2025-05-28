const express = require("express");
const app = express();

const PORT = process.env.PORT || 3000;
const VERIFY_TOKEN = "liveia_whatsapp_2025";

app.get("/webhook/meta", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    return res.status(200).send(challenge);
  } else {
    return res.status(403).send("Token inválido");
  }
});

app.listen(PORT, () => console.log("Webhook ativo na porta", PORT));
