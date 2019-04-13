var targetZipLatLng = (zp,arr) => arr.filter(z=> z.zip == zp)[0];

var start = targetZipLatLng("35080", geodata);
var end = targetZipLatLng("35143", geodata);

function dist(targ1,targ2) {
  var lat1 = targ1.latitude, lng1 = targ1.longitude, 
    lat2 = targ2.latitude, lng2 = targ2.longitude;
  var p = 0.017453292519943295;
  var c = Math.cos;
  var a = 0.5 - c((lat2 - lat1) * p) / 2 +
    c(lat1 * p) * c(lat2 * p) *
    (1 - c((lng2 - lng1) * p)) / 2;
  return (0.621371 * (12742 * Math.asin(Math.sqrt(a))) * 1.25); 
  /*mile conversion (km dist by crow fly) road apprx */
}

console.log((dist(start,end))*1.25);
