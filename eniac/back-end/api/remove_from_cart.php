<?php
// backend/api/remove_from_cart.php
require_once("../config.php");
$id = $_POST['id'] ?? null;
if (!$id) { echo json_encode(["status"=>"error","msg"=>"id required"]); exit; }

$delete = $pdo->prepare("DELETE FROM cart_items WHERE id=?");
$delete->execute([$id]);

echo json_encode(["status"=>"success"]);
