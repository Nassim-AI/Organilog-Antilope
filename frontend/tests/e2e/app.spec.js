import { test, expect } from '@playwright/test';

test.describe('Application Antilope', () => {
  
  test('affiche la page d\'accueil correctement', async ({ page }) => {
    await page.goto('/');
    
    // Vérifier le logo Antilope 
    await expect(page.locator('text=Antilope')).toBeVisible();
    await expect(page.locator('text=Gestion Pro')).toBeVisible();
    
    // Vérifier que l'onglet Interventions est actif par défaut
    await expect(page.locator('button.active').filter({ hasText: 'Interventions' })).toBeVisible();
    
    // Vérifier le titre de la section
    await expect(page.locator('h2').filter({ hasText: 'Interventions' })).toBeVisible();
  });

  test('permet de naviguer entre les onglets', async ({ page }) => {
    await page.goto('/');
    
    // Cliquer sur l'onglet Devis dans la sidebar 
    await page.locator('button').filter({ hasText: 'Devis' }).click();
    
    // Vérifier que l'onglet Devis est maintenant actif
    await expect(page.locator('button.active').filter({ hasText: 'Devis' })).toBeVisible();
    
    // Vérifier le titre de la section Devis
    await expect(page.locator('h2').filter({ hasText: 'Devis' })).toBeVisible();
    
    // Retourner aux Interventions 
    await page.locator('button').filter({ hasText: 'Interventions' }).click();
    await expect(page.locator('button.active').filter({ hasText: 'Interventions' })).toBeVisible();
  });

  test('affiche le formulaire d\'ajout d\'intervention', async ({ page }) => {
    await page.goto('/');
    
    // Vérifier que le formulaire est présent
    await expect(page.locator('input[placeholder="Nom du client"]')).toBeVisible();
    await expect(page.locator('input[placeholder="Description"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]').filter({ hasText: 'Ajouter' })).toBeVisible();
  });

  test('utilise la barre de recherche', async ({ page }) => {
    await page.goto('/');
    
    // Trouver et utiliser la barre de recherche
    const searchInput = page.locator('input[placeholder="Rechercher un client..."]');
    await expect(searchInput).toBeVisible();
    
    // Taper dans la recherche
    await searchInput.fill('test client');
    await expect(searchInput).toHaveValue('test client');
    
    // Vérifier le bouton de recherche
    await expect(page.locator('button').filter({ hasText: '🔍' })).toBeVisible();
  });

  test('permet de changer les filtres', async ({ page }) => {
    await page.goto('/');
    
    // Vérifier que "Tout" est actif par défaut
    await expect(page.locator('.filters-organi button.active').filter({ hasText: 'Tout' })).toBeVisible();
    
    // Cliquer sur "En cours"
    await page.locator('.filters-organi button').filter({ hasText: 'En cours' }).click();
    await expect(page.locator('.filters-organi button.active').filter({ hasText: 'En cours' })).toBeVisible();
    
    // Cliquer sur "Terminées"
    await page.locator('.filters-organi button').filter({ hasText: 'Terminées' }).click();
    await expect(page.locator('.filters-organi button.active').filter({ hasText: 'Terminées' })).toBeVisible();
  });

  test('affiche le tableau des interventions', async ({ page }) => {
    await page.goto('/');
    
    // Vérifier les en-têtes du tableau
    await expect(page.locator('th').filter({ hasText: 'Client' })).toBeVisible();
    await expect(page.locator('th').filter({ hasText: 'Description' })).toBeVisible();
    await expect(page.locator('th').filter({ hasText: 'Statut' })).toBeVisible();
    await expect(page.locator('th').filter({ hasText: 'Date' })).toBeVisible();
    await expect(page.locator('th').filter({ hasText: 'Action' })).toBeVisible();
  });

  test('affiche le formulaire de devis', async ({ page }) => {
    await page.goto('/');
    
    // Naviguer vers l'onglet Devis
    await page.locator('button').filter({ hasText: 'Devis' }).click();
    
    // Vérifier le titre
    await expect(page.locator('h2').filter({ hasText: 'Devis' })).toBeVisible();
    
    // Vérifier les champs du formulaire devis
    await expect(page.locator('input[placeholder="Nom du client"]')).toBeVisible();
    await expect(page.locator('input[placeholder="Description"]')).toBeVisible();
    await expect(page.locator('input[placeholder="Montant €"]')).toBeVisible();
    await expect(page.locator('input[type="date"]').first()).toBeVisible(); // Date devis
  });

  test('affiche le tableau des devis', async ({ page }) => {
    await page.goto('/');
    
    // Naviguer vers l'onglet Devis
    await page.locator('button').filter({ hasText: 'Devis' }).click();
    
    // Vérifier les en-têtes du tableau devis
    await expect(page.locator('th').filter({ hasText: 'Type' })).toBeVisible();
    await expect(page.locator('th').filter({ hasText: 'Client' })).toBeVisible();
    await expect(page.locator('th').filter({ hasText: 'Description' })).toBeVisible();
    await expect(page.locator('th').filter({ hasText: 'Montant' })).toBeVisible();
    await expect(page.locator('th').filter({ hasText: 'Statut' })).toBeVisible();
    await expect(page.locator('th').filter({ hasText: 'Date devis' })).toBeVisible();
    await expect(page.locator('th').filter({ hasText: 'Validité' })).toBeVisible();
    await expect(page.locator('th').filter({ hasText: 'Action' })).toBeVisible();
  });

});