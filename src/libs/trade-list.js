const fs = require("fs");
const readline = require("readline");

class Trade {
  constructor(date, open, high, low, close, volume) {
    this.date = date;
    this.open = open;
    this.high = high;
    this.low = low;
    this.close = close;
    this.volume = volume;
  }
}

class TradeList {
  static async generateListFromFile(source) {
    const trades = [];
    const fileStream = fs.createReadStream(source);

    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity,
    });

    // Read line from file
    for await (const line of rl) {
      const [date, open, high, low, close, volume] = line.split("\t");

      // Store all data except the header
      if (date.toUpperCase() !== "DATE") {
        trades.push(new Trade(date, open, high, low, close, volume));
      }
    }

    // Return trades oragnized by date
    return trades.reverse();
  }

  static findHighestCostVariance(trades) {
    let highestVariance = 0;

    const date = trades.reduce((acc, trade) => {
      const variance = trade.high - trade.low;

      if (variance > highestVariance) {
        highestVariance = variance;
        return trade.date;
      }
      return acc;
    }, "");

    return date;
  }

  static findVolumeAvg(trades, month, year) {
    // Filter list for month and year
    const tradesByMonth = trades.filter((trade) => {
      // Check date based on date format DD-M-YY
      const monthRegrex = new RegExp(`${month.toUpperCase()}-${year}`, "g");
      return trade.date.toUpperCase().match(monthRegrex);
    });

    // Return if there no trades in given month
    if (tradesByMonth.length === 0) {
      return 0;
    }

    const sumOfVolumes = tradesByMonth.reduce((acc, trade) => {
      return acc + parseInt(trade.volume);
    }, 0);

    // Return whole number
    return Math.trunc(sumOfVolumes / tradesByMonth.length);
  }

  static findMaxProfit(trades) {
    let lowIndex = 0;
    let highIndex = 0;
    let lowValue = trades[0].low;
    let highValue = trades[0].high;

    // Check every element in trades list
    trades.forEach((trade, i) => {
      const { high } = trade;

      if (high > highValue) {
        highIndex = i;
        highValue = high;

        // If higher value trade is updated then check for any lower value trade
        for (let j = lowIndex; j < highIndex; j++) {
          const { low } = trades[j];

          if (low < lowValue) {
            lowIndex = j;
            lowValue = low;
          }
        }
      }
    });

    return {
      highDate: trades[highIndex].date,
      lowDate: trades[lowIndex].date,
      maxProfit: highValue - lowValue,
    };
  }
}

module.exports = TradeList;
