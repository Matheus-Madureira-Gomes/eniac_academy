<?php
// backend/api/create_order.php
require_once("../config.php");

$user_id = $_SESSION['user_id'];
$forma_pagamento = $_POST['forma_pagamento'] ?? 'Pix';
$entrega_tipo = $_POST['entrega_tipo'] ?? 'retirada';
$endereco = $_POST['endereco'] ?? '';

$stmt = $pdo->prepare("
  SELECT c.id as cart_id, p.id as product_id, p.preco, c.quantidade
  FROM cart_items c
  JOIN products p ON c.product_id = p.id
  WHERE c.user_id=?
");
$stmt->execute([$user_id]);
$cart_items = $stmt->fetchAll(PDO::FETCH_ASSOC);

if (count($cart_items) === 0) {
    echo json_encode(["status"=>"error", "msg"=>"Carrinho vazio"]);
    exit;
}

// Calcular total
$total = 0;
foreach ($cart_items as $item) {
    $total += $item['preco'] * $item['quantidade'];
}

$pdo->beginTransaction();
try {
    $insert = $pdo->prepare("INSERT INTO orders (user_id, total, forma_pagamento, entrega_tipo, endereco_entrega) VALUES (?, ?, ?, ?, ?)");
    $insert->execute([$user_id, $total, $forma_pagamento, $entrega_tipo, $endereco]);
    $order_id = $pdo->lastInsertId();

    $insertItem = $pdo->prepare("INSERT INTO order_items (order_id, product_id, quantidade, preco_unit) VALUES (?, ?, ?, ?)");
    foreach ($cart_items as $item) {
        $insertItem->execute([$order_id, $item['product_id'], $item['quantidade'], $item['preco']]);
    }

    $clearCart = $pdo->prepare("DELETE FROM cart_items WHERE user_id=?");
    $clearCart->execute([$user_id]);

    $pdo->commit();
    echo json_encode(["status"=>"success", "order_id"=>$order_id, "total"=>$total]);
} catch (Exception $e) {
    $pdo->rollBack();
    echo json_encode(["status"=>"error", "msg"=>$e->getMessage()]);
}
