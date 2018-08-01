let currentPage = null;

const app = document.getElementById('app');

var label, ins, del, order;

var plot_args = {
  type: 'scatter',
  fill: 'tonexty',
  mode: 'lines',
};

var layout = {
  autosize: true,
  margin: {
    l: 40,
    r: 10,
    b: 30,
    t: 25,
    pad: 4
  },
  xaxis: {
    range: [-0.05, 1.05],
    autotick: false,
    ticks: 'outside',
    tick0: 0,
    dtick: 0.2,
    ticklen: 2,
    tickwidth: 1,
    tickcolor: '#000'
  },
  yaxis: {
    range: [0, 1.09],
    autotick: false,
    ticks: 'outside',
    tick0: 0,
    dtick: 0.1,
    ticklen: 0,
    tickwidth: 0,
    tickcolor: '#000'
  },
  annotations: [{
    x: 0.5,
    y: 0.5,
    xref: 'x',
    yref: 'y',
    text: '',
    showarrow: false,
    ax: 0,
    ay: 0
  }],
};

function auc(arr) {
  return (arr.reduce((x, y) => x+y, 0) - arr[0] / 2 - arr[arr.length-1] / 2) / 224;
};

function updateData(plot_data, plot_layout, raw_data, idx){
  plot_data.y = raw_data.slice(0, idx);
  plot_data.x = [...Array(idx).keys()].map(x => x / 224);
  if (idx > 1) {
    plot_layout.annotations[0].text = 'AUC: ' + auc(plot_data.y).toFixed(3);
  }
  else {
    plot_layout.annotations[0].text = '';
  }
  return [plot_data];
};

function updateImage(ctx11, ctx22, imgd1, imgd2, order, idx){
  var pix1 = imgd1.data;
  var pix2 = imgd2.data;
  for(var i=0; i<=idx*224; ++i){
    pix1[order[i]*4+3] = 255;
    pix2[order[i]*4+3] = 255;
  }
  // console.log(imgd2);
  for(; i<=224*224; ++i){
    pix1[order[i]*4+3] = 0;
    pix2[order[i]*4+3] = 0;
  }
  ctx11.putImageData(imgd1, 0, 0);
  ctx22.putImageData(imgd2, 0, 0);
};

const clearPreview = () => {
    // clear listeners for previews
    // but looks it works great without it
    // at least just for demo
};

const clearDetailView = () => {
    // clear listeners for detail view
    // but looks it works great without it
    // at least just for demo
    plot_args.x = plot_args.y = null;
    layout.annotations[0].text = '';
};

const clearApp = () => {
    if (currentPage === 'preview') clearPreview();
    if (currentPage === 'detailView') clearDetailView();
    app.innerHTML = '';
};

const getImageHref = ({ prefix, postfix }, idx) => prefix + minTwoDigits(idx) + postfix;

const renderFrame = initialHref => {
    const frameItem = document.createElement('img');
    frameItem.className = 'frame-item';
    frameItem.src = initialHref;

    return frameItem;
};

const rowHTML = (folder, method) => {
  return `<div class="mycontainer col-10 offset-1">
    <div class="double-img">
       <img src="data/${folder}/img.png" id="original-img" width=224px height=224px class="top-img"/>
       <img src="data/${folder}/${method}.png" width=224px height=224px class="cover-img"/>
    </div>
    <div class="double-img">
       <img src="data/${folder}/img.png" width=224px height=224px class="top-img"/>
       <canvas id="${method}_c1" width=224px height=224px class="bot-img"></canvas>
    </div>
    <div class="double-img">
       <img src="data/${folder}/blur.png" width=224px height=224px class="top-img"/>
       <canvas id="${method}_c2" width=224px height=224px class="bot-img"></canvas>
    </div>
    <div id="ins_${method}" class="plot"></div>
    <div id="del_${method}" class="plot"></div>
  </div>`
};

