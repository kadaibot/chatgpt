const express = require('express');
const { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder } = require('discord.js');
require('dotenv').config();

// .env から読み込み
const TOKEN = process.env.DISCORD_TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
const GUILD_ID = process.env.GUILD_ID;

// ✅ Express で Render のためのポートを開く
const app = express();
const PORT = process.env.PORT || 3000;
app.get('/', (req, res) => res.send('Bot is running!'));
app.listen(PORT, () => {
  console.log(`✅ Web server listening on port ${PORT}`);
});

// ✅ Discord Client 初期化
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// ✅ スラッシュコマンド定義
const commands = [
  new SlashCommandBuilder()
    .setName('remind')
    .setDescription('指定時間後にリマインドします')
    .addStringOption(option =>
      option.setName('message')
        .setDescription('リマインドメッセージ')
        .setRequired(true))
    .addIntegerOption(option =>
      option.setName('minutes')
        .setDescription('リマインドまでの時間（分）')
        .setRequired(true)
        .setMinValue(1)),
].map(command => command.toJSON());

// ✅ コマンド登録
const rest = new REST({ version: '10' }).setToken(TOKEN);

(async () => {
  try {
    console.log('🌀 Registering slash commands...');
    await rest.put(
      Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
      { body: commands }
    );
    console.log('✅ Slash commands registered.');
  } catch (error) {
    console.error('❌ Failed to register commands:', error);
  }
})();

// ✅ Botが準備完了時
client.once('clientReady', () => {
  console.log(`🤖 Logged in as ${client.user.tag}`);
});

// ✅ スラッシュコマンド実行時
client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'remind') {
    const message = interaction.options.getString('message');
    const minutes = interaction.options.getInteger('minutes');

    await interaction.reply(`了解！${minutes}分後にリマインドします。`);

    setTimeout(async () => {
      try {
        await interaction.followUp({
          content: `${interaction.user}, リマインドの時間です！: ${message}`,
          ephemeral: false,
        });
      } catch (error) {
        console.error('❌ Failed to send reminder:', error);
      }
    }, minutes * 60 * 1000);
  }
});

// ✅ 環境変数ログ（トークンは先頭だけ表示）
console.log("CLIENT_ID:", CLIENT_ID);
console.log("TOKEN starts with:", TOKEN?.slice(0, 10));
console.log("GUILD_ID:", GUILD_ID);

// ✅ Botログイン
client.login(TOKEN);
