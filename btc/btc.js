const fs = require('fs');
const request = require('request');
const btcRate = require('./btc.json');

// посилання на курс btc
const url_btc = "https://bitpay.com/api/rates";


function btcSaveNewRate() {

  request(url_btc, { json : true}, (err, res, body) => {
      if (err) {
          return console.log(err);
      } else {

          let info = JSON.stringify(body[150]["rate"], null, '\t');

          fs.writeFileSync('./btc/btc.json', info);
      }
  })

}


module.exports = btcSaveNewRate;
