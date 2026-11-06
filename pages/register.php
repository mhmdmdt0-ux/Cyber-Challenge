<?php 
// 1. تضمين ملف الاتصال بالسيرفر السحابي (خرجنا خطوة للخلف لأننا داخل مجلد pages)
include '../config.php'; 

$message = "";

// 2. كود استقبال ومعالجة البيانات عند الضغط على زر إنشاء الحساب
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $full_name        = trim($_POST['full_name']);
    $email            = trim($_POST['email']);
    $password         = $_POST['password'];
    $confirm_password = $_POST['confirm_password'];

    // فحص الحماية والتحقق من المدخلات
    if (empty($full_name) || empty($email) || empty($password) || empty($confirm_password)) {
        $message = "<div style='color:orange; font-weight:bold; margin-bottom:15px;'>الرجاء ملء جميع الحقول الإلزامية!</div>";
    } 
    elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $message = "<div style='color:red; font-weight:bold; margin-bottom:15px;'>صيغة البريد الإلكتروني غير صحيحة!</div>";
    } 
    elseif ($password !== $confirm_password) {
        $message = "<div style='color:red; font-weight:bold; margin-bottom:15px;'>كلمتا المرور غير متطابقتين!</div>";
    } 
    elseif (strlen($password) < 8) {
        $message = "<div style='color:red; font-weight:bold; margin-bottom:15px;'>يجب أن تكون كلمة المرور 8 أحرف على الأقل!</div>";
    } 
    else {
        // فحص ما إذا كان البريد الإلكتروني مسجلاً مسبقاً لمنع التكرار
        $check_email = $conn->query("SELECT id FROM users WHERE email = '$email'");
        if ($check_email->num_rows > 0) {
            $message = "<div style='color:red; font-weight:bold; margin-bottom:15px;'>عذراً! هذا البريد الإلكتروني مسجل مسبقاً!</div>";
        } else {
            // تشفير كلمة المرور لحماية الحسابات أمنياً (ممارسة سيبرانية هامة)
            $hashed_password = password_hash($password, PASSWORD_DEFAULT);

            // إدخال الحساب الجديد في قاعدة البيانات
            $sql = "INSERT INTO users (name, email, password) VALUES ('$full_name', '$email', '$hashed_password')";
            if ($conn->query($sql) === TRUE) {
                $message = "<div style='color:green; font-weight:bold; margin-bottom:15px;'>تم إنشاء الحساب بنجاح! ✅ يمكنك الآن تسجيل الدخول.</div>";
            } else {
                $message = "<div style='color:red; font-weight:bold; margin-bottom:15px;'>حدث خطأ أثناء الحفظ: " . $conn->error . "</div>";
            }
        }
    }
}
?>
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <link rel="stylesheet" href="../style.css">
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="إنشاء حساب في منصة Cyber Challenge">
    <title>إنشاء حساب | Cyber Challenge</title>
</head>
<body>

    <!-- Header -->
    <header>
        <!-- تعديل الرابط ليتوجه إلى index.php -->
        <a href="../index.php">
            <h1>🛡️ Cyber Challenge</h1>
        </a>
    </header>

    <!-- Main Content -->
    <main>
        <section aria-labelledby="register-title">
            <h2 id="register-title">إنشاء حساب | Register</h2>

            <!-- عرض رسائل النجاح أو الأخطاء التنبيهية -->
            <?php echo $message; ?>

            <!-- تعديل الأكشن ليرسل البيانات إلى نفس الصفحة الحالية register.php -->
            <form action="register.php" method="post">

                <!-- Full Name -->
                <div>
                    <label for="full-name">الاسم الكامل</label>
                    <br>
                    <input type="text" id="full-name" name="full_name" autocomplete="name" placeholder="أدخل اسمك الكامل" required>
                </div>
                <br>

                <!-- Email -->
                <div>
                    <label for="email">البريد الإلكتروني</label>
                    <br>
                    <input type="email" id="email" name="email" autocomplete="email" placeholder="أدخل بريدك الإلكتروني" required>
                </div>
                <br>

                <!-- Password -->
                <div>
                    <label for="password">كلمة المرور</label>
                    <br>
                    <input type="password" id="password" name="password" autocomplete="new-password" minlength="8" placeholder="8 أحرف على الأقل" required>
                </div>
                <br>

                <!-- Confirm Password -->
                <div>
                    <label for="confirm-password">تأكيد كلمة المرور</label>
                    <br>
                    <input type="password" id="confirm-password" name="confirm_password" autocomplete="new-password" minlength="8" placeholder="أعد إدخال كلمة المرور" required>
                </div>
                <br>

                <!-- Terms -->
                <div>
                    <input type="checkbox" id="terms" name="terms" value="accepted" required>
                    <label for="terms">أوافق على شروط الاستخدام</label>
                </div>
                <br>

                <!-- Submit -->
                <button type="submit">إنشاء الحساب</button>

            </form>

            <p>
                لديك حساب بالفعل؟
                <a href="login.html">تسجيل الدخول</a>
            </p>

            <p>
                <!-- تعديل رابط العودة للرئيسية -->
                <a href="../index.php">العودة إلى الرئيسية</a>
            </p>
        </section>
    </main>

    <!-- Footer -->
    <footer>
        <p>© 2026 Cyber Challenge</p>
    </footer>

    <script src="../script.js" defer></script>
</body>
</html>
