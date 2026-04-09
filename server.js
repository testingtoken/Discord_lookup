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
    // Vérification : l'ID doit être uniquement des chiffres et faire entre 17 et 20 caractères
    if (!/^\d+$/.test(id) || id.length < 17 || id.length > 20) {
        return res.json({ success: false, error: "Format d'ID invalide." });
    }

    try {
        const user = await client.users.fetch(id, { force: true });
        res.json({
            success: true,
            username: user.username,
            globalName: user.globalName || user.username,
            avatar: user.displayAvatarURL({ dynamic: true, size: 1024 }),
            bannerColor: user.hexAccentColor || '#5865F2',
            createdAt: user.createdAt.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }),
            tag: user.discriminator !== '0' ? `#${user.discriminator}` : ''
        });
    } catch (e) { 
        res.json({ success: false, error: "Utilisateur introuvable." }); 
    }
});

app.listen(process.env.PORT || 3000, () => {
    client.login(process.env.DISCORD_TOKEN).catch(() => console.log("Erreur Token"));
});
