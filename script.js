const OWNER_WHATSAPP = "60128076603";

const state = {
    step: 0,

    product: "",
    otherProduct: "",

    quantity: "",

    design: "",

    fabricStatus: "",
    fabric: "",

    timeline: ""
};

const products = [
    "T-Shirt Polo",
    "T-Shirt Round Neck",
    "Jersey",
    "Sleeveless",
    "Rugby Shorts",
    "Socks",
    "Others"
];

const quantities = [
    "1–20 pieces",
    "21–50 pieces",
    "51–100 pieces",
    "101–200 pieces",
    "201–500 pieces",
    "500+ pieces"
];

const timelines = [
    "Within 1 week",
    "1–2 weeks",
    "2–4 weeks",
    "1–2 months",
    "More than 2 months",
    "Not sure yet"
];

const questions = [
    {
        title: "What are you looking to make?",
        subtitle: "Choose the product you're interested in.",
        key: "product",
        options: products
    },

    {
        title: "Approximately how many pieces?",
        subtitle: "An estimated quantity is enough for now.",
        key: "quantity",
        options: quantities
    },

    {
        title: "Do you already have a design?",
        subtitle: "Don't worry — this is just to understand where you're at.",
        key: "design",
        options: [
            "Yes, I already have a design",
            "No, I don't have a design yet"
        ]
    },

    {
        title: "Do you have a preferred fabric?",
        subtitle: "If you're unsure, we'll discuss the options with you.",
        key: "fabricStatus",
        options: [
            "Yes, I have a preference",
            "No, I don't have a preference",
            "I'm not sure"
        ]
    },

    {
        title: "When do you need it?",
        subtitle: "Give us an idea of your preferred timeline.",
        key: "timeline",
        options: timelines
    }
];

const app = document.getElementById("app");
const toast = document.getElementById("toast");


function render() {

    if (state.step === 0) {
        renderWelcome();
        return;
    }

    if (state.step >= 1 && state.step <= 5) {
        renderQuestion(state.step - 1);
        return;
    }

    if (state.step === 6) {
        renderSummary();
    }
}


/* =========================
   WELCOME
========================= */

function renderWelcome() {

    app.innerHTML = `
        <section class="welcome">

            <div class="eyebrow">
                <span class="eyebrow-line"></span>
                VICto ORDER GUIDE
            </div>

            <h1>
                Let's make<br>
                something <span>worth wearing.</span>
            </h1>

            <p class="welcome-description">
                Tell us a little about what you're looking for.
                It only takes a minute — and gives our team
                a better starting point for the conversation.
            </p>

            <button class="start-button" onclick="startGuide()">
                Start your order
                <span class="arrow">→</span>
            </button>

        </section>
    `;
}


/* =========================
   QUESTION
========================= */

function renderQuestion(index) {

    const question = questions[index];
    const selectedValue = state[question.key];

    const progress = ((index + 1) / questions.length) * 100;

    app.innerHTML = `
        <section class="question-screen">

            <div class="question-top">

                <span class="step-number">
                    0${index + 1} / 05
                </span>

                <div class="progress-track">
                    <div
                        class="progress-fill"
                        style="width: ${progress}%"
                    ></div>
                </div>

                <h1 class="question-title">
                    ${question.title}
                </h1>

                <p class="question-subtitle">
                    ${question.subtitle}
                </p>

            </div>

            <div class="options">

                ${question.options.map((option, i) => `

                    <button
                        class="option ${selectedValue === option ? "selected" : ""}"
                        onclick="selectOption('${question.key}', '${escapeAttribute(option)}')"
                    >

                        <span class="option-content">

                            <span class="option-title">
                                ${option}
                            </span>

                        </span>

                        <span class="option-number">
                            ${String(i + 1).padStart(2, "0")}
                        </span>

                    </button>

                `).join("")}

            </div>

            ${renderCustomInput(question)}

            <div class="navigation">

                <button
                    class="back-button"
                    onclick="goBack()"
                >
                    ← Back
                </button>

                <button
                    class="next-button ${canContinue(index) ? "" : "disabled"}"
                    onclick="nextStep()"
                >
                    ${index === 4 ? "View my brief" : "Continue"} →
                </button>

            </div>

        </section>
    `;

    const customInput = document.querySelector(".custom-input");

if (customInput) {
    setTimeout(() => {
        customInput.focus();

        customInput.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });
    }, 300);
}
}


/* =========================
   CUSTOM INPUTS
========================= */

function renderCustomInput(question) {

    if (
        question.key === "product" &&
        state.product === "Others"
    ) {

        return `
            <div class="custom-input-wrapper">

                <div class="custom-input-label">
                    Tell us what you would like to make
                </div>

                <input
                    class="custom-input"
                    type="text"
                    placeholder="e.g. Basketball shorts"
                    value="${escapeHTML(state.otherProduct)}"
                    oninput="state.otherProduct = this.value; updateNextButton()"
                >

            </div>
        `;
    }


    if (
        question.key === "fabricStatus" &&
        state.fabricStatus === "Yes, I have a preference"
    ) {

        return `
            <div class="custom-input-wrapper">

                <div class="custom-input-label">
                    What fabric do you have in mind?
                </div>

                <input
                    class="custom-input"
                    type="text"
                    placeholder="e.g. Cotton, Dry Fit, Microfiber"
                    value="${escapeHTML(state.fabric)}"
                    oninput="state.fabric = this.value; updateNextButton()"
                >

            </div>
        `;
    }

    return "";
}


