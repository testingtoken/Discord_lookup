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
    const id = req.params.id.trim();
    
    // Vérification stricte de l'ID
    if (!/^\d+$/.test(id) || id.length < 17 || id.length > 20) {
        return res.json({ success: false, error: "L'ID doit contenir 17 à 20 chiffres." });
    }

    try {
        const user = await client.users.fetch(id, { force: true });
        res.json({
            success: true,
            id: user.id,
            username: user.username,
            globalName: user.globalName || user.username,
            avatar: user.displayAvatarURL({ dynamic: true, size: 1024 }),
            banner: user.bannerURL({ dynamic: true, size: 1024 }) || null,
            bannerColor: user.hexAccentColor || '#5865F2',
            createdAt: user.createdAt.toLocaleDateString('fr-FR', { 
                day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' 
            })
        });
    } catch (e) { 
        res.json({ success: false, error: "Utilisateur introuvable ou ID inexistant." }); 
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Serveur en ligne sur le port ${PORT}`);
    client.login(process.env.DISCORD_TOKEN).catch(err => console.log("ERREUR TOKEN:", err.message));
});
