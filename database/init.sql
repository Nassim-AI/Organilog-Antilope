-- Réinitialisation propre
DROP TABLE IF EXISTS devis;
DROP TABLE IF EXISTS interventions;

CREATE TABLE interventions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    client_name VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    status ENUM('en_cours', 'terminee') DEFAULT 'en_cours',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE devis (
    id INT AUTO_INCREMENT PRIMARY KEY,
    client_name VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    montant DECIMAL(10,2) DEFAULT 0.00,
    status ENUM('brouillon', 'en_cours', 'accepte', 'refuse', 'facture') DEFAULT 'brouillon',
    date_devis DATE NOT NULL,
    date_validite DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO interventions (client_name, description, status) VALUES
('SARL Dupont', 'Maintenance climatisation bureau', 'en_cours'),
('Restaurant Le Soleil', 'Réparation frigo cuisine', 'en_cours'),
('Cabinet Médical Martin', 'Installation nouvelle imprimante', 'terminee');

INSERT INTO devis (client_name, description, montant, status, date_devis, date_validite) VALUES
('SARL Dupont', 'Devis maintenance annuelle climatisation', 1200.00, 'en_cours', '2025-08-04', '2025-09-04'),
('Restaurant Le Soleil', 'Devis réparation système réfrigération', 850.00, 'brouillon', '2025-08-04', '2025-08-18'),
('Garage Martin', 'Devis installation nouveau système électrique', 2500.00, 'accepte', '2025-08-01', '2025-08-15');
