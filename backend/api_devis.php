<?php
// backend/api_devis.php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once 'config.php';
require_once 'Devis.php';

$devis = new Devis();
$method = $_SERVER['REQUEST_METHOD'];
$requestUri = $_SERVER['REQUEST_URI'];

// Extraire l'ID depuis l'URL
$id = null;
if (preg_match('/\/(\d+)$/', $requestUri, $matches)) {
    $id = (int)$matches[1];
}

try {
    switch ($method) {
        case 'GET':
            if ($id) {
                echo json_encode($devis->getById($id));
            } else {
                echo json_encode($devis->getAll());
            }
            break;
            
        case 'POST':
            $data = json_decode(file_get_contents('php://input'), true);
            $result = $devis->create($data);
            echo json_encode(['id' => $result, 'message' => 'Devis créé']);
            break;
            
        case 'PUT':
            if ($id) {
                $data = json_decode(file_get_contents('php://input'), true);
                $devis->update($id, $data);
                echo json_encode(['message' => 'Devis mis à jour']);
            } else {
                throw new Exception('ID requis pour la mise à jour');
            }
            break;
            
        case 'DELETE':
            if ($id) {
                $devis->delete($id);
                echo json_encode(['message' => 'Devis supprimé']);
            } else {
                throw new Exception('ID requis pour la suppression');
            }
            break;
            
        default:
            http_response_code(405);
            echo json_encode(['error' => 'Méthode non autorisée']);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}