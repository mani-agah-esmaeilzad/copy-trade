import MetaTrader5 as mt5
import requests
import time

login = 88947082
password = "EhsanKamyabi$1"
server = "LiteFinance-MT5-Live"

login_second = 12345678
password_second = "SecondAccountPassword"
server_second = "SecondServer"

if not mt5.initialize(login=login, password=password, server=server):
    print("متاتریدر5 راه‌اندازی نشد")
    mt5.shutdown()

def open_trade_in_second_account(trade):
    if not mt5.initialize(login=login_second, password=password_second, server=server_second):
        print("متاتریدر5 راه‌اندازی نشد برای حساب دوم")
        mt5.shutdown()
        return

    volume = trade['volume']
    if volume > 10:
        volume /= 100

    request = {
        "action": mt5.TRADE_ACTION_DEAL,
        "symbol": trade['symbol'],
        "volume": volume,
        "type": mt5.ORDER_TYPE_BUY if trade['profit'] >= 0 else mt5.ORDER_TYPE_SELL,
        "price": trade['price_current'],
        "deviation": 20,
        "magic": 234000,
        "comment": "Trade copied from first account",
        "type_time": mt5.ORDER_TIME_GTC,
        "type_filling": mt5.ORDER_FILLING_RETURN,
    }

    result = mt5.order_send(request)
    if result.retcode != mt5.TRADE_RETCODE_DONE:
        print(f"معامله باز نشد، کد خطا: {result.retcode}")
    else:
        print(f"معامله باز شد، تیکت: {result.order}")

    mt5.shutdown()

while True:
    trades = mt5.positions_get()
    if trades is None:
        print("هیچ معامله‌ای یافت نشد")
    else:
        trade_data = []
        for trade in trades:
            trade_info = {
                "ticket": trade.ticket,
                "symbol": trade.symbol,
                "volume": trade.volume,
                "price_open": trade.price_open,
                "price_current": trade.price_current,
                "profit": trade.profit
            }
            trade_data.append(trade_info)
            open_trade_in_second_account(trade_info)

        url = "http://localhost:3000/trades"
        response = requests.post(url, json={"trades": trade_data})
        print(response.status_code)

    time.sleep(60)

mt5.shutdown()
