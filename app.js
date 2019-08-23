function dataURItoBlob(dataURI) {
  // convert base64 to raw binary data held in a string
  // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
  var byteString = atob(dataURI.split(',')[1]);

  // separate out the mime component
  var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]

  // write the bytes of the string to an ArrayBuffer
  var ab = new ArrayBuffer(byteString.length);

  // create a view into the buffer
  var ia = new Uint8Array(ab);

  // set the bytes of the buffer to the correct values
  for (var i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }

  // write the ArrayBuffer to a blob, and you're done
  var blob = new Blob([ab], { type: mimeString });
  return blob;

}

import Cropper from './cropper/cropper.esm.js';

var cropper;

let factor = 1 / 3;
let ratio = 1.21710526;
var width = 1030 * factor;
var height = width*ratio//1283 * factor;
var currentType;

var openFile;
var saveFile;

$("#open").click(() => {
  chrome.fileSystem.chooseEntry({ type: "openFile", accepts: [{ mimeTypes: ["image/*"] }] }, (entry, fileEntries) => { openFile(entry) })
})

$("#save").click(() => {
  chrome.fileSystem.chooseEntry({ type: "saveFile", accepts: [{ mimeTypes: ["image/*"] }] }, (entry, fileEntries) => { saveFile(entry) })
})

var dnd = new DnDFileController('body', function (data) {
  var fileEntry = data.items[0].webkitGetAsEntry();
  openFile(fileEntry);
});

openFile = (entry) => {

  entry.file(function (file) {
    var reader = new FileReader();

    reader.onerror = (e) => { console.log(e) };
    reader.onloadend = function (e) {

      //$("#img").attr("src", e.target.result);
      cropper.replace(e.target.result);
    };

    reader.readAsDataURL(file);
  });
}

saveFile = (entry) => {
  console.log(cropper.getCroppedCanvas().toDataURL());

  entry.createWriter(function (writer) {
    writer.onerror = (e) => { console.log(e) };
    writer.onwriteend = function (e) {
      console.log('write complete');
    };
    writer.write(dataURItoBlob(cropper.getCroppedCanvas().toDataURL()), { type: "image/png" });
  }, (e) => { console.log(e) });
}

cropper = new Cropper($("#img")[0], {
  viewMode: 2,
  dragMode: 'move',
  aspectRatio: width / height,
  movable: true,
  rotatable: true,
  scalable: true,
  zoomable: true,
  cropBoxResizable: true,
  data: {
    x: $("#img").width() / 2,
    y: $("#img").height() / 2,
    width: width,
    height: height,
    rotate: 0,
    scaleX: .2,
    scaleY: .2
  },
  crop(event) {
  },
});