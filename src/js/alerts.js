
const alertElement = document.querySelector('.alert');
const alertTextElement = alertElement.querySelector('.alert-text');
let closeEvent = null;

function showAlert(status, text) {
    clearTimeout(closeEvent);
    alertElement.style.bottom = "0px";

    alertElement.setAttribute("data-status", status);
    alertTextElement.textContent = text;
    alertElement.classList.add("show");

    closeEvent = setTimeout(() => {
        closeAlert();
    }, 4000);
}

function closeAlert() {
    alertElement.style.bottom = "-500px";
    clearTimeout(closeEvent);
    closeEvent = setTimeout(() => {
        alertElement.classList.remove("show");
    }, 500);
}