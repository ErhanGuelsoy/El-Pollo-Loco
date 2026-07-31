/**
 * Initializes the keyboard information window after the DOM has loaded.
 */
document.addEventListener("DOMContentLoaded", () => {

    const keyboardInfoBTN = document.getElementById("keyboardInfoBTN");
    const keyboardInfo = document.getElementById("keyboardInfo");
    const closeKeyboardInfo = document.getElementById("closeKeyboardInfo");

    /**
     * Opens the keyboard information window.
     */
    keyboardInfoBTN.addEventListener("click", () => {
        keyboardInfo.classList.remove("hidden");
    });

    /**
     * Closes the keyboard information window.
     */
    closeKeyboardInfo.addEventListener("click", () => {
        keyboardInfo.classList.add("hidden");
    });

    /**
     * Closes the keyboard information window when clicking outside its content.
     * @param {MouseEvent} event - The mouse click event.
     */
    keyboardInfo.addEventListener("click", (event) => {
        if (event.target === keyboardInfo) {
            keyboardInfo.classList.add("hidden");
        }
    });

});