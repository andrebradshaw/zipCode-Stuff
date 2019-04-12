var reg = (o, n) => o ? o[n] : '';
var cn = (o, s) => o ? o.getElementsByClassName(s) : console.log(o);
var tn = (o, s) => o ? o.getElementsByTagName(s) : console.log(o);
var gi = (o, s) => o ? o.getElementById(s) : console.log(o);
var rando = (n) => Math.round(Math.random() * n);
var delay = (ms) => new Promise(res => setTimeout(res, ms));

var linksToScrape = [];
var containArr = [];

var states = ["AL","AK","AZ","AR","CA","CO","CT","DE","DC","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA","WV","WI","WY","AS","GU","MP","PR","VI"];


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

async function getZipsByState(state){
  var doc = await getDoc("https://www.zip-codes.com/state/"+state+".asp");
  var table = Array.from(tn(gi(doc, 'tblZIP'),'tr'));
  table.shift();
  var zipLinks = table.map(tr=> Array.from(tn(tr,'td')).filter(td=> /ZIP Code \d+/.test(td.innerText) ) ).map(t=> reg(/(?<=zip-codes\.com\/zip-code\/).+/.exec(tn(t[0],'a')[0].href),0));
  return zipLinks;
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
  return createObject(out);
}

function createObject(arr){
  var multiFilt = (r,x) => r[1].filter(i=> x.test(i[0]))[0][1];
  var obj = {
   zip: arr[0],
   city: multiFilt(arr,/^city$/),
   state: multiFilt(arr,/^state$/),
   latitude: multiFilt(arr,/latitude/),
   longitude: multiFilt(arr,/longitude/),
   population: multiFilt(arr,/current_population/),
   households: multiFilt(arr,/households_per_zip_code/),
   average_house_value: multiFilt(arr,/average_house_value/),
   persons_per_household: multiFilt(arr,/persons_per_household/),
   avg_income_per_household: multiFilt(arr,/avg_income_per_household/),
   white_population: multiFilt(arr,/^white_population/),
   black_population: multiFilt(arr,/^black_population/),
   hispanic_population: multiFilt(arr,/^hispanic_population/),
   asian_population: multiFilt(arr,/^asian_population/),
   american_indian_population: multiFilt(arr,/^american_indian_population/),
   hawaiian_population: multiFilt(arr,/^hawaiian_population/),
   other_population: multiFilt(arr,/^other_population/),
   male_population: multiFilt(arr,/^male_population/),
   female_population: multiFilt(arr,/^female_population/),
   median_age: multiFilt(arr,/^median_age/),
   male_median_age: multiFilt(arr,/^male_median_age/),
   female_median_age: multiFilt(arr,/^female_median_age/),
   water_area: multiFilt(arr,/^water_area/),
   land_area: multiFilt(arr,/^land_area/),
   congressional_district: multiFilt(arr,/congressional_district/),
   num_of_employees: multiFilt(arr,/^num_of_employees/),
   annual_payroll: multiFilt(arr,/^annual_payroll/),
   num_residential_mailboxes: multiFilt(arr,/^num_residential_mailboxes/),
   total_delivery_receptacles: multiFilt(arr,/^total_delivery_receptacles/),
   num_business_mailboxes: multiFilt(arr,/^num_business_mailboxes/),
   number_of_businesses: multiFilt(arr,/^number_of_businesses/),
   cbsa_name: multiFilt(arr,/^cbsa_name/),
   cbsa_type: multiFilt(arr,/^cbsa_type/),
   cbsa_population: multiFilt(arr,/^cbsa_population/),
   cbsa: multiFilt(arr,/^cbsa$/),
};
  return obj;
}

async function getLinksByState(){
  for(var i=0; i<states.length; i++){
    var links = await getZipsByState(states[i].toLowerCase());
    await delay(rando(110)+1201);
    links.forEach(lnk => linksToScrape.push(lnk));
  }
  return linksToScrape;
}

async function loopThroughLinks(){
  var path = await getLinksByState();
  for(var i=0; i<path.length; i++){
    var obj = await getZipStatsData('https://www.zip-codes.com/zip-code/'+path[i]);
    containArr.push(obj);
    await delay(rando(200)+2101);
  }
}
