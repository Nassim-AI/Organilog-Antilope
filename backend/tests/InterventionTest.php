<?php
use PHPUnit\Framework\TestCase;

// Charger d'abord la config de base de données
require_once __DIR__ . '/../config.php';
// Puis la classe métier
require_once __DIR__ . '/../Intervention.php';

class InterventionTest extends TestCase {
    private $intervention;

    protected function setUp(): void {
        $this->intervention = new Intervention();
    }

    public function testCreateIntervention() {
        $data = [
            'client_name' => 'Test Client',
            'description' => 'Test Description',
            'status' => 'en_cours'
        ];
        $id = $this->intervention->create($data);
        $this->assertIsNumeric($id);
    }

    public function testGetAllInterventions() {
        $all = $this->intervention->getAll();
        $this->assertIsArray($all);
    }

    public function testGetById() {
        $id = $this->intervention->create([
            'client_name' => 'GetById Test',
            'description' => 'Test description'
        ]);
        $intervention = $this->intervention->getById($id);
        $this->assertEquals('GetById Test', $intervention['client_name']);
    }

    public function testUpdateIntervention() {
        $id = $this->intervention->create([
            'client_name' => 'Update Test',
            'description' => 'Old Description'
        ]);

        $this->intervention->update($id, [
            'description' => 'Updated Description'
        ]);

        $updated = $this->intervention->getById($id);
        $this->assertEquals('Updated Description', $updated['description']);
    }

    public function testDeleteIntervention() {
        $id = $this->intervention->create([
            'client_name' => 'Delete Test',
            'description' => 'To be deleted'
        ]);

        $this->intervention->delete($id);

        $this->expectException(Exception::class);
        $this->intervention->getById($id);
    }
}
