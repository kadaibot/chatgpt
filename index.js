const { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder } = require('discord.js');
require('dotenv').config();

const TOKEN = process.env.DISCORD_TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
const GUILD_ID = process.env.GUILD_ID;

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// スラッシュコマンドの登録
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

const rest = new REST({ version: '10' }).setToken(TOKEN);

(async () => {
  try {
    console.log('Started refreshing application (/) commands.');

    await rest.put(
      Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
      { body: commands },
    );

    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
})();

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

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
        console.error('Failed to send reminder:', error);
      }
    }, minutes * 60 * 1000);
  }
});
console.log("CLIENT_ID:", process.env.CLIENT_ID);
console.log("TOKEN starts with:", process.env.DISCORD_TOKEN?.slice(0, 10)); // トークンは全部出さないように先頭10文字だけ表示
console.log("GUILD_ID:", process.env.GUILD_ID);

client.login(TOKEN);
