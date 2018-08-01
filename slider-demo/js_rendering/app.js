let currentPage = null;

const app = document.getElementById('app');

const clearPreview = () => {
    // clear listeners for previews
    // but looks it works great without it
    // at least just for demo
};

const clearDetailView = () => {
    // clear listeners for detail view
    // but looks it works great without it
    // at least just for demo
};

const clearApp = () => {
    if (currentPage === 'preview') clearPreview();
    if (currentPage === 'detailView') clearDetailView();
    app.innerHTML = '';
};

const minTwoDigits = number => {
    let zeros = '';
    zeros = number < 100 ? '0' : zeros;
    zeros = number < 10 ? '00' : zeros;
    return zeros + number;
}

const getImageHref = ({ prefix, postfix }, idx) => prefix + minTwoDigits(idx) + postfix;

const renderFrame = initialHref => {
    const frameItem = document.createElement('img');
    frameItem.className = 'frame-item';
    frameItem.src = initialHref;

    return frameItem;
};

const renderDetailView = (folder) => {
    clearApp();

    const detailViewItem = document.createElement('div');
    detailViewItem.className = 'detail-view-container';

    const framesContainer = document.createElement('div');
    framesContainer.className = 'frames-container';

    const frames = detailView.frames.map(frame => renderFrame(getImageHref(frame, 0)));
    frames.forEach(frame => framesContainer.appendChild(frame));

    detailViewItem.appendChild(framesContainer);

    const range = document.createElement('input');
    range.type = 'range';
    range.className = 'range';
    range.min = 0;
    range.max = detailView.range;
    range.step = 1;
    range.value = 0;

    const rangeProgress = document.createElement('p');
    rangeProgress.className = 'range-progress';
    rangeProgress.innerHTML = '0/' + detailView.range;

    range.addEventListener('input', (e) => {
        e.preventDefault();

        const newRange = range.value;
        const newHrefs = detailView.frames.map(frame => getImageHref(frame, newRange));
        frames.forEach((frame, index) => frame.src = newHrefs[index]);

        rangeProgress.innerHTML = range.value + '/' + detailView.range;
    });

    const rangeContainer = document.createElement('div');
    rangeContainer.className = 'range-container';
    rangeContainer.appendChild(range);
    rangeContainer.appendChild(rangeProgress);

    const backButton = document.createElement('div');
    backButton.className = 'back-button';
    backButton.innerHTML = '✕';
    backButton.addEventListener('click', () => renderPreviewPage());

    detailViewItem.appendChild(rangeContainer);
    detailViewItem.appendChild(backButton);

    app.appendChild(detailViewItem);

    currentPage = 'detailView';
};

const renderFramePreview = (folder) => {
    const previewItem = document.createElement('div');
    previewItem.className = 'previw-item';

    const previewImage = document.createElement('img');
    previewImage.className = 'previw-image';
    previewImage.src = 'data/' + folder + '/img.png';
    // previewImage.addEventListener('mouseover', () => previewImage.src = preview.secondary);
    // previewImage.addEventListener('mouseout', () => previewImage.src = preview.main);
    previewItem.appendChild(previewImage);

    previewItem.addEventListener('click', (e) => {
        e.preventDefault();
        renderDetailView(folder);
    });

    return previewItem;
}

const renderPreviewPage = () => {
    clearApp();

    const previews = folders.map(renderFramePreview);

    const previewContainer = document.createElement('div');
    previewContainer.className = 'preview-container';

    previews.forEach(preview => previewContainer.appendChild(preview));
    console.log('hi');
    app.appendChild(previewContainer);

    currentPage = 'preview';
};

var rise_ins;
renderPreviewPage();
$.getScript("rise_ins.js", function( data, textStatus, jqxhr ) {
  console.log( data.rise_ins ); // Data returned
});
