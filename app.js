/*
  Running on node v14.11.0
  The application will have problems running on less than node v11
*/

const TradeList = require("./src/libs/trade-list");
const FileSystem = require("./src/libs/file-system");
const { months, years } = require("./src/data/date");
const dataFile = "datafile.dat";

const startApp = async () => {
  try {
    const volumeAvgMonth = months.JULY;
    const volumeAvgYear = years["2012"];

    const trades = await TradeList.generateListFromFile(dataFile);
    const fileSystem = new FileSystem("out.txt");

    fileSystem.clearFile();

    const highestMonthCostVariance = TradeList.findHighestCostVariance(trades);
    await fileSystem.write(
      `Highest High-Low Variance Date: ${highestMonthCostVariance}`
    );

    const tradeVolumeAvg = TradeList.findVolumeAvg(
      trades,
      volumeAvgMonth,
      volumeAvgYear
    );
    await fileSystem.write(
      `Trade Volume Average For ${volumeAvgMonth}-${volumeAvgYear}: ${tradeVolumeAvg}`
    );

    const { lowDate, highDate, maxProfit } = TradeList.findMaxProfit(trades);
    await fileSystem.write(
      `Max Profit Per Share: ${maxProfit} `,
      `Date To Buy For Max Profit: ${lowDate}`,
      `Date To Sell For Max Profit: ${highDate}`
    );
  } catch (e) {
    throw new Error(e);
  }
};

// Start App
startApp().then((err) => {
  if (err) {
    throw new Error(err);
  }
});
