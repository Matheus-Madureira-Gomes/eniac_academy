<?php
// backend/api/get_products.php
require_once("../config.php");

$stmt = $pdo->prepare("SELECT id, nome, descricao, preco, imagem FROM products ORDER BY id DESC");
$stmt->execute();
$items = $stmt->fetchAll(PDO::FETCH_ASSOC);

header('Content-Type: application/json');
echo json_encode($items);
