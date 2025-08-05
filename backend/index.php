<?php
// backend/index.php
// Headers CORS en premier
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

// Gérer les requêtes OPTIONS (preflight)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once 'config.php';
require_once 'Intervention.php';

$intervention = new Intervention();
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
                echo json_encode($intervention->getById($id));
            } else {
                echo json_encode($intervention->getAll());
            }
            break;
            
        case 'POST':
            $data = json_decode(file_get_contents('php://input'), true);
            
            // Si c'est une suppression déguisée en POST
            if (isset($data['action']) && $data['action'] === 'delete') {
                $intervention->delete($data['id']);
                echo json_encode(['message' => 'Intervention supprimée']);
            } else {
                // Création normale
                $result = $intervention->create($data);
                echo json_encode(['id' => $result, 'message' => 'Intervention créée']);
            }
            break;
            
        case 'PUT':
            if ($id) {
                $data = json_decode(file_get_contents('php://input'), true);
                $intervention->update($id, $data);
                echo json_encode(['message' => 'Intervention mise à jour']);
            } else {
                throw new Exception('ID requis pour la mise à jour');
            }
            break;
            
        case 'DELETE':
            if ($id) {
                $intervention->delete($id);
                echo json_encode(['message' => 'Intervention supprimée']);
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