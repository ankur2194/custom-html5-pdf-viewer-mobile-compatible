# Custom HTML5 PDF Viewer (Mobile Compatible)

This is the testing code of mobile browser compatible PDF viewer which is coded with HTML5, CSS3 and JavaScript. In mobile, there are no browser compatibility to preview a PDF file. So when a PDF file link is given on any anchor tag (`<a>`) or page redirected to any PDF file URL, then it will force PDF to download and save a copy on memory to read it with any PDF viewer. As solution of this issuie, here are some testing files which made using [Mozilla's PDF.js](https://github.com/mozilla/pdf.js)

## Library Used
* [Mozilla's PDF.js](https://github.com/mozilla/pdf.js) (JavaScript Library)

## Add JavaScript File

I prefered to use CloudFlare's [cdnjd](https://cdnjs.com/)  for adding JavaScript of PDF.js

PDF.js's JavaScript file linked to `<head>` section of page.

```html
<head>
  <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.2.2/pdf.min.js"></script>
</head>
```

Then I created a JavaScript file (script.js) which I linked at the bottom of HTML code before `</body>`.

In which File there is a variable `url` contains URL or related path of PDF.

```javascript
var url = './Sample_Document_Lorem_Ipsum.pdf';
```

Import another file of PDF.js library

```javascript
var pdfjsLib = window['pdfjs-dist/build/pdf'];
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.2.2/pdf.worker.js';
```

Variable Declaration

```javascript
var pdfDoc = null,
    pageNum = 1,
    pageRendering = false,
    pageNumPending = null,
    scale = 1.5;
```

Page Rending Function runs for each page

```javascript
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
```

Fetch PDF File and render pages

```javascript
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
```

## Add CSS Style

Some CSS style to look PDF preview on mobile similar to PDF viewer of Google Chrome browser

```css
<style type="text/css">
  body {
    background-color: #535759;
  }
  #canvases canvas {
    margin: 20px auto;
    display: block;
  }
</style>
```

## HTML code for preview

There are an empty `<div>` used where all pages will be added dynamically from PDF.


```html
<div id="canvases"></div>
```
