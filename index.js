const express = require("express");
const app = express();
const port = 3000;
const TelegramBot = require("node-telegram-bot-api");
const token = "7295329702:AAGB4UpaUVTaKhT_Fwxqpv9THpsbz7bV4As";
const bot = new TelegramBot(token, { polling: true });

let tradesList = [];

app.use(express.json());

app.post("/trades", (req, res) => {
  const trades = req.body.trades;
  trades.forEach((trade) => {
    const message = `Ticket: ${trade.ticket}\nSymbol: ${trade.symbol}\nVolume: ${trade.volume}\nPrice Open: ${trade.price_open}\nPrice Current: ${trade.price_current}\nProfit: ${trade.profit}`;
    bot.sendMessage("108597708", message);
    tradesList.push(message);
  });
  res.send("اطلاعات دریافت شد");
});

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, "سلام! لطفا از دکمه زیر استفاده کنید.", {
    reply_markup: {
      keyboard: [["📋 دریافت لیست معاملات"]],
      resize_keyboard: true,
      one_time_keyboard: true,
    },
  });
});

bot.on("message", (msg) => {
  const chatId = msg.chat.id;

  if (msg.text === "📋 دریافت لیست معاملات") {
    if (tradesList.length > 0) {
      tradesList.forEach((trade) => {
        bot.sendMessage(chatId, trade);
      });
    } else {
      bot.sendMessage(chatId, "هیچ معامله‌ای یافت نشد.");
    }
  }
});

app.listen(port, () => {
  console.log(`سرور در حال اجرا در http://localhost:${port}`);
});
