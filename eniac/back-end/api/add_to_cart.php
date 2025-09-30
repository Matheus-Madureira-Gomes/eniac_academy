<?php
// backend/api/add_to_cart.php
require_once("../config.php");

$user_id = $_SESSION['user_id']; // sessão
$product_id = $_POST['product_id'] ?? null;
$quantidade = intval($_POST['quantidade'] ?? 1);
if (!$product_id) { echo json_encode(["status"=>"error","msg"=>"product_id required"]); exit; }

$stmt = $pdo->prepare("SELECT * FROM cart_items WHERE user_id=? AND product_id=?");
$stmt->execute([$user_id, $product_id]);
$item = $stmt->fetch(PDO::FETCH_ASSOC);

if ($item) {
    $update = $pdo->prepare("UPDATE cart_items SET quantidade = quantidade + ? WHERE id=?");
    $update->execute([$quantidade, $item['id']]);
} else {
    $insert = $pdo->prepare("INSERT INTO cart_items (user_id, product_id, quantidade) VALUES (?, ?, ?)");
    $insert->execute([$user_id, $product_id, $quantidade]);
}

echo json_encode(["status"=>"success"]);
