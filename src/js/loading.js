
const loadingBarElement = document.querySelector('.loading-bar');

/**
 * 
 * @param {number} current 
 * @param {number} total 
 */
function changeLoadingProgress(current, total) {
    loadingBarElement.style.display = "flex";
    disableDuringLoading();
    setTimeout(() => {
        let proportion = current/total;
        loadingBarElement.style.width = (100*proportion)+"%";
    });
}

function finishLoading() {
    loadingBarElement.style.width = "100%";
    window.setTimeout(() => {
        loadingBarElement.style.display = "none";
        loadingBarElement.style.width = "0px";
    }, 1000)
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