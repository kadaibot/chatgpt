import discord

intents = discord.Intents.default()
bot = discord.Bot(intents=intents)  # ← こっちを使う

@bot.event
async def on_ready():
    print(f"ログインしました: {bot.user}")

@bot.slash_command(name="hello", description="挨拶するよ")
async def hello(ctx: discord.ApplicationContext):
    await ctx.respond("こんにちは！")

bot.run("YOUR_TOKEN")
