const express = require("express");
const axios = require("axios");
const app = express();

const PORT = process.env.PORT || 3000;
const VERIFY_TOKEN = "liveia_whatsapp_2025";
const N8N_WEBHOOK_URL = "https://liveanddigital.app.n8n.cloud/webhook/webhook/meta";

// Middleware para permitir JSON no body
app.use(express.json());

// ⚠️ VALIDAÇÃO do Webhook via GET (usado pela Meta na verificação)
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

// 🔁 REDIRECIONAMENTO via POST para o n8n
app.post("/webhook/meta", async (req, res) => {
  try {
    // Envia a requisição para o seu n8n
    await axios.post(N8N_WEBHOOK_URL, req.body, {
      headers: {
        "Content-Type": "application/json",
        "x-forwarded-from": "render-whatsapp-proxy"
      }
    });

    res.status(200).send("OK");
  } catch (error) {
    console.error("Erro ao redirecionar para o n8n:", error.message);
    res.status(500).send("Erro ao processar webhook");
  }
});

app.listen(PORT, () => {
  console.log("Webhook proxy rodando na porta", PORT);
});
