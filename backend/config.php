<?php
// backend/config.php
class Database {
    private static $instance = null;
    private $connection;
    
    private function __construct() {
        // 🎯 Priorité des variables d'environnement :
        // 1. Variables d'environnement Azure
        // 2. Variables d'environnement système (GitHub Actions)
        // 3. Variables Docker locales
        // 4. Fallbacks par défaut
        
        $host = $_ENV['DB_HOST'] ?? getenv('DB_HOST') ?: 'mariadb';
        $dbname = $_ENV['DB_NAME'] ?? getenv('DB_NAME') ?: 'interventions_db';
        $username = $_ENV['DB_USER'] ?? getenv('DB_USER') ?: 'app_user';
        $password = $_ENV['DB_PASS'] ?? getenv('DB_PASS') ?: 'app_pass';
        $port = $_ENV['DB_PORT'] ?? getenv('DB_PORT') ?: '3306';
        
        // 🧪 Si on est dans un environnement de test (GitHub Actions)
        if (isset($_ENV['GITHUB_ACTIONS']) || getenv('GITHUB_ACTIONS')) {
            $host = '127.0.0.1';
            $dbname = 'test_interventions';
            $username = 'test_user';
            $password = 'test_password';
            $port = '3306';
        }
        
        // 🌐 Si on est sur Azure (détection automatique)
        if (isset($_ENV['WEBSITE_SITE_NAME']) || getenv('WEBSITE_SITE_NAME')) {
            // Azure App Service détecté
            error_log("🌐 Environnement Azure détecté");
        }
        
        // Debug uniquement en développement
        if (!isset($_ENV['GITHUB_ACTIONS']) && !isset($_ENV['WEBSITE_SITE_NAME'])) {
            error_log("🔧 Connexion DB: host=$host:$port, db=$dbname, user=$username");
        }
        
        try {
            $dsn = "mysql:host=$host;port=$port;dbname=$dbname;charset=utf8";
            $this->connection = new PDO(
                $dsn,
                $username,
                $password,
                [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                    PDO::ATTR_TIMEOUT => 30, // Timeout pour Azure
                    PDO::MYSQL_ATTR_SSL_VERIFY_SERVER_CERT => false // Nécessaire pour Azure MySQL
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