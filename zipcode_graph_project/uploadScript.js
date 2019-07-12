/*
This shit is probably best suited to be run on your machine, not the browser. It may crash your system.
Give it a couple of minutes to run.

*/

var gi = (o, s) => o ? o.getElementById(s) : console.log(o);
var tn = (o, s) => o ? o.getElementsByTagName(s) : console.log(o);
var ele = (t) => document.createElement(t);
var attr = (o, k, v) => o.setAttribute(k, v);
var unq = (r) => r.filter((e, p, a) => a.indexOf(e) == p);
var reg = (o, n) => o ? o[n] : '';
var delay = (ms) => new Promise(res => setTimeout(res, ms));

function hoverSwitch() {
  var back = this.style.background;
  var colr = this.style.color;
  this.style.background = colr;
  this.style.color = back;
  this.style.transition = "all 123ms";
}

function downloadr(arr2D, filename) {
  var data = /\.json$|.js$/.test(filename) ? JSON.stringify(arr2D) : arr2D;
  var type = /\.json$|.js$/.test(filename) ? 'data:application/json;charset=utf-8,' : 'data:text/plain;charset=utf-8,';
  var file = new Blob([data], {
    type: type
  });
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

function dragElement() {
  var el = this.parentElement;
  var pos1 = 0,
    pos2 = 0,
    pos3 = 0,
    pos4 = 0;
  if (document.getElementById(this.id)) document.getElementById(this.id).onmousedown = dragMouseDown;
  else this.onmousedown = dragMouseDown;

  function dragMouseDown(e) {
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    el.style.top = (el.offsetTop - pos2) + "px";
    el.style.left = (el.offsetLeft - pos1) + "px";
    el.style.opacity = "0.85";
    el.style.transition = "opacity 700ms";
  }

  function closeDragElement() {
    document.onmouseup = null;
    document.onmousemove = null;
    el.style.opacity = "1";
  }
}

async function createUploadHTML() {
  if (gi(document, 'pop_FileUploader')) gi(document, 'pop_FileUploader').outerHTML = '';
  var popCont = ele("div");
  document.body.appendChild(popCont);
  attr(popCont, "id", "pop_FileUploader");
  attr(popCont, 'style', 'position: fixed; top: 20%; left: 50%; width: 280px; height: 100px; background: lightgrey; border: 1px solid #616161; border-radius: .5em; padding: 6px; z-index: 12000;');

  var closeBtn = ele("div");
  attr(closeBtn, "id", "note_btn_close");
  attr(closeBtn, 'style', 'background: transparent; width: 15px; height: 15px; transform: scale(1.8, 1.2); border-radius: 1em; padding: 0px; color: Crimson; cursor: pointer');
  popCont.appendChild(closeBtn);
  closeBtn.innerText = "X";
  closeBtn.addEventListener("click", close);

  var uploadElm = ele("input");
  attr(uploadElm, "id", "customFileInput");
  attr(uploadElm, "type", "file");
  attr(uploadElm, "name", "file[]");
  attr(uploadElm, "multiple", "true");
  popCont.appendChild(uploadElm);
  uploadElm.style.transform = "scale(1.1, 1.1) translate(5%, 80%)";
  uploadElm.addEventListener("change", await handleFiles);

  function close() {
    document.body.removeChild(popCont);
  }
}


async function handleFiles() {
  var fileArray = [];
  var csvFile = '';
  var tsvFile = '';
  var textFile = '';

  var loadHandleJson = (e) => Array.isArray(JSON.parse(e.target.result)) ? JSON.parse(e.target.result).forEach(i => fileArray.push(i)) : fileArray.push(JSON.parse(e.target.result));
  var loadHandleCsv = (e) => csvFile = csvFile + '\r' + e.target.result;
  var loadHandleTsv = (e) => tsvFile = tsvFile + '\r' + e.target.result;
  var loadHandleTxt = (e) => textFile = textFile + '\n' + e.target.result;

  function getAsText(f) {
    var reader = new FileReader();
    reader.readAsText(f);
    if (/\.json/i.test(f.name)) reader.onload = loadHandleJson;
    if (/\.csv/i.test(f.name)) reader.onload = loadHandleCsv;
    if (/\.tsv/i.test(f.name)) reader.onload = loadHandleTsv;
    if (/\.txt/i.test(f.name)) reader.onload = loadHandleTxt;
  }
  var files = this.files;
  for (var i = 0; i < files.length; i++) {
    await getAsText(files[i]);
  }
  var filetypes = await unq(Array.from(this.files).map(f => reg(/(?<=\.)\w+$/.exec(f.name), 0)));
  gi(document, 'pop_FileUploader').outerHTML = '';
  await delay(1111);
  await createDownloadBtns(fileArray);
}



async function createDownloadBtns(geodata) {
  if (gi(document, 'download_cont')) gi(document, 'download_cont').outerHTML = '';

  var cont = ele("div");
  document.body.appendChild(cont);
  attr(cont, "id", "download_cont");
  attr(cont, 'style', 'position: fixed; top: 20%; left: 50%; width: 360px; height: 360px; background: transparent; z-index: 12000;');

  var head = ele("div");
  attr(head, "id", "download_header");
  attr(head, 'style', 'background: #004471; height: 9%; border: 1.5px solid #004471; border-top-right-radius: 0.25em; border-top-left-radius: 0.25em; padding: 0px; cursor: move; color: white;');
  cont.appendChild(head);
  head.addEventListener("mouseover", dragElement);

  var closeBtn = ele("div");
  attr(closeBtn, "id", "search_btn_close");
  attr(closeBtn, 'style', 'background: transparent; width: 15px; height: 15px; transform: scale(1.8, 1.2) translate(4px, 2px); border-radius: 1em; padding: 0px; color: Crimson; cursor: pointer');
  head.appendChild(closeBtn);
  closeBtn.innerText = "X";
  closeBtn.addEventListener("click", close);

  var body = ele("div");
  attr(body, "id", "download_body");
  attr(body, 'style', 'background: #fff; height: 90%; border: 1.5px solid #004471; border-bottom-right-radius: 0.25em; border-bottom-left-radius: 0.25em; padding: 6px;');
  cont.appendChild(body);

  var dbody = ele("div");
  attr(dbody, "class", "download_body_type");
  attr(dbody, 'style', 'background: #fff; border-radius: 0.25em; padding: 6px;');
  body.appendChild(dbody);

  var label = ele('div');
  label.innerText = 'Chop Zip Codes By Bile Radius';
  dbody.appendChild(label);

  var hinput = ele("input");
  attr(hinput, "class", "download_namer_text");
  attr(hinput, "placeholder", "60");
  attr(hinput, 'style', 'width: 96%; background: #fff; color: #004471; border-radius: 0.25em; border: 1px solid #004471; padding: 6px; cursor: text;');
  dbody.appendChild(hinput);

  var dlBtn = ele("div");
  attr(dlBtn, "class", "downloadr_btn");
  attr(dlBtn, 'style', 'width: 30%; background: #fff; color: #004471; border: 1px solid #004471; border-radius: 0.25em; padding: 6px; cursor: pointer; text-align: center;');
  dbody.appendChild(dlBtn);
  dlBtn.innerText = 'Run Mapper';
  dlBtn.onclick = runAndDownload;
  dlBtn.onmouseover = hoverSwitch;
  dlBtn.onmouseout = hoverSwitch;

  function close() {
    document.body.removeChild(cont);
  }

  function runAndDownload() {
    var zipRadius = parseInt(tn(this.parentElement, 'input')[0].value.replace(/\D+/g, ''));
    getZipsInTargetRadius(zipRadius);
  }

  var targetZipLatLng = (zp, arr) => arr.filter(z => z.zip == zp)[0];

  function dist(targ1, targ2) {
    var lat1 = targ1.lat,
      lng1 = targ1.lng,
      lat2 = targ2.lat,
      lng2 = targ2.lng;
    var p = 0.017453292519943295;
    var c = Math.cos;
    var a = 0.5 - c((lat2 - lat1) * p) / 2 +
      c(lat1 * p) * c(lat2 * p) *
      (1 - c((lng2 - lng1) * p)) / 2;
    return (0.621371 * (12742 * Math.asin(Math.sqrt(a))) * 1.25);
  }

  function getZipsInTargetRadius(miles) {
    var graph = [];
    for (var i = 0; i < geodata.length; i++) {
      gi(document,'download_header').innerText = Math.ceil(((i+1)/geodata.length)*100)+' complete';
      var nearby = [];
      var start = geodata[i];
      for (var z = 0; z < geodata.length; z++) {
        var end = geodata[z];
        var d = dist(start, end);
        if (d < miles) nearby.push(geodata[z].zip);
      }
      var obj = {
        target: geodata[i].zip,
        nearby: nearby
      };
      graph.push(obj);
    }
    var mapped = mapZipGraph(graph);
    gi(document,'download_header').innerText = '100% complete';
    downloadr(mapped, 'zipgraph_' + miles + '_miles_apart.json');
  }

  function mapZipGraph(chunked) {
    var containArr = [];
    var allZips = chunked.map(el => el.target);
    chunked.forEach(el => {
      if (containArr.every(itm => el.nearby.every(z => itm != z))) containArr.push(el.target);
    });
    return unq(containArr);
  }

}
createUploadHTML();