const renderDetailView = (folder, imgd2) => {
    clearApp();

    // if (!isDataLoaded) {
    $.getScript('data/' + folder + '/data.js');
    //   isDataLoaded = true;
    //   console.log('Data loaded.');
    // }

    const methods = ['rise', 'lime', 'gcam'];

    const sliderDiv = document.createElement('div');
    sliderDiv.className = 'col-10 offset-1';
    sliderDiv.innerHTML = `<br>
                           <input type="text" id="amount" class="form-control text-center" readonly="" />
                           <div class="btn btn-inline btn-primary btn-rise-demo" onclick="renderPreviewPage()">Back</div>
                           <div id="slider"></div>`
    app.appendChild(sliderDiv);

    methods.forEach(m => {
      const rowDiv = document.createElement('div');
      rowDiv.className = 'mycontainer col-10 offset-1';
      rowDiv.innerHTML = rowHTML(folder, m);
      app.appendChild(rowDiv);
    })

    methods.forEach(m => {
      Plotly.newPlot(`ins_${m}`, [plot_args], layout, {displayModeBar: false});
      Plotly.newPlot(`del_${m}`, [plot_args], layout, {displayModeBar: false});
    });

    var canvas = document.createElement('canvas');
    canvas.width = canvas.height = 224;
    var ctx = canvas.getContext("2d")

    // var img = document.getElementById('original-img');
    // ctx.drawImage(img, 0, 0);
    // var imgd2 = ctx.getImageData(0, 0, 224, 224);

    ctx.fillStyle = 'rgba(124, 116, 104, 1)';
    ctx.fillRect(0, 0, 224, 224);
    var imgd1 = ctx.getImageData(0, 0, 224, 224);

    ctx1 = {
      'rise': document.getElementById('rise_c1').getContext("2d"),
      'lime': document.getElementById('lime_c1').getContext("2d"),
      'gcam': document.getElementById('gcam_c1').getContext("2d")
    };
    ctx2 = {
      'rise': document.getElementById('rise_c2').getContext("2d"),
      'lime': document.getElementById('lime_c2').getContext("2d"),
      'gcam': document.getElementById('gcam_c2').getContext("2d")
    };

    $("#slider").slider({
        value:  0,
        min:    0,
        max:    224,
        step:   1,
        slide:function(event, ui){
          $("#amount").val("Step " + ui.value + "/224");
          methods.forEach(m => {
            Plotly.update(`ins_${m}`, updateData(plot_args, layout, ins[m], ui.value+1), layout, {displayModeBar: false});
            Plotly.update(`del_${m}`, updateData(plot_args, layout, del[m], ui.value+1), layout, {displayModeBar: false});
            updateImage(ctx1[m], ctx2[m], imgd1, imgd2, order[m], ui.value);
          });
        }
    });
    $("#amount").val("Step "+$("#slider").slider("value")+"/224");

    currentPage = 'detailView';
};

const renderFramePreview = (folder) => {
    const previewItem = document.createElement('div');
    previewItem.className = 'preview-item double-img';

    const Image = document.createElement('img');
    Image.className = 'top-img';
    Image.src = 'data/' + folder + '/img.png';

    const Sal = document.createElement('img');
    Sal.className = 'uncover-img';
    Sal.src = 'data/' + folder + '/rise.png';

    previewItem.appendChild(Image);
    previewItem.appendChild(Sal);

    previewItem.addEventListener('click', (e) => {
        e.preventDefault();
        var canvas = document.createElement('canvas');
        canvas.width = canvas.height = 224;
        var ctx = canvas.getContext("2d")
        ctx.drawImage(Image, 0, 0);
        var imgd2 = ctx.getImageData(0, 0, 224, 224);
        renderDetailView(folder, imgd2);
    });

    return previewItem;

}

const renderPreviewPage = () => {
    clearApp();

    const previews = folders.map(renderFramePreview);

    const previewContainer = document.createElement('div');
    previewContainer.className = 'preview-container';

    previews.forEach(preview => previewContainer.appendChild(preview));
    app.appendChild(previewContainer);

    currentPage = 'preview';
};

var isDataLoaded = false;
renderPreviewPage();
