const express = require('express');
const { Client, GatewayIntentBits } = require('discord.js');
const cors = require('cors');

const app = express();
app.use(cors());

const client = new Client({ 
    intents: [GatewayIntentBits.Guilds] 
});

// Récupère le token via les variables d'environnement de Render
const TOKEN = process.env.DISCORD_TOKEN;

client.once('ready', () => {
    console.log(`✅ Bot connecté en tant que : ${client.user.tag}`);
});

app.get('/api/user/:id', async (req, res) => {
    try {
        const user = await client.users.fetch(req.params.id);
        res.json({
            success: true,
            username: user.username,
            globalName: user.globalName || user.username,
            avatar: user.displayAvatarURL({ dynamic: true, size: 512 }),
            id: user.id
        });
    } catch (error) {
        console.error(error);
        res.status(404).json({ success: false, message: "Utilisateur introuvable" });
    }
});

// Route de test pour voir si le serveur vit
app.get('/', (req, res) => res.send("Système SENTRY en ligne."));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Serveur actif sur le port ${PORT}`));

client.login(TOKEN);
