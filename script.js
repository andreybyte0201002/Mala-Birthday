
document.addEventListener("DOMContentLoaded", () => {
    // ========================================
    // 1. ДЕКОРАТИВНЫЕ ЭМОДЗИ
    // ========================================

    const daytimeDecorations = ["☀️", "✨", "🐈", "🌼", "🐾"];
    const nighttimeDecorations = ["🌟", "✨", "🌙", "🐈‍⬛", "💫"];

    function createAmbientDecoration() {
        if (
            document.body.classList.contains("no-motion") ||
            document.querySelectorAll(".ambient-decoration").length >= 3
        ) {
            return;
        }

        const isDark = document.body.classList.contains("dark-theme");
        const list = isDark
            ? nighttimeDecorations
            : daytimeDecorations;

        const decoration = document.createElement("span");

        decoration.className = "ambient-decoration";
        decoration.textContent =
            list[Math.floor(Math.random() * list.length)];

        decoration.setAttribute("aria-hidden", "true");
        decoration.style.left = `${8 + Math.random() * 84}vw`;
        decoration.style.top = `${15 + Math.random() * 65}vh`;
        decoration.style.fontSize = `${17 + Math.random() * 15}px`;

        decoration.style.setProperty(
            "--drift-x",
            `${-20 + Math.random() * 40}px`
        );

        decoration.style.setProperty(
            "--drift-rotate",
            `${-25 + Math.random() * 50}deg`
        );

        document.body.appendChild(decoration);

        decoration.addEventListener("animationend", () => {
            decoration.remove();
        }, { once: true });
    }

    const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    if (!reduceMotion) {
        setTimeout(createAmbientDecoration, 1200);
        setInterval(createAmbientDecoration, 5500);
    }


    // ========================================
    // 2. ДНЕВНАЯ И НОЧНАЯ ТЕМА
    // ========================================

    const themeToggle = document.getElementById("theme-toggle");
    const themeIcon = document.getElementById("theme-icon");

    function updateTheme(isDark) {
        document.body.classList.toggle("dark-theme", isDark);

        if (themeIcon) {
            themeIcon.textContent = isDark ? "☀️" : "🌙";
        }

        themeToggle?.setAttribute(
            "aria-label",
            isDark
                ? "Увімкнути світлу тему"
                : "Увімкнути темну тему"
        );
    }

    try {
        updateTheme(localStorage.getItem("mala-theme") === "dark");
    } catch (error) {
        updateTheme(false);
    }

    themeToggle?.addEventListener("click", () => {
        const isDark =
            !document.body.classList.contains("dark-theme");

        updateTheme(isDark);

        try {
            localStorage.setItem(
                "mala-theme",
                isDark ? "dark" : "light"
            );
        } catch (error) {
            // Тема зміниться навіть без доступу до localStorage.
        }
    });


    // ========================================
    // 3. ПЕРЕХОДЫ МЕЖДУ ЭКРАНАМИ
    // ========================================

    const homeScreen = document.getElementById("home-screen");
    const birthdayScreen = document.getElementById("birthday-screen");
    const supportScreen = document.getElementById("support-screen");

    const screens = [
        homeScreen,
        birthdayScreen,
        supportScreen
    ].filter(Boolean);

    function showScreen(targetScreen) {
        if (!targetScreen) return;

        screens.forEach((screen) => {
            const isTarget = screen === targetScreen;

            screen.hidden = !isTarget;
            screen.classList.toggle("active", isTarget);
        });

        window.scrollTo({
            top: 0,
            behavior: reduceMotion ? "auto" : "smooth"
        });
    }

    document.getElementById("birthday-button")?.addEventListener(
        "click",
        () => showScreen(birthdayScreen)
    );

    document.getElementById("support-button")?.addEventListener(
        "click",
        () => showScreen(supportScreen)
    );

    document.querySelectorAll("[data-go-home]").forEach((button) => {
        button.addEventListener("click", () => showScreen(homeScreen));
    });


    // ========================================
    // 4. ПРАЗДНИЧНЫЕ ЛЕПЕСТКИ
    // ========================================

    function createPetals(count = 16) {
        if (reduceMotion) return;

        const petals = ["🌸", "🌷", "🌺", "💮"];

        for (let i = 0; i < count; i++) {
            const petal = document.createElement("span");

            petal.className = "petal";
            petal.textContent =
                petals[Math.floor(Math.random() * petals.length)];

            petal.setAttribute("aria-hidden", "true");
            petal.style.left = `${Math.random() * 100}vw`;
            petal.style.animationDelay = `${Math.random() * 1.2}s`;
            petal.style.fontSize = `${16 + Math.random() * 12}px`;

            document.body.appendChild(petal);

            petal.addEventListener("animationend", () => {
                petal.remove();
            }, { once: true });
        }
    }


    // ========================================
    // 5. ПОЗДРАВЛЕНИЕ И ОБЪЯТИЯ
    // ========================================

    const yesButton = document.getElementById("yes-button");
    const noButton = document.getElementById("no-button");
    const answerMessage = document.getElementById("answer-message");

    let hugReady = false;

    yesButton?.addEventListener("click", () => {
        if (!hugReady) {
            if (answerMessage) {
                answerMessage.textContent =
                    "Ура-а! 💗 Я дуже хотів подарувати тобі усмішку. " +
                    "Нехай сьогодні буде більше приводів радіти! 🌷";
            }

            yesButton.textContent = "Обіймаю 🤍";
            hugReady = true;

            createPetals(16);

            if (noButton) {
                noButton.hidden = true;
            }

            return;
        }

        const surpriseCard = yesButton.closest(".surprise-card");
        if (!surpriseCard) return;

        let hugSurprise = document.getElementById("hug-surprise");

        if (!hugSurprise) {
            hugSurprise = document.createElement("div");
            hugSurprise.id = "hug-surprise";
            hugSurprise.className = "hug-surprise";

            const hugEmoji = document.createElement("span");
            hugEmoji.className = "hug-surprise-emoji";
            hugEmoji.textContent = "🤗";
            hugEmoji.setAttribute("aria-hidden", "true");

            const hugText = document.createElement("p");
            hugText.textContent =
                "Надсилаю тобі міцні обійми! " +
                "Нехай сьогодні на душі буде трішечки тепліше 🤍";

            hugSurprise.append(hugEmoji, hugText);
            surpriseCard.appendChild(hugSurprise);
        }

        hugSurprise.classList.remove("hug-surprise-visible");
        void hugSurprise.offsetWidth;
        hugSurprise.classList.add("hug-surprise-visible");
    });


    // Кнопка «Ні» — небольшое игривое движение.

    let noButtonEscaped = false;

    function escapeNoButton() {
        if (noButtonEscaped || !noButton) return;

        noButtonEscaped = true;
        noButton.textContent = "А тепер? 🙃";

        if (answerMessage) {
            answerMessage.textContent = "Хі-хі, спробуй ще раз 😄🌷";
        }

        const directions = [
            { x: -35, y: -16, rotate: -6 },
            { x: 30, y: -18, rotate: 5 },
            { x: 24, y: 12, rotate: 4 },
            { x: -25, y: 10, rotate: -4 }
        ];

        const direction =
            directions[Math.floor(Math.random() * directions.length)];

        if (reduceMotion) return;

        noButton.animate(
            [
                { transform: "translate(0, 0) rotate(0deg)" },
                {
                    transform:
                        `translate(${direction.x}px, ${direction.y}px) ` +
                        `rotate(${direction.rotate}deg)`,
                    offset: 0.65
                },
                { transform: "translate(0, 0) rotate(0deg)" }
            ],
            {
                duration: 550,
                easing: "ease-in-out"
            }
        );
    }

    noButton?.addEventListener("pointerenter", (event) => {
        if (event.pointerType === "mouse") {
            escapeNoButton();
        }
    });

    noButton?.addEventListener("pointerdown", (event) => {
        if (event.pointerType !== "mouse" && !noButtonEscaped) {
            event.preventDefault();
            escapeNoButton();
        }
    });

    noButton?.addEventListener("click", () => {
        if (noButtonEscaped && answerMessage) {
            answerMessage.textContent =
                "Домовились 😄💗 Головне, що ти тут!";
        }
    });


    // ========================================
    // 6. ДОБРЫЕ НАПОМИНАНИЯ
    // ========================================

    const kindnessButton = document.getElementById("kindness-button");
    const kindnessMessage = document.getElementById("kindness-message");

    const kindMessages = [
        "Ти заслуговуєш на тепло, турботу й добрі слова. Просто тому, що ти є. 🤍",
        "Навіть якщо сьогодні не все ідеально, це не означає, що день не може принести щось хороше. 🌷",
        "Можна трохи відпочити. Не потрібно встигати все й одразу. ☁️",
        "Нехай у твоєму житті буде більше моментів, коли на душі спокійно й тепло. 🤍",
        "Маленьке нагадування: не забувай турбуватися про себе так само, як турбуєшся про інших. 💗"
    ];

    let lastKindMessage = -1;

    kindnessButton?.addEventListener("click", () => {
        if (!kindnessMessage) return;

        let index;

        do {
            index = Math.floor(Math.random() * kindMessages.length);
        } while (
            kindMessages.length > 1 &&
            index === lastKindMessage
        );

        lastKindMessage = index;
        kindnessMessage.textContent = kindMessages[index];
        kindnessButton.textContent = "Ще одне нагадування 🌸";
    });


    // ========================================
    // 7. МАЛЕНЬКИЙ САД
    // ========================================

    const flowerButton = document.getElementById("flower-button");
    const flowerMessage = document.getElementById("flower-message");

    const flowerStages = [
        {
            emoji: "🌷",
            message: "Маленька квіточка для тебе. Нехай сьогодні знайдеться щось, що зігріє душу. 🤍"
        },
        {
            emoji: "🌸",
            message: "Дивись, вона розквітла! Нехай і в тебе буде більше приводів усміхатися. ✨"
        },
        {
            emoji: "🌻",
            message: "Сонячна квіточка нагадує: навіть маленькі хороші моменти мають значення. ☀️"
        },
        {
            emoji: "💐",
            message: "Ось тобі цілий маленький букет! Просто так, без жодного приводу. 💗"
        }
    ];

    let flowerStage = 0;

    flowerButton?.addEventListener("click", () => {
        if (!flowerMessage) return;

        const flower = flowerStages[flowerStage];

        flowerButton.textContent = flower.emoji;
        flowerMessage.textContent = flower.message;

        if (!reduceMotion) {
            flowerButton.animate(
                [
                    { transform: "scale(1) rotate(0deg)" },
                    { transform: "scale(1.15) rotate(-7deg)" },
                    { transform: "scale(1.08) rotate(7deg)" },
                    { transform: "scale(1) rotate(0deg)" }
                ],
                { duration: 500, easing: "ease-in-out" }
            );
        }

        flowerStage = (flowerStage + 1) % flowerStages.length;
    });


    // ========================================
    // 8. СЕКРЕТНАЯ ОТКРЫТКА И КОНВЕРТ 💌
    // ========================================

    const openSurpriseButton =
        document.getElementById("open-surprise-button");

    const personalSurprise =
        document.getElementById("personal-surprise");

    const envelopeScene =
        document.getElementById("envelope-scene");

    const envelopePaper =
        envelopeScene?.querySelector(".envelope-paper");

    const letterRevealedContent =
        document.getElementById("letter-revealed-content");

    const personalPhoto =
        document.getElementById("personal-photo");

    const photoPlaceholder =
        document.getElementById("photo-placeholder");

    let envelopeTimer = null;


    // Фото либо заглушка, если файл отсутствует.

    function showPhotoPlaceholder() {
        if (personalPhoto) {
            personalPhoto.hidden = true;
            personalPhoto.style.setProperty("display", "none", "important");
        }

        if (photoPlaceholder) {
            photoPlaceholder.hidden = false;
            photoPlaceholder.style.setProperty("display", "block", "important");
        }
    }

    function showPersonalPhoto() {
        if (
            personalPhoto &&
            photoPlaceholder &&
            personalPhoto.complete &&
            personalPhoto.naturalWidth > 0
        ) {
            // Показываем загруженную фотографию.
            personalPhoto.hidden = false;
            personalPhoto.style.setProperty("display", "block", "important");

            // Полностью скрываем текст-заглушку.
            photoPlaceholder.hidden = true;
            photoPlaceholder.style.setProperty("display", "none", "important");
        } else {
            showPhotoPlaceholder();
        }
    }

    if (personalPhoto && photoPlaceholder) {
        personalPhoto.addEventListener("load", showPersonalPhoto);
        personalPhoto.addEventListener("error", showPhotoPlaceholder);

        // Проверяем, успела ли фотография загрузиться раньше.
        if (personalPhoto.complete) {
            showPersonalPhoto();
        }
    }


    // Открываем содержимое только после завершения подъёма бумаги.

    function revealLetterContent() {
        if (
            personalSurprise?.hidden ||
            !envelopeScene?.classList.contains("is-open") ||
            !letterRevealedContent
        ) {
            return;
        }

        letterRevealedContent.hidden = false;
    }

    envelopePaper?.addEventListener("animationend", (event) => {
        if (event.animationName === "letter-paper-rise") {
            revealLetterContent();
        }
    });

    // Одна кнопка открывает и закрывает всю открытку.

    openSurpriseButton?.addEventListener("click", () => {
        if (!personalSurprise || !envelopeScene) return;

        const isOpen = !personalSurprise.hidden;

        clearTimeout(envelopeTimer);
        envelopeTimer = null;

        if (isOpen) {
            personalSurprise.hidden = true;
            personalSurprise.classList.remove(
                "show-letter-content",
                "revealed"
            );

            envelopeScene.classList.remove("is-open");

            if (letterRevealedContent) {
                letterRevealedContent.hidden = true;
            }

            openSurpriseButton.setAttribute("aria-expanded", "false");
            openSurpriseButton.textContent = "💌 Відкрити сюрприз";
            return;
        }

        // Сначала показываем закрытый конверт.

        personalSurprise.hidden = false;

        personalSurprise.classList.remove(
            "show-letter-content",
            "revealed"
        );

        envelopeScene.classList.remove("is-open");

        if (letterRevealedContent) {
            letterRevealedContent.hidden = true;
        }

        openSurpriseButton.setAttribute("aria-expanded", "true");
        openSurpriseButton.textContent = "💗 Сховати сюрприз";

        void personalSurprise.offsetWidth;
        personalSurprise.classList.add("revealed");

        // Затем открываем клапан и поднимаем письмо.

        envelopeTimer = setTimeout(() => {
            if (personalSurprise.hidden) return;

            envelopeScene.classList.add("is-open");

            // Без анимации содержимое тоже должно открыться.
            if (reduceMotion) {
                if (letterRevealedContent) {
                    letterRevealedContent.hidden = false;
                }
            }
        }, reduceMotion ? 0 : 250);
    });


    console.log("Mala Birthday завантажено 🌷");
});
