var reg = (o, n) => o ? o[n] : '';
var cn = (o, s) => o ? o.getElementsByClassName(s) : console.log(o);
var tn = (o, s) => o ? o.getElementsByTagName(s) : console.log(o);
var gi = (o, s) => o ? o.getElementById(s) : console.log(o);
var rando = (n) => Math.round(Math.random() * n);
var delay = (ms) => new Promise(res => setTimeout(res, ms));

var targetUrl = "https://www.zip-codes.com/city/ga-atlanta.asp";

var containArr = [];

var convert2Int = (s) => {
  if(/^0$/.test(s.trim())) return parseInt(s);
  if(/\d/.test(s) === false) return s;
    var cln = s.replace(/,/g,'').replace(/\$/g,'').trim();
    var num = /\d\.\d/.test(cln) ? parseFloat(cln) : parseInt(cln);
    var out = num === NaN ? s : num;
    return out;
}
var toKey = (s) => s.replace(/:/,'').replace(/\#/g, 'Num').replace(/\W+/g, '_').trim().toLowerCase();

async function getDoc(url){
  var res = await fetch(url);
  var text = await res.text();
  var doc = new DOMParser().parseFromString(text,'text/html');
  return doc;
}

async function getZipStatsData(url){
  var cbsX = /CBSA:|CBSA Name:|CBSA Type:|CBSA Population:|MSA Name:|CBSA Division Population:/;
  var sttX = /Zip|City:|State:|Counties|Multi|Latit|Long/;
  var doc = await getDoc(url);
  var getStats = (n,t) => Array.from(tn(tn(cn(doc, 'statTable')[n], 'tbody')[0],'tr'))
	.map(tr=> [cn(tr,'label')[0].innerText, cn(tr,'info')[0].innerText])
	.filter(label=> t.test(label)).map(i=> [toKey(i[0]), i[1]] );;
  var stats = getStats(0, sttX).map(t=> [t[0],convert2Int(t[1])]);
  var census = getStats(1, /./).map(t=> [t[0],convert2Int(t[1])]);
  var other = getStats(2, /./).map(t=> [t[0],convert2Int(t[1])]);
  var ssb = getStats(3, /./).map(t=> [t[0],convert2Int(t[1])]);
  var cbsa = getStats(4, cbsX).map(t=> [t[0],convert2Int(t[1])]);
  var merge = stats.concat(census).concat(other).concat(ssb).concat(cbsa);
  var out = [reg(/\d{5}/.exec(url),0), merge];
  console.log(out);
  return out;
}

async function getZipcodes(url){
  var temp = [];
  var doc = await getDoc(url);
  var table = Array.from(tn(cn(doc, 'statTable')[0],'tr'));
console.log(table);
  table.shift();
  var zips = table.map(t=> tn(t,'a')[0]);
  zips.forEach(z=> { if(z) temp.push(z.href) });
  return temp;
}

async function getCityLinks(url){
  var doc = await getDoc(url);
  var links = Array.from(tn(doc,'a')).filter(i=> /\/city\//.test(i.href)).map(a=> a.href);
  return links;
}

async function loopThroughCities(url){
  var temp = [];
  var links = await getCityLinks(url);
    await delay(rando(333));
  for(var i=0; i<links.length; i++){
    await delay(rando(333));
    var targs = await getZipcodes(links[i]);
    targs.forEach(t=> temp.push(t));
  }
  return temp;
}
async function loopThroughZips(url){
  var targs = await loopThroughCities(url);
  for(var i=0; i<targs.length; i++){
    var table = await getZipStatsData(targs[i]);
    containArr.push(table);
  }
  console.log(containArr);
}

loopThroughZips('https://www.zip-codes.com/city/ga-atlanta.asp')
containArr.map(t=> {
return {"zip": t[0], "city": t[1][1][1], "lat": t[1][5][1], "lng": t[1][6][1], "population": t[1][7][1]}
})



// looper(targetUrl);

// getZipStatsData('https://www.zip-codes.com/zip-code/39901/zip-code-39901.asp')
