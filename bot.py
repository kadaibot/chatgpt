import discord
from discord import app_commands
from discord.ext import commands

intents = discord.Intents.default()
bot = commands.Bot(command_prefix="!", intents=intents)

# Botが起動したとき
@bot.event
async def on_ready():
    print(f"ログインしました: {bot.user}")
    try:
        synced = await bot.tree.sync()  # スラッシュコマンドを同期
        print(f"スラッシュコマンドを同期しました: {len(synced)}個")
    except Exception as e:
        print(e)

# スラッシュコマンド /hello
@bot.tree.command(name="hello", description="挨拶してくれるよ")
async def hello(interaction: discord.Interaction):
    await interaction.response.send_message("こんにちは！私はPython製スラッシュコマンドBotです 🤖")


