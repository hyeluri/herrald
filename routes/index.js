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

      // for uncleaned data...missing some map info
      // //get data from giant JSON object
      // var tileData=[];
      // var parsedBody;
      // for (var i = 0; i < 21; i++) {
      //   if(data.results.collection1[i].body.text){
      //     parsedBody = util.newLineToBr(data.results.collection1[i].body.text)
      //   }else{
      //     parsedBody = util.newLineToBr(data.results.collection1[i].body)
      //   }

      //   tileData.push({heading: data.results.collection1[i].title, postDate: data.results.collection1[i].postDate, content: parsedBody});
      // }

      //filtering the data for listings that have
      var cleanedData = [];
      for (var j = 0; j < data.results.collection1.length; j++) {
        if(data.results.collection1[j].map !== ""){
          data.results.collection1[j].mapDesc = util.truncate((data.results.collection1[j].body.text)? data.results.collection1[j].body.text : data.results.collection1[j].body,500);
         // console.log(data.results.collection1[j].mapDesc);
          cleanedData.push(data.results.collection1[j]);
        }
      }

      var tileData=[];
      var parsedBody;
      console.log(cleanedData.length);
      for (var i = 0; i < cleanedData.length; i++) {
        if(cleanedData[i].body.text){
          parsedBody = util.newLineToBr(cleanedData[i].body.text);
        }else{
          parsedBody = util.newLineToBr(cleanedData[i].body);
        }
        //mapData.push(cleanedData[i].map);
        tileData.push({heading: cleanedData[i].title, postDate: cleanedData[i].postDate, content: parsedBody});
      }
      
      //var jsonMapData = JSON.stringify(mapData);
      var jsonData = JSON.stringify(cleanedData);

      var tileDataObj = {
        tiles: tileData,
        allData: jsonData
      };

      res.render('index', tileDataObj);
    }
  });
};