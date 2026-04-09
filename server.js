const express = require('express');
const { Client, GatewayIntentBits } = require('discord.js');
const cors = require('cors');

const app = express();
app.use(cors()); // Autorise ton site web à parler à cette API

const client = new Client({ 
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers] 
});

const TOKEN = "MTM2MTc0NTc1MDQyOTUzMjM2MQ.GaxXHm.J80mzk8pBL-odq01w5A2wH0YOUdJ_cgrmms-Pk"; // Remplace par ton vrai token

client.once('ready', () => console.log(`✅ Bot connecté : ${client.user.tag}`));

app.get('/api/user/:id', async (req, res) => {
    try {
        const user = await client.users.fetch(req.params.id);
        res.json({
            success: true,
            username: user.username,
            globalName: user.globalName,
            id: user.id,
            avatar: user.displayAvatarURL({ dynamic: true, size: 512 }),
            banner: user.accentColor, // Couleur de profil
            createdAt: user.createdAt
        });
    } catch (error) {
        res.status(404).json({ success: false, message: "Utilisateur introuvable" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 API active sur le port ${PORT}`));
client.login(TOKEN);
