var reg = (o, n) => o ? o[n] : '';
var cn = (o, s) => o ? o.getElementsByClassName(s) : console.log(o);
var tn = (o, s) => o ? o.getElementsByTagName(s) : console.log(o);
var gi = (o, s) => o ? o.getElementById(s) : console.log(o);
var rando = (n) => Math.round(Math.random() * n);
var delay = (ms) => new Promise(res => setTimeout(res, ms));


async function getZipcodes(){
  var res = await fetch("https://www.zip-codes.com/city/ga-atlanta.asp");
  var text = await res.text();
  var doc = new DOMParser().parseFromString(text,'text/html');
  var table = Array.from(tn(cn(doc, 'statTable')[0],'tr'));
  table.shift();
  var zips = table.map(t=> reg(/\d{5}/.exec(tn(t,'td')[0].innerText),0));

 console.log(zips)
}
// getZipcodes()
async function getCities(){

}
