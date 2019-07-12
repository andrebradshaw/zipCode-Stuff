var geodata = fileArray.filter(el=> el.land_area); /* filter removes zipcodes with zero land area */

var targetZipLatLng = (zp,arr) => arr.filter(z=> z.zip == zp)[0];

function dist(targ1,targ2) {
  var lat1 = targ1.lat, lng1 = targ1.lng, lat2 = targ2.lat, lng2 = targ2.lng;
  var p = 0.017453292519943295;
  var c = Math.cos;
  var a = 0.5 - c((lat2 - lat1) * p) / 2 +
    c(lat1 * p) * c(lat2 * p) *
    (1 - c((lng2 - lng1) * p)) / 2;
  return (0.621371 * (12742 * Math.asin(Math.sqrt(a))) * 1.25); 
}

function downloadr(arr2D, filename) {
  var data = /\.json$|.js$/.test(filename) ? JSON.stringify(arr2D) : arr2D.map(el=> el.reduce((a,b) => a+'\t'+b )).reduce((a,b) => a+'\r'+b);
  var type = /\.json$|.js$/.test(filename) ? 'data:application/json;charset=utf-8,' : 'data:text/plain;charset=utf-8,';
  var file = new Blob([data], {    type: type  });
  if (window.navigator.msSaveOrOpenBlob) {
    window.navigator.msSaveOrOpenBlob(file, filename);
  } else {
    var a = document.createElement('a'),
    url = URL.createObjectURL(file);
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, 10);
  }
}

function getZipsInTargetRadius(miles){
  var graph = [];
  for(var i=0; i<geodata.length; i++){
    console.log(geodata[i].zip)
    var nearby = [];
    var start = geodata[i];
    for(var z=0; z<geodata.length; z++){
      var end = geodata[z];
      var d = dist(start,end);
      if(d < miles) nearby.push(geodata[z].zip);
    }
    var obj = {target: geodata[i].zip, nearby: nearby};
    graph.push(obj);
  }
  var mapped = mapZipGraph(graph);
  downloadr(mapped, 'zipgraph_'+miles+'_miles_apart.json');
}

function mapZipGraph(chuncked){
  var containArr = [];
  var allZips = chunked.map(el=> el.target);
  chuncked.forEach(el=> {
    if(containArr.every(itm=> el.nearby.every(z=> itm != z))) containArr.push(el.target);
  });
  return containArr;
}

getZipsInTargetRadius(50);
