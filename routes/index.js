var request = require('request');
var fs = require('fs');
var util = require('../lib/utility.js');

exports.index = function(req, res){
  ///******** uncomment to use live data from the scrapper ********\\\
  // request("http://www.kimonolabs.com/api/6mj7dam6?apikey=2a2e7b35f40f277187d903c41c7d3851", 
  // function(err, response, body) {
  //   if (!err && response.statusCode == 200) {
  //    data = JSON.parse(body);
  //  }

  //read json data from file and parse it before passing to renderer
  fs.readFile('./kimonoData.json',{encoding:"utf-8"},function(err, data){
    if(err){
      console.log("error");
    }else{
      data = JSON.parse(data);

      //get data from giant JSON object
      var tileData=[];
      var parsedBody;
      for (var i = 0; i < 21; i++) {
        if(data.results.collection1[i].body.text){
          parsedBody = util.newLineToBr(data.results.collection1[i].body.text)
        }else{
          parsedBody = util.newLineToBr(data.results.collection1[i].body)
        }

        tileData.push({heading: data.results.collection1[i].title, content: parsedBody});
      }

      var tileDataObj = {
        tiles: tileData
      };

      res.render('index', tileDataObj);
    }
  });
};