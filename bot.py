import discord
from discord.ext import commands

intents = discord.Intents.default()
bot = commands.Bot(command_prefix="!", intents=intents)

@bot.event
async def on_ready():
    try:
        synced = await bot.tree.sync()  # ← ここでコマンドを同期
        print(f"スラッシュコマンドを同期しました: {len(synced)}個")
    except Exception as e:
        print(f"同期エラー: {e}")
    print(f"ログインしました: {bot.user}")

@bot.tree.command(name="hello", description="挨拶するよ")
async def hello(interaction: discord.Interaction):
    await interaction.response.send_message("こんにちは！")

bot.run("YOUR_TOKEN")
