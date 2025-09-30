<?php
// backend/api/get_product.php
require_once("../config.php");

$id = $_GET['id'] ?? null;
if (!$id) { echo json_encode([]); exit; }

$stmt = $pdo->prepare("SELECT id, nome, descricao, preco, imagem FROM products WHERE id = ?");
$stmt->execute([$id]);
$item = $stmt->fetch(PDO::FETCH_ASSOC);

header('Content-Type: application/json');
echo json_encode($item ?: []);
