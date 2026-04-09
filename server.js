const express = require('express');
const { Client, GatewayIntentBits } = require('discord.js');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.static(path.join(__dirname)));

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/api/user/:id', async (req, res) => {
    const id = req.params.id;
    if (!/^\d+$/.test(id) || id.length < 17) return res.json({ success: false, error: "ID invalide" });

    try {
        // Force le fetch pour avoir TOUTES les données (bannière incluse)
        const user = await client.users.fetch(id, { force: true });
        
        res.json({
            success: true,
            id: user.id,
            username: user.username,
            globalName: user.globalName || user.username,
            avatar: user.displayAvatarURL({ dynamic: true, size: 1024 }),
            // Récupère l'image de bannière OU la couleur
            banner: user.bannerURL({ dynamic: true, size: 1024 }) || null,
            bannerColor: user.hexAccentColor || '#5865F2',
            createdAt: user.createdAt.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
        });
    } catch (e) { 
        res.json({ success: false, error: "Utilisateur introuvable" }); 
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    client.login(process.env.DISCORD_TOKEN).catch(() => console.log("Token Error"));
});
