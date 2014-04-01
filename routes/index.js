
var fs = require('fs');
var util = require('../lib/utility.js');

exports.index = function(req, res){
  fs.readFile('./kimonoData.json',{encoding:"utf-8"},function(err, data){
    if(err){
      console.log("error");
    }else{
      data = JSON.parse(data);
      console.log(data.results.collection1[0]);

      var tileData=[];
      
      for (var i = 0; i < 21; i++) {
        tileData.push({heading: data.results.collection1[i].title, content: util.newLineToBr(data.results.collection1[i].body.text)});
      };

      var test = util.newLineToBr('asdfasf\nasfasdf');

      console.log(test);
      var tileDataObj = {
        title:"hooraayyy",
        tiles: tileData
      };

      res.render('index', tileDataObj);
    }
  });
};