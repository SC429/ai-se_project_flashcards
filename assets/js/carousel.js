import { removeColorClasses, hexToString } from "./colorMap.js";

function renderCarouselView(deck) {
    let currentIndex = 0;
    let showingQuestion = true;
    let currentCard = deck.cards[currentIndex];
    const carouselTitle = document.querySelector(".carousel__title");
    const carouselCardElement = document.querySelector('.carousel__card');
    const carouselCardText = document.querySelector('.carousel__card-text');
    const carouselButton = document.querySelector('.carousel__btn');
    const leftBtn = document.querySelector(".carousel__btn_type_left");
    const rightBtn = document.querySelector(".carousel__btn_type_right");
    const flipBtn = document.querySelector(".carousel__btn_type_flip");

    // disable the button
    function disableButton(buttonEl) {
        buttonEl.classList.add("carousel__btn_disabled");
        buttonEl.disabled = true;
    }

    // enable the button
    function enableButton(buttonEl) {
        buttonEl.classList.remove("carousel__btn_disabled");
        buttonEl.removeAttribute("disabled");
    }

    // toggle the buttons
    function updateArrows() {
        if (currentIndex === 0) {
            disableButton(leftBtn);
        } else {
            enableButton(leftBtn);
        }

        if (currentIndex === deck.cards.length - 1) {
            disableButton(rightBtn);
        } else {
            enableButton(rightBtn);
        }
    }

    // update the display when button is clicked
    function updateDisplay() {
        removeColorClasses(carouselCardElement);
        currentCard = deck.cards[currentIndex];
        carouselTitle.textContent = `${deck.name} ${currentIndex + 1}/${deck.cards.length}`;

        if (showingQuestion) {
            carouselCardText.textContent = currentCard.question;
            const colorName = hexToString(deck.color);
            carouselCardElement.classList.add(`carousel__card_color_${colorName}`);
        }
        else {
            carouselCardText.textContent = currentCard.answer;
            carouselCardElement.classList.add('carousel__card_color_white');
        }

        updateArrows();
    }


    rightBtn.addEventListener("click", () => {
        if (currentIndex < deck.cards.length - 1) {
        currentIndex++;
        showingQuestion = true;
        updateDisplay();
        }
    });

    leftBtn.addEventListener("click", () => {
        if (currentIndex > 0) {
        currentIndex--;
        showingQuestion = true;
        updateDisplay();
        }
    });

    flipBtn.addEventListener("click", () => {
        showingQuestion = !showingQuestion;
        updateDisplay();
    });

    updateDisplay();

}

export { renderCarouselView };