<?php
// backend/api/update_cart.php
require_once("../config.php");
$id = $_POST['id'] ?? null;
$quantidade = intval($_POST['quantidade'] ?? 1);
if (!$id) { echo json_encode(["status"=>"error","msg"=>"id required"]); exit; }

$update = $pdo->prepare("UPDATE cart_items SET quantidade=? WHERE id=?");
$update->execute([$quantidade, $id]);

echo json_encode(["status"=>"success"]);
