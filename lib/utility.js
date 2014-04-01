
exports.newLineToBr = function(str) {
  return (str) ? str.replace(/(\r\n|\r|\n)/g, '<br><br>') : str;
};