<?php
// backend/api/get_cart.php
require_once("../config.php");
$user_id = $_SESSION['user_id'];

$stmt = $pdo->prepare("
  SELECT c.id as cart_id, p.id as product_id, p.nome, p.preco, p.imagem, c.quantidade
  FROM cart_items c
  JOIN products p ON c.product_id = p.id
  WHERE c.user_id=?
");
$stmt->execute([$user_id]);
$items = $stmt->fetchAll(PDO::FETCH_ASSOC);

header('Content-Type: application/json');
echo json_encode($items);
