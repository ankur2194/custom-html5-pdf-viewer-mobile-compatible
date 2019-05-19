var url = './Sample_Document_Lorem_Ipsum.pdf';

var pdfjsLib = window['pdfjs-dist/build/pdf'];
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.2.2/pdf.worker.js';

var pdfDoc = null,
    pageNum = 1,
    pageRendering = false,
    pageNumPending = null,
    scale = 1.5;

function renderPage(num, canvas) {
  var ctx = canvas.getContext('2d');
  pageRendering = true;
  // Using promise to fetch the page
  pdfDoc.getPage(num).then(function(page) {
    var viewport = page.getViewport({scale: scale});
    canvas.height = viewport.height;
    canvas.width = viewport.width;

    // Render PDF page into canvas context
    var renderContext = {
      canvasContext: ctx,
      viewport: viewport
    };
    var renderTask = page.render(renderContext);

    // Wait for rendering to finish
    renderTask.promise.then(function() {
      pageRendering = false;
      if (pageNumPending !== null) {
        // New page rendering is pending
        renderPage(pageNumPending);
        pageNumPending = null;
      }
    });
  });
}

pdfjsLib.getDocument(url).promise.then(function(pdfDoc_) {
  pdfDoc = pdfDoc_;

  const pages = parseInt(pdfDoc.numPages);

  var canvasHtml = '';
  for (var i = 0; i < pages; i++) {
  	canvasHtml += '<canvas id="canvas_' + i + '"></canvas>';
  }

  document.getElementById('canvases').innerHTML = canvasHtml;

  for (var i = 0; i < pages; i++) {
  	var canvas = document.getElementById('canvas_' + i);
  	renderPage(i+1, canvas);
  }
});
