<?php
// backend/api/get_user.php
require_once("../config.php");
$user_id = $_SESSION['user_id'];

$stmt = $pdo->prepare("SELECT id, nome, email, telefone, endereco FROM users WHERE id=?");
$stmt->execute([$user_id]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);

header('Content-Type: application/json');
echo json_encode($user ?: []);
