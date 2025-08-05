<?php
// backend/config.php

class Database {
    private static $instance = null;
    private $connection;
    
    private function __construct() {
        // 🎯 Priorité des variables d'environnement :
        // 1. Variables d'environnement système (GitHub Actions)
        // 2. Variables Docker
        // 3. Fallbacks par défaut
        
        $host = $_ENV['DB_HOST'] ?? getenv('DB_HOST') ?: 'mariadb';
        $dbname = $_ENV['DB_NAME'] ?? getenv('DB_NAME') ?: 'interventions_db';
        $username = $_ENV['DB_USER'] ?? getenv('DB_USER') ?: 'app_user';
        $password = $_ENV['DB_PASS'] ?? getenv('DB_PASS') ?: 'app_pass';
        
        // 🧪 Si on est dans un environnement de test (GitHub Actions)
        if (isset($_ENV['GITHUB_ACTIONS']) || getenv('GITHUB_ACTIONS')) {
            $host = '127.0.0.1';
            $dbname = 'test_interventions';
            $username = 'test_user';
            $password = 'test_password';
        }
        
        // Debug uniquement en développement
        if (!isset($_ENV['GITHUB_ACTIONS'])) {
            error_log("🔧 Connexion DB: host=$host, db=$dbname, user=$username");
        }
        
        try {
            $this->connection = new PDO(
                "mysql:host=$host;dbname=$dbname;charset=utf8",
                $username,
                $password,
                [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
                ]
            );
        } catch (PDOException $e) {
            error_log("❌ Erreur PDO: " . $e->getMessage());
            throw new Exception("Erreur de connexion : " . $e->getMessage());
        }
    }
    
    public static function getInstance() {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }
    
    public function getConnection() {
        return $this->connection;
    }
}
?>