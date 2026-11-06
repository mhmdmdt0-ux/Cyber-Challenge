<?php
// بيانات الاتصال الرسمية بالسيرفر السحابي لـ InfinityFree الخاص بـ Mo-Hatim
$host     = "://infinityfree.com"; 
$username = "if0_43370720"; 
$password = "f6S9zR2xP7q8"; // ⚠️ تأكد من كتابة باسورد حساب الاستضافة بدقة هنا
$dbname   = "if0_43370720_test_db"; 

$conn = new mysqli($host, $username, $password, $dbname);

if ($conn->connect_error) {
    die("فشل الاتصال بالسيرفر السحابي: " . $conn->connect_error);
}
$conn->set_charset("utf8mb4");
?>
