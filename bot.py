import discord
import os

intents = discord.Intents.default()
bot = discord.Bot(intents=intents)

# 環境変数から読み込み
GUILD_ID = int(os.getenv("GUILD_ID"))

@bot.event
async def on_ready():
    try:
        synced = await bot.sync_commands(guild_ids=[GUILD_ID])
        print(f"スラッシュコマンドを同期しました: {len(synced)}個")
    except Exception as e:
        print(f"同期エラー: {e}")
    print(f"ログインしました: {bot.user}")

@bot.slash_command(name="hello", description="挨拶するよ", guild_ids=[GUILD_ID])
async def hello(ctx: discord.ApplicationContext):
    await ctx.respond("こんにちは！")

# TOKENも環境変数から読み込む
bot.run(os.getenv("DISCORD_TOKEN"))
