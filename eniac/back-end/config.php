<?php
// backend/config.php
session_start();

// Ajuste conforme seu ambiente XAMPP
$host = "localhost";
$db   = "eniac_store";
$user = "root";
$pass = ""; // senha do MySQL (XAMPP costuma ser vazia)

// cria um "user_id" de sessão padrão para testes (usuário 1)
if (!isset($_SESSION['user_id'])) {
    $_SESSION['user_id'] = 1;
}

try {
    $pdo = new PDO("mysql:host=$host;dbname=$db;charset=utf8mb4", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Erro na conexão: " . $e->getMessage()]);
    exit;
}
?>
