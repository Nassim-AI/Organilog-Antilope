<?php
// backend/Devis.php
class Devis {
    private $db;
    
    public function __construct() {
        $this->db = Database::getInstance()->getConnection();
    }
    
    public function getAll() {
        $stmt = $this->db->query("SELECT * FROM devis ORDER BY created_at DESC");
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
    
    public function getById($id) {
        $stmt = $this->db->prepare("SELECT * FROM devis WHERE id = ?");
        $stmt->execute([$id]);
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if (!$result) {
            throw new Exception("Devis non trouvé");
        }
        
        return $result;
    }
    
    public function create($data) {
        if (empty($data['client_name']) || empty($data['description'])) {
            throw new Exception("Client et description requis");
        }
        
        $stmt = $this->db->prepare(
            "INSERT INTO devis (client_name, description, montant, status, date_devis, date_validite) VALUES (?, ?, ?, ?, ?, ?)"
        );
        
        $status = $data['status'] ?? 'brouillon';
        $montant = $data['montant'] ?? 0.00;
        $date_devis = $data['date_devis'] ?? date('Y-m-d');
        $date_validite = $data['date_validite'] ?? null;
        
        $stmt->execute([
            $data['client_name'],
            $data['description'],
            $montant,
            $status,
            $date_devis,
            $date_validite
        ]);
        
        return $this->db->lastInsertId();
    }
    
    public function update($id, $data) {
        $fields = [];
        $values = [];
        
        $allowedFields = ['client_name', 'description', 'montant', 'status', 'date_devis', 'date_validite'];
        
        foreach ($allowedFields as $field) {
            if (isset($data[$field])) {
                $fields[] = "$field = ?";
                $values[] = $data[$field];
            }
        }
        
        if (empty($fields)) {
            throw new Exception("Aucun champ à mettre à jour");
        }
        
        $values[] = $id;
        $sql = "UPDATE devis SET " . implode(', ', $fields) . " WHERE id = ?";
        
        $stmt = $this->db->prepare($sql);
        $stmt->execute($values);
        
        if ($stmt->rowCount() === 0) {
            throw new Exception("Devis non trouvé");
        }
    }
    
    public function delete($id) {
        $stmt = $this->db->prepare("DELETE FROM devis WHERE id = ?");
        $stmt->execute([$id]);
        
        if ($stmt->rowCount() === 0) {
            throw new Exception("Devis non trouvé");
        }
    }
    
    public function getByStatus($status) {
        $stmt = $this->db->prepare("SELECT * FROM devis WHERE status = ? ORDER BY created_at DESC");
        $stmt->execute([$status]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}