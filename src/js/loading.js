
const loadingBarElement = document.querySelector('.loading-bar');

/**
 * 
 * @param {number} current 
 * @param {number} total 
 */
function changeLoadingProgress(current, total) {
    setTimeout(() => {
        let proportion = current/total;
        loadingBarElement.style.width = (100*proportion)+"%";
    });
}

function finishLoading() {
    loadingBarElement.style.display = "none";
    loadingBarElement.style.width = "0px";
    enableAfterLoading();
}

function startLoading() {
    loadingBarElement.style.display = "flex";
    loadingBarElement.style.width = "0px";
    disableDuringLoading();
}

function disableDuringLoading() {
    document.getElementById('generate-graph-btn').setAttribute('disabled', true);
    document.getElementById('bridges-btn').setAttribute('disabled', true);
    document.getElementById('execute-btn').setAttribute('disabled', true);
}

function enableAfterLoading() {
    document.getElementById('generate-graph-btn').removeAttribute('disabled');
    document.getElementById('bridges-btn').removeAttribute('disabled');
    document.getElementById('execute-btn').removeAttribute('disabled');
}