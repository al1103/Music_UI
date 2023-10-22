const forwardButton = document.getElementById("forward");
const backButton = document.getElementById("back");

forwardButton.addEventListener("click", () => {
    history.go(1);
});

backButton.addEventListener("click", () => {
        history.go(-1);
});
