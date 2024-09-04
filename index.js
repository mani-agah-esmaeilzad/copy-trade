const express = require('express');
const app = express();
const port = 3000;
const TelegramBot = require('node-telegram-bot-api');
const token = "7149935693:AAEbbEMF-g6j_nrEP5c5atrKUiD13XNBsSQ";
const bot = new TelegramBot(token, { polling: true });

app.use(express.json());

app.post('/trades', (req, res) => {
    const trades = req.body.trades;
    trades.forEach(trade => {
        const message = `Ticket: ${trade.ticket}\nSymbol: ${trade.symbol}\nVolume: ${trade.volume}\nPrice Open: ${trade.price_open}\nPrice Current: ${trade.price_current}\nProfit: ${trade.profit}`;
        bot.sendMessage("108597708", message);
    });
    res.send('اطلاعات دریافت شد');
});

app.listen(port, () => {
    console.log(`سرور در حال اجرا در http://localhost:${port}`);
});
