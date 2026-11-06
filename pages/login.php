<?php 
// 1. بدء الجلسة (Session) لتذكر بيانات المستخدم عبر صفحات الموقع
session_start();

// 2. تضمين ملف الاتصال بالسيرفر السحابي
include '../config.php'; 

$message = "";

// 3. كود استقبال ومعالجة البيانات عند الضغط على زر تسجيل الدخول
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $email    = trim($_POST['email']);
    $password = $_POST['password'];

    if (empty($email) || empty($password)) {
        $message = "<div style='color:orange; font-weight:bold; margin-bottom:15px;'>الرجاء ملء جميع الحقول الإلزامية!</div>";
    } 
    elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $message = "<div style='color:red; font-weight:bold; margin-bottom:15px;'>صيغة البريد الإلكتروني غير صحيحة!</div>";
    } 
    else {
        // البحث عن المستخدم في قاعدة البيانات عبر بريده الإلكتروني
        $sql = "SELECT * FROM users WHERE email = '$email'";
        $result = $conn->query($sql);

        if ($result && $result->num_rows > 0) {
            $user = $result->fetch_assoc();
            
            // فحص ومطابقة كلمة المرور المدخلة مع المشفرة في قاعدة البيانات
            if (password_verify($password, $user['password'])) {
                
                // تخزين بيانات المستخدم داخل الجلسة
                $_SESSION['user_id']   = $user['id'];
                $_SESSION['user_name'] = $user['name'];
                
                // توجيه المستخدم تلقائياً إلى الصفحة الرئيسية بعد نجاح الدخول
                header("Location: ../index.php");
                exit();
                
            } else {
                $message = "<div style='color:red; font-weight:bold; margin-bottom:15px;'>كلمة المرور غير صحيحة!</div>";
            }
        } else {
            $message = "<div style='color:red; font-weight:bold; margin-bottom:15px;'>عذراً، هذا البريد الإلكتروني غير مسجل في النظام!</div>";
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
    <meta name="description" content="تسجيل الدخول إلى منصة Cyber Challenge">
    <title>تسجيل الدخول | Cyber Challenge</title>
</head>
<body>

    <!-- Header -->
    <header>
        <a href="../index.php">
            <h1>🛡️ Cyber Challenge</h1>
        </a>
    </header>

    <!-- Main Content -->
    <main>
        <section aria-labelledby="login-title">
            <h2 id="login-title">تسجيل الدخول | Login</h2>

            <!-- عرض رسائل التنبيه أو الأخطاء للمستخدم -->
            <?php echo $message; ?>

            <form action="login.php" method="post">

                <!-- Email -->
                <div>
                    <label for="email">البريد الإلكتروني</label>
                    <br>
                    <input type="email" id="email" name="email" placeholder="أدخل بريدك الإلكتروني" autocomplete="email" required>
                </div>
                <br>

                <!-- Password -->
                <div>
                    <label for="password">كلمة المرور</label>
                    <br>
                    <input type="password" id="password" name="password" placeholder="أدخل كلمة المرور" autocomplete="current-password" required>
                </div>
                <br>

                <!-- Remember Me -->
                <div>
                    <input type="checkbox" id="remember" name="remember" value="1">
                    <label for="remember">تذكرني</label>
                </div>
                <br>

                <!-- Forgot Password -->
                <div>
                    <a href="forgot-password.html">نسيت كلمة المرور؟</a>
                </div>
                <br>

                <!-- Submit -->
                <button type="submit">تسجيل الدخول</button>

            </form>

            <!-- Register -->
            <p>
                ليس لديك حساب؟
                <!-- تعديل الرابط ليتوجه لصفحة register.php المحدثة -->
                <a href="register.php">إنشاء حساب</a>
            </p>

            <!-- Back Home -->
            <p>
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
