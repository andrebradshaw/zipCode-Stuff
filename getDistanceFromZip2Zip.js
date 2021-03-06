var geodata = []; /* this should be replaced with the json file containing the data from zip-codes.com */

var targetZipLatLng = (zp,arr) => arr.filter(z=> z.zip == zp)[0];

function dist(targ1,targ2) {
  var lat1 = targ1.lat, lng1 = targ1.lng, 
    lat2 = targ2.lat, lng2 = targ2.lng;
  var p = 0.017453292519943295;
  var c = Math.cos;
  var a = 0.5 - c((lat2 - lat1) * p) / 2 +
    c(lat1 * p) * c(lat2 * p) *
    (1 - c((lng2 - lng1) * p)) / 2;
  return (0.621371 * (12742 * Math.asin(Math.sqrt(a))) * 1.25); 
  /*mile conversion * (km dist by crow fly) * road travel apprx */
}

var start = targetZipLatLng("35080", geodata);
var end = targetZipLatLng("35143", geodata);
var distance = dist(start,end);
console.log(distance);
