<?php
// backend/Intervention.php
class Intervention {
    private $db;
    
    public function __construct() {
        $this->db = Database::getInstance()->getConnection();
    }
    
    public function getAll() {
        $stmt = $this->db->query("SELECT * FROM interventions ORDER BY created_at DESC");
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
    
    public function getById($id) {
        $stmt = $this->db->prepare("SELECT * FROM interventions WHERE id = ?");
        $stmt->execute([$id]);
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if (!$result) {
            throw new Exception("Intervention non trouvée");
        }
        
        return $result;
    }
    
    public function create($data) {
        if (empty($data['client_name']) || empty($data['description'])) {
            throw new Exception("Client et description requis");
        }
        
        $stmt = $this->db->prepare(
            "INSERT INTO interventions (client_name, description, status) VALUES (?, ?, ?)"
        );
        
        $status = $data['status'] ?? 'en_cours';
        $stmt->execute([
            $data['client_name'],
            $data['description'],
            $status
        ]);
        
        return $this->db->lastInsertId();
    }
    
    public function update($id, $data) {
        $fields = [];
        $values = [];
        
        if (isset($data['client_name'])) {
            $fields[] = "client_name = ?";
            $values[] = $data['client_name'];
        }
        
        if (isset($data['description'])) {
            $fields[] = "description = ?";
            $values[] = $data['description'];
        }
        
        if (isset($data['status'])) {
            $fields[] = "status = ?";
            $values[] = $data['status'];
        }
        
        if (empty($fields)) {
            throw new Exception("Aucun champ à mettre à jour");
        }
        
        $values[] = $id;
        $sql = "UPDATE interventions SET " . implode(', ', $fields) . " WHERE id = ?";
        
        $stmt = $this->db->prepare($sql);
        $stmt->execute($values);
        
        if ($stmt->rowCount() === 0) {
            throw new Exception("Intervention non trouvée");
        }
    }
    
    public function delete($id) {
        $stmt = $this->db->prepare("DELETE FROM interventions WHERE id = ?");
        $stmt->execute([$id]);
        
        if ($stmt->rowCount() === 0) {
            throw new Exception("Intervention non trouvée");
        }
    }
}