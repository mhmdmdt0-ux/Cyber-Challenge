
"use strict";

/* =========================================
   1. أدوات مساعدة عامة
========================================= */

function getElement(selector) {
    return document.querySelector(selector);
}


/* =========================================
   2. الصفحة الرئيسية
========================================= */

function setupHomePage() {
    // لا توجد وظائف إضافية حاليًا.
}


/* =========================================
   3. تسجيل الدخول
========================================= */

function setupLoginPage() {
    const form = getElement("form");
    const email = getElement("#email");
    const password = getElement("#password");

    if (!form || !email || !password) return;

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        if (!email.value.trim() || !password.value) {
            alert("يرجى إدخال البريد الإلكتروني وكلمة المرور.");
            return;
        }

        if (!email.checkValidity()) {
            alert("يرجى إدخال بريد إلكتروني صحيح.");
            email.focus();
            return;
        }

        alert(
            "تم التحقق من البيانات مبدئيًا. " +
            "تسجيل الدخول الفعلي يحتاج إلى الخادم وقاعدة البيانات."
        );
    });
}


/* =========================================
   4. إنشاء حساب
========================================= */

function setupRegisterPage() {
    const form = getElement("form");
    const name = getElement("#full-name");
    const email = getElement("#email");
    const password = getElement("#password");
    const confirmPassword = getElement("#confirm-password");
    const terms = getElement("#terms");

    if (!form || !name || !email || !password ||
        !confirmPassword || !terms) return;

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        if (!name.value.trim()) {
            alert("يرجى إدخال الاسم الكامل.");
            name.focus();
            return;
        }

        if (!email.value.trim() || !email.checkValidity()) {
            alert("يرجى إدخال بريد إلكتروني صحيح.");
            email.focus();
            return;
        }

        if (password.value.length < 8) {
            alert("يجب ألا تقل كلمة المرور عن 8 أحرف.");
            password.focus();
            return;
        }

        if (password.value !== confirmPassword.value) {
            alert("كلمتا المرور غير متطابقتين.");
            confirmPassword.focus();
            return;
        }

        if (!terms.checked) {
            alert("يرجى الموافقة على الشروط والأحكام.");
            return;
        }

        alert(
            "البيانات صحيحة مبدئيًا. " +
            "إنشاء الحساب الفعلي يحتاج إلى الخادم وقاعدة البيانات."
        );
    });
}


/* =========================================
   5. استعادة كلمة المرور
========================================= */

function setupForgotPasswordPage() {
    const form = getElement("form");
    const email = getElement("#email");

    if (!form || !email) return;

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        if (!email.value.trim() || !email.checkValidity()) {
            alert("يرجى إدخال بريد إلكتروني صحيح.");
            email.focus();
            return;
        }

        alert(
            "تم التحقق من البريد مبدئيًا. " +
            "استعادة كلمة المرور تحتاج إلى الخادم وخدمة البريد الإلكتروني."
        );
    });
}


/* =========================================
   6. تغيير كلمة المرور
========================================= */

function setupChangePasswordPage() {
    const form = getElement("form");
    const currentPassword = getElement("#current-password");
    const newPassword = getElement("#new-password");
    const confirmPassword = getElement("#confirm-password");

    if (!form || !currentPassword || !newPassword ||
        !confirmPassword) return;

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        if (newPassword.value.length < 8) {
            alert("يجب ألا تقل كلمة المرور الجديدة عن 8 أحرف.");
            newPassword.focus();
            return;
        }

        if (newPassword.value !== confirmPassword.value) {
            alert("كلمة المرور الجديدة غير متطابقة مع التأكيد.");
            confirmPassword.focus();
            return;
        }

        if (newPassword.value === currentPassword.value) {
            alert("يجب اختيار كلمة مرور مختلفة عن الحالية.");
            newPassword.focus();
            return;
        }

        alert(
            "اجتازت البيانات التحقق المبدئي. " +
            "تغيير كلمة المرور فعليًا يحتاج إلى ربط الخادم."
        );
    });
}


/* =========================================
   7. صفحة التحديات
========================================= */

function setupChallengesPage() {
    // الروابط تعمل عبر HTML.
}


/* =========================================
   8. صفحة حل التحدي
========================================= */

function setupChallengePage() {
    const form = getElement("#challenge-form") || getElement("form");

    if (!form) return;

    const correctAnswers = {
        q1: "c",
        q2: "b",
        q3: "a"
    };

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        let correctCount = 0;
        const answers = {};
        const totalQuestions = Object.keys(correctAnswers).length;

        for (const question in correctAnswers) {
            const selected = form.querySelector(
                'input[name="' + question + '"]:checked'
            );

            if (!selected) {
                alert("يرجى الإجابة عن جميع الأسئلة.");
                return;
            }

            answers[question] = selected.value;

            if (selected.value === correctAnswers[question]) {
                correctCount++;
            }
        }

        const result = {
            challengeId: new URLSearchParams(window.location.search)
                .get("challenge") || "password-security",
            correctCount: correctCount,
            totalQuestions: totalQuestions,
            score: correctCount * 10,
            percentage: Math.round(
                correctCount / totalQuestions * 100
            ),
            answers: answers,
            completedAt: new Date().toISOString()
        };

        try {
            sessionStorage.setItem(
                "cyberChallengeResult",
                JSON.stringify(result)
            );

            const historyKey = "cyberChallengeHistory";
            const storedHistory = localStorage.getItem(historyKey);
            const history = storedHistory ? JSON.parse(storedHistory) : [];

            if (Array.isArray(history)) {
                history.push(result);

                localStorage.setItem(
                    historyKey,
                    JSON.stringify(history)
                );
            }

            window.location.href = "result.html";

        } catch (error) {
            console.error("تعذر حفظ نتيجة التحدي:", error);
            alert("تعذر حفظ النتيجة. يرجى المحاولة مرة أخرى.");
        }
    });
}


/* =========================================
   9. صفحة نتيجة التحدي
========================================= */

function setupResultPage() {
    let result;

    try {
        const saved = sessionStorage.getItem("cyberChallengeResult");

        if (!saved) {
            showMissingResult();
            return;
        }

        result = JSON.parse(saved);

    } catch (error) {
        console.error("تعذر قراءة النتيجة:", error);
        showMissingResult();
        return;
    }

    if (
        !result ||
        !Number.isFinite(result.correctCount) ||
        !Number.isFinite(result.totalQuestions) ||
        result.totalQuestions <= 0 ||
        !Number.isFinite(result.score)
    ) {
        showMissingResult();
        return;
    }

    const summary = getElement(
        'section[aria-labelledby="summary-title"]'
    );

    if (!summary) return;

    const paragraphs = summary.querySelectorAll("p");
    const correct = result.correctCount;
    const total = result.totalQuestions;
    const percentage = Math.round(correct / total * 100);

    if (paragraphs.length >= 5) {
        paragraphs[0].querySelector("strong").textContent =
            correct + " / " + total;

        paragraphs[1].querySelector("strong").textContent =
            correct + " / " + total;

        paragraphs[2].querySelector("strong").textContent = total;

        paragraphs[3].querySelector("strong").textContent =
            percentage + "%";

        paragraphs[4].querySelector("strong").textContent =
            result.score + " XP";
    }

    const feedback = getElement(
        'section[aria-labelledby="feedback-title"] p'
    );

    if (feedback) {
        if (percentage === 100) {
            feedback.textContent =
                "ممتاز! أجبت عن جميع الأسئلة بصورة صحيحة.";

        } else if (percentage >= 70) {
            feedback.textContent =
                "أداء جيد جدًا! راجع الأسئلة التي أخطأت فيها.";

        } else if (percentage >= 40) {
            feedback.textContent =
                "بداية جيدة! راجع الأساسيات وحاول مرة أخرى.";

        } else {
            feedback.textContent =
                "واصل التعلم والممارسة، وستتحسن نتائجك مع الوقت.";
        }
    }
}

/* =========================================
   10. عدم وجود نتيجة
========================================= */

function showMissingResult() {
    const summary = getElement(
        'section[aria-labelledby="summary-title"]'
    );

    const feedback = getElement(
        'section[aria-labelledby="feedback-title"] p'
    );

    if (summary) {
        const paragraphs = summary.querySelectorAll("p");

        if (paragraphs.length >= 5) {
            paragraphs[0].querySelector("strong").textContent =
                "لم تُحتسب بعد";

            paragraphs[1].querySelector("strong").textContent = "—";
            paragraphs[2].querySelector("strong").textContent = "3";
            paragraphs[3].querySelector("strong").textContent = "—";
            paragraphs[4].querySelector("strong").textContent = "—";
        }
    }

    if (feedback) {
        feedback.textContent =
            "لم يتم العثور على نتيجة محفوظة. يرجى حل التحدي أولًا.";
    }
}


/* =========================================
   11. لوحة التحكم
========================================= */

function setupDashboardPage() {
    // يمكن إضافة ملخص التقدم لاحقًا.
}


/* =========================================
   12. صفحة الشارات
========================================= */

function setupBadgesPage() {
    let history = [];

    try {
        const savedHistory = localStorage.getItem("cyberChallengeHistory");

        if (savedHistory) {
            history = JSON.parse(savedHistory);
        }

        if (!Array.isArray(history)) {
            history = [];
        }

    } catch (error) {
        console.error("تعذر تحميل سجل التحديات:", error);
    }

    const passwordResult = findBestResult(history, "password-security");
    const networkResult = findBestResult(history, "network");

    const bestPercentage = history.reduce(function (best, item) {
        return Math.max(best, Number(item.percentage) || 0);
    }, 0);

    const statuses = [
        history.length >= 1,
        history.length >= 5,
        Boolean(passwordResult && passwordResult.percentage >= 80),
        Boolean(networkResult && networkResult.percentage >= 80),
        bestPercentage >= 90
    ];

    const articles = document.querySelectorAll(
        'section[aria-labelledby="badges-title"] article'
    );

    let earnedCount = 0;

    articles.forEach(function (article, index) {
        const paragraphs = article.querySelectorAll("p");
        const earned = statuses[index] === true;

        if (earned) earnedCount++;

        if (paragraphs.length >= 2) {
            paragraphs[1].textContent = earned
                ? "الحالة: مكتسبة ✅"
                : "الحالة: لم تُكتسب بعد.";
        }
    });

    const summary = getElement(
        'section[aria-labelledby="summary-title"]'
    );

    if (summary) {
        const paragraphs = summary.querySelectorAll("p");

        if (paragraphs.length >= 2) {
            paragraphs[0].querySelector("strong").textContent =
                earnedCount;

            paragraphs[1].querySelector("strong").textContent = "5";
        }
    }
}


/* =========================================
   13. البحث عن أفضل نتيجة
========================================= */

function findBestResult(history, challengeId) {
    const matching = history.filter(function (item) {
        return item && item.challengeId === challengeId;
    });

    if (matching.length === 0) return null;

    return matching.reduce(function (best, item) {
        return Number(item.percentage) > Number(best.percentage)
            ? item
            : best;
    });
}


/* =========================================
   14. صفحة عن المنصة
========================================= */

function setupAboutPage() {
    // صفحة تعريفية لا تحتاج إلى JavaScript حاليًا.
}


/* =========================================
   15. صفحة تواصل معنا
========================================= */

function setupContactPage() {
    const form = getElement("form");

    const nameInput = getElement("#full-name");
    const emailInput = getElement("#email");
    const typeInput = getElement("#message-type");
    const subjectInput = getElement("#subject");
    const messageInput = getElement("#message");

    if (
        !form ||
        !nameInput ||
        !emailInput ||
        !typeInput ||
        !subjectInput ||
        !messageInput
    ) {
        return;
    }

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        if (!nameInput.value.trim()) {
            alert("يرجى إدخال الاسم الكامل.");
            nameInput.focus();
            return;
        }

        if (!emailInput.value.trim() || !emailInput.checkValidity()) {
            alert("يرجى إدخال بريد إلكتروني صحيح.");
            emailInput.focus();
            return;
        }

        if (!typeInput.value) {
            alert("يرجى اختيار نوع الرسالة.");
            typeInput.focus();
            return;
        }

        if (!subjectInput.value.trim()) {
            alert("يرجى إدخال موضوع الرسالة.");
            subjectInput.focus();
            return;
        }

        if (!messageInput.value.trim()) {
            alert("يرجى كتابة نص الرسالة.");
            messageInput.focus();
            return;
        }

        alert(
            "تم التحقق من بيانات الرسالة بنجاح، " +
            "لكن لم تُرسل فعليًا بعد. إرسال الرسائل يحتاج إلى ربط النموذج بالخادم."
        );
    });
}

/* =========================================
   16. الملف الشخصي
========================================= */

function setupProfilePage() {
    const profile = getSavedProfile();

    const name = getElement("#profile-name");
    const email = getElement("#profile-email");
    const created = getElement("#profile-created");

    if (name) {
        name.textContent = profile.fullName || "لم يُسجّل بعد";
    }

    if (email) {
        email.textContent = profile.email || "لم يُسجّل بعد";
    }

    if (created) {
        created.textContent = profile.createdAt
            ? new Date(profile.createdAt).toLocaleDateString("ar")
            : "يتطلب إنشاء حساب";
    }

    let history = [];

    try {
        const savedHistory = localStorage.getItem("cyberChallengeHistory");
        history = savedHistory ? JSON.parse(savedHistory) : [];

        if (!Array.isArray(history)) {
            history = [];
        }

    } catch (error) {
        console.error("تعذر تحميل سجل التحديات:", error);
    }

    const totalXP = history.reduce(function (sum, item) {
        return sum + (Number(item.score) || 0);
    }, 0);

    const uniqueChallenges = new Set(
        history.map(function (item) {
            return item.challengeId;
        }).filter(Boolean)
    ).size;

    const level = Math.floor(totalXP / 100) + 1;
    const bestByChallenge = new Map();

    history.forEach(function (item) {
        if (!item || !item.challengeId) return;

        const previous = bestByChallenge.get(item.challengeId);

        if (
            !previous ||
            (Number(item.percentage) || 0) >
            (Number(previous.percentage) || 0)
        ) {
            bestByChallenge.set(item.challengeId, item);
        }
    });

    const stats = document.querySelectorAll("[data-profile-stat]");

    stats.forEach(function (element) {
        const stat = element.getAttribute("data-profile-stat");

        if (stat === "xp") {
            element.textContent = totalXP;
        }

        if (stat === "challenges") {
            element.textContent = uniqueChallenges;
        }

        if (stat === "level") {
            element.textContent = level;
        }

        if (stat === "badges") {
            element.textContent = Array.from(bestByChallenge.values())
                .filter(function (item) {
                    return Number(item.percentage) >= 80;
                }).length;
        }
    });
}


/* =========================================
   17. قراءة بيانات الملف الشخصي
========================================= */

function getSavedProfile() {
    try {
        const savedProfile = localStorage.getItem(
            "cyberChallengeProfile"
        );

        if (!savedProfile) return {};

        const profile = JSON.parse(savedProfile);

        return profile && typeof profile === "object"
            ? profile
            : {};

    } catch (error) {
        console.error("تعذر قراءة بيانات الملف الشخصي:", error);
        return {};
    }
}


/* =========================================
   18. تعديل الملف الشخصي
========================================= */

function setupEditProfilePage() {
    const form = getElement("form");
    const nameInput = getElement("#full-name");
    const emailInput = getElement("#email");

    if (!form || !nameInput || !emailInput) return;

    const profile = getSavedProfile();

    nameInput.value = profile.fullName || "";
    emailInput.value = profile.email || "";

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        const fullName = nameInput.value.trim();
        const email = emailInput.value.trim();

        if (!fullName) {
            alert("يرجى إدخال الاسم الكامل.");
            nameInput.focus();
            return;
        }

        if (!email || !emailInput.checkValidity()) {
            alert("يرجى إدخال بريد إلكتروني صحيح.");
            emailInput.focus();
            return;
        }

        const updatedProfile = {
            fullName: fullName,
            email: email,
            createdAt: profile.createdAt || null,
            updatedAt: new Date().toISOString()
        };

        try {
            localStorage.setItem(
                "cyberChallengeProfile",
                JSON.stringify(updatedProfile)
            );

            alert("تم حفظ التعديلات في هذا المتصفح بنجاح.");

            window.location.href = "profile.html";

        } catch (error) {
            console.error("تعذر حفظ بيانات الملف الشخصي:", error);

            alert(
                "تعذر حفظ البيانات في المتصفح. يرجى المحاولة مرة أخرى."
            );
        }
    });
}


/* =========================================
   19. تشغيل الوظيفة المناسبة لكل صفحة
========================================= */

function initializePage() {
    const path = window.location.pathname.toLowerCase();

    try {
        if (path.endsWith("/") || path.endsWith("/index.html")) {
            setupHomePage();

        } else if (path.endsWith("/login.html")) {
            setupLoginPage();

        } else if (path.endsWith("/register.html")) {
            setupRegisterPage();

        } else if (path.endsWith("/forgot-password.html")) {
            setupForgotPasswordPage();

        } else if (path.endsWith("/change-password.html")) {
            setupChangePasswordPage();

        } else if (path.endsWith("/challenges.html")) {
            setupChallengesPage();

        } else if (path.endsWith("/challenge.html")) {
            setupChallengePage();

        } else if (path.endsWith("/result.html")) {
            setupResultPage();

        } else if (path.endsWith("/dashboard.html")) {
            setupDashboardPage();

        } else if (path.endsWith("/badges.html")) {
            setupBadgesPage();

        } else if (path.endsWith("/about.html")) {
            setupAboutPage();

        } else if (path.endsWith("/contact.html")) {
            setupContactPage();

        } else if (path.endsWith("/profile.html")) {
            setupProfilePage();

        } else if (path.endsWith("/edit-profile.html")) {
            setupEditProfilePage();
        }

    } catch (error) {
        console.error("حدث خطأ أثناء تشغيل الصفحة:", error);
    }
}

document.addEventListener("DOMContentLoaded", initializePage);
