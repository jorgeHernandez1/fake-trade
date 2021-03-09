const { MostActiveToday } = require('./models');
const { iex } = require('./app/services/iex');

async function runT() {
  const res = await iex
    .quote('aapl')
    .then((res) => {
      console.log(res);
    })
    .catch((err) => {
      console.log(err);
    });

  await iex
    .iexSymbols('aapl')
    .then((res) => {
      let count = 0;
      const filteredItems = res.filter((sym) => {
        return sym.symbol.startsWith('A');
      }).slice(0,99);

      console.log(filteredItems);
    })
    .catch((err) => {
      console.log(err);
    });
}

runT();
