#!/bin/bash

# Node.js サービスを起動
node index.js &

# Python サービスを起動
python bot.py &

# 両方が終わるまで待つ
wait
