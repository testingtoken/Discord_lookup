const express = require('express');
const { Client, GatewayIntentBits } = require('discord.js');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());

// Sert le fichier HTML quand on arrive sur le lien
app.use(express.static(path.join(__dirname)));
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
const TOKEN = process.env.DISCORD_TOKEN;

client.once('ready', () => {
    console.log(`✅ Bot en ligne : ${client.user.tag}`);
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
        res.status(404).json({ success: false });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Serveur actif sur le port ${PORT}`));
client.login(TOKEN);
