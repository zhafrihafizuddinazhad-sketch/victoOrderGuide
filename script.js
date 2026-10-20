
const OWNER_WHATSAPP = "60128076603";

const state = {
    step: 0,
    product: "",
    otherProduct: "",
    purpose: "",
    otherPurpose: "",
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

const purposes = [
    "Event / Programme",
    "Corporate / Company",
    "Sports / Team",
    "School / University",
    "Business / Merchandise",
    "Personal / Group",
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
        title: "What are you making these for?",
        subtitle: "Tell us the purpose of your order.",
        key: "purpose",
        options: purposes
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

function escapeHTML(value) {
    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function render() {
    if (state.step === 0) {
        renderWelcome();
    } else if (state.step <= questions.length) {
        renderQuestion(state.step - 1);
    } else {
        renderSummary();
    }
}

function renderWelcome() {
    app.innerHTML = `
        <section class="welcome">
            <div class="eyebrow">
                <span class="eyebrow-line"></span>
                VICTO ORDER GUIDE
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

function renderQuestion(index) {
    const question = questions[index];
    const selectedValue = state[question.key];
    const progress = ((index + 1) / questions.length) * 100;

    app.innerHTML = `
        <section class="question-screen">
            <div class="question-top">
                <span class="step-number">
                    ${String(index + 1).padStart(2, "0")} /
                    ${String(questions.length).padStart(2, "0")}
                </span>
                <div class="progress-track">
                    <div class="progress-fill"
                         style="width: ${progress}%"></div>
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
                        data-option-index="${i}"
                    >
                        <span class="option-content">
                            <span class="option-title">
                                ${escapeHTML(option)}
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
                <button class="back-button" onclick="goBack()">
                    ← Back
                </button>
                <button
                    class="next-button ${canContinue(index) ? "" : "disabled"}"
                    onclick="nextStep()"
                >
                    ${index === questions.length - 1
                        ? "View my brief"
                        : "Continue"} →
                </button>
            </div>
        </section>
    `;

    document.querySelectorAll("[data-option-index]")
        .forEach(button => {
            button.addEventListener("click", () => {
                const i = Number(button.dataset.optionIndex);
                selectOption(question.key, question.options[i]);
            });
        });

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

function renderCustomInput(question) {
    let label = "";
    let placeholder = "";
    let value = "";
    let field = "";

    if (question.key === "product" &&
        state.product === "Others") {
        label = "Tell us what you would like to make";
        placeholder = "e.g. Basketball shorts";
        value = state.otherProduct;
        field = "otherProduct";
    }

    if (question.key === "purpose" &&
        state.purpose === "Others") {
        label = "Tell us what your order is for";
        placeholder = "e.g. Family reunion";
        value = state.otherPurpose;
        field = "otherPurpose";
    }

    if (question.key === "fabricStatus" &&
        state.fabricStatus === "Yes, I have a preference") {
        label = "What fabric do you have in mind?";
        placeholder = "e.g. Cotton, Dry Fit, Microfiber";
        value = state.fabric;
        field = "fabric";
    }

    if (!field) return "";

    return `
        <div class="custom-input-wrapper">
            <div class="custom-input-label">
                ${label}
            </div>
            <input
                class="custom-input"
                type="text"
                placeholder="${placeholder}"
                value="${escapeHTML(value)}"
                data-custom-field="${field}"
            >
        </div>
    `;
}

function selectOption(key, value) {
    state[key] = value;

    if (key === "product" && value !== "Others") {
        state.otherProduct = "";
    }

    if (key === "purpose" && value !== "Others") {
        state.otherPurpose = "";
    }

    if (key === "fabricStatus" &&
        value !== "Yes, I have a preference") {
        state.fabric = "";
    }

    render();

    const input = document.querySelector("[data-custom-field]");
    if (input) {
        input.addEventListener("input", function () {
            state[this.dataset.customField] = this.value;
            updateNextButton();
        });
    }
}

function startGuide() {
    state.step = 1;
    render();
    scrollToTop();
}

function nextStep() {
    const index = state.step - 1;

    if (!canContinue(index)) {
        showToast("Please complete your answer to continue.");
        return;
    }

    state.step++;
    render();
    scrollToTop();
}

function goBack() {
    state.step = Math.max(0, state.step - 1);
    render();
    scrollToTop();
}

function editStep(step) {
    state.step = step;
    render();
    scrollToTop();
}

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

function canContinue(index) {
    const question = questions[index];
    if (!question || !state[question.key]) return false;

    if (question.key === "product" &&
        state.product === "Others" &&
        !state.otherProduct.trim()) return false;

    if (question.key === "purpose" &&
        state.purpose === "Others" &&
        !state.otherPurpose.trim()) return false;

    if (question.key === "fabricStatus" &&
        state.fabricStatus === "Yes, I have a preference" &&
        !state.fabric.trim()) return false;

    return true;
}

function updateNextButton() {
    const button = document.querySelector(".next-button");
    if (!button) return;

    button.classList.toggle(
        "disabled",
        !canContinue(state.step - 1)
    );
}

function getBrief() {
    return {
        product: state.product === "Others"
            ? state.otherProduct : state.product,

        purpose: state.purpose === "Others"
            ? state.otherPurpose : state.purpose,

        quantity: state.quantity,

        design: state.design === "Yes, I already have a design"
            ? "Existing design" : "No design yet",

        fabric: state.fabricStatus === "Yes, I have a preference"
            ? state.fabric
            : state.fabricStatus === "I'm not sure"
                ? "Not sure yet"
                : "No preference",

        timeline: state.timeline
    };
}

function summaryRow(label, value, step) {
    return `
        <div class="summary-row">
            <span class="summary-key">${label}</span>
            <span class="summary-value">
                ${escapeHTML(value)}
            </span>
            <button class="edit-button"
                    onclick="editStep(${step})">
                Edit
            </button>
        </div>
    `;
}

function renderSummary() {
    const brief = getBrief();

    app.innerHTML = `
        <section class="summary-screen">
            <div class="summary-header">
                <div class="summary-label">
                    VICTO / ORDER BRIEF
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
                ${summaryRow("Product", brief.product, 1)}
                ${summaryRow("Purpose", brief.purpose, 2)}
                ${summaryRow("Quantity", brief.quantity, 3)}
                ${summaryRow("Design", brief.design, 4)}
                ${summaryRow("Fabric", brief.fabric, 5)}
                ${summaryRow("Timeline", brief.timeline, 6)}
            </div>

            <div class="summary-actions">
                <button class="whatsapp-button"
                        onclick="openWhatsApp()">
                    <span>Looks good — let's talk</span>
                    <span>→</span>
                </button>
                <p class="summary-note">
                    Your order brief will be prepared in WhatsApp.
                    You can still discuss or change any details
                    with our team.
                </p>
            </div>
        </section>
    `;
}

function openWhatsApp() {
    const brief = getBrief();

    const message = `
Hi Victo! I'd like to enquire about an order.

*ORDER BRIEF*
━━━━━━━━━━━━━━
Product: ${brief.product}
Purpose: ${brief.purpose}
Quantity: ${brief.quantity}
Design: ${brief.design}
Fabric: ${brief.fabric}
Timeline: ${brief.timeline}
━━━━━━━━━━━━━━

I'd like to discuss the details and quotation.

Thank you!
`.trim();

    const url = `https://wa.me/${OWNER_WHATSAPP}?text=${
        encodeURIComponent(message)
    }`;

    window.open(url, "_blank");
}

function showToast(message) {
    if (!toast) return;

    toast.textContent = message;
    toast.classList.add("show");

    clearTimeout(showToast.timeout);
    showToast.timeout = setTimeout(() => {
        toast.classList.remove("show");
    }, 3000);
}

document.addEventListener("input", event => {
    const field = event.target.dataset.customField;

    if (field && Object.prototype.hasOwnProperty.call(state, field)) {
        state[field] = event.target.value;
        updateNextButton();
    }
});

render();