/* =========================
   SELECTION
========================= */

function selectOption(key, value) {

    state[key] = value;

    if (key === "product" && value !== "Others") {
        state.otherProduct = "";
    }

    if (
        key === "fabricStatus" &&
        value !== "Yes, I have a preference"
    ) {
        state.fabric = "";
    }

    render();
}


/* =========================
   NAVIGATION
========================= */

function startGuide() {

    state.step = 1;

    render();

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


function nextStep() {

    const index = state.step - 1;

    if (!canContinue(index)) {

        showToast("Choose an option to continue.");

        return;
    }

    if (
        index === 0 &&
        state.product === "Others" &&
        !state.otherProduct.trim()
    ) {

        showToast("Tell us what you'd like to make.");

        return;
    }

    if (
        index === 3 &&
        state.fabricStatus === "Yes, I have a preference" &&
        !state.fabric.trim()
    ) {

        showToast("Tell us which fabric you have in mind.");

        return;
    }

    state.step++;

    render();

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


function goBack() {

    if (state.step <= 1) {

        state.step = 0;

    } else {

        state.step--;
    }

    render();

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


/* =========================
   VALIDATION
========================= */

function canContinue(index) {

    const question = questions[index];

    if (!state[question.key]) {
        return false;
    }

    if (
        question.key === "product" &&
        state.product === "Others" &&
        !state.otherProduct.trim()
    ) {
        return false;
    }

    if (
        question.key === "fabricStatus" &&
        state.fabricStatus === "Yes, I have a preference" &&
        !state.fabric.trim()
    ) {
        return false;
    }

    return true;
}

function updateNextButton() {

    const button = document.querySelector(".next-button");

    if (!button) {
        return;
    }

    const index = state.step - 1;

    if (canContinue(index)) {

        button.classList.remove("disabled");

    } else {

        button.classList.add("disabled");

    }
}


/* =========================
   SUMMARY
========================= */

function renderSummary() {

    const product =
        state.product === "Others"
            ? state.otherProduct
            : state.product;

    let fabric = "No preference";

    if (state.fabricStatus === "Yes, I have a preference") {
        fabric = state.fabric;
    }

    if (state.fabricStatus === "I'm not sure") {
        fabric = "Not sure yet";
    }

    const design =
        state.design === "Yes, I already have a design"
            ? "Already have a design"
            : "No design yet";

    app.innerHTML = `

        <section class="summary-screen">

            <div class="summary-header">

                <div class="summary-label">
                    VICto / ORDER BRIEF
                </div>

                <h1 class="summary-title">
                    Here's what<br>
                    we've got.
                </h1>

                <p class="summary-description">
                    Everything looks good? Send this brief
                    to our team and let's talk about the details.
                </p>

            </div>


            <div class="summary-list">

                ${summaryRow(
                    "Product",
                    product,
                    1
                )}

                ${summaryRow(
                    "Quantity",
                    state.quantity,
                    2
                )}

                ${summaryRow(
                    "Design",
                    design,
                    3
                )}

                ${summaryRow(
                    "Fabric",
                    fabric,
                    4
                )}

                ${summaryRow(
                    "Timeline",
                    state.timeline,
                    5
                )}

            </div>


            <div class="summary-actions">

                <button
                    class="whatsapp-button"
                    onclick="openWhatsApp()"
                >
                    <span>Looks good — let's talk</span>
                    <span>→</span>
                </button>

                <p class="summary-note">
                    Your order brief will be prepared in WhatsApp.
                    You can still discuss or change any details with our team.
                </p>

            </div>

        </section>

    `;
}


function summaryRow(label, value, step) {

    return `
        <div class="summary-row">

            <span class="summary-key">
                ${label}
            </span>

            <span class="summary-value">
                ${escapeHTML(value)}
            </span>

            <button
                class="edit-button"
                onclick="editStep(${step})"
            >
                Edit
            </button>

        </div>
    `;
}


/* =========================
   EDIT
========================= */

function editStep(step) {

    state.step = step;

    render();

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


/* =========================
   WHATSAPP
========================= */

function openWhatsApp() {

    const product =
        state.product === "Others"
            ? state.otherProduct
            : state.product;

    let fabric = "No preference";

    if (state.fabricStatus === "Yes, I have a preference") {
        fabric = state.fabric;
    }

    if (state.fabricStatus === "I'm not sure") {
        fabric = "Not sure yet";
    }

    const design =
        state.design === "Yes, I already have a design"
            ? "Existing design"
            : "No design yet";

    const message = `
Hi Victo! I'd like to enquire about an order.

*ORDER BRIEF*
━━━━━━━━━━━━━━
Product: ${product}
Quantity: ${state.quantity}
Design: ${design}
Fabric: ${fabric}
Timeline: ${state.timeline}
━━━━━━━━━━━━━━

I'd like to discuss the details and quotation.

Thank you!
`.trim();

    const url =
        `https://wa.me/${OWNER_WHATSAPP}?text=${encodeURIComponent(message)}`;

    window.open(url, "_blank");
}


function escapeHTML(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


function escapeAttribute(value) {

    return String(value)
        .replace(/'/g, "\\'")
        .replace(/"/g, "&quot;");
}


/* =========================
   INITIALIZE
========================= */

render();