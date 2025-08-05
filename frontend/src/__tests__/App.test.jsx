import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../App'

test('affiche le titre principal', () => {
  render(<App />)
  const titre = screen.getByRole('heading', { name: /interventions/i })
  expect(titre).toBeInTheDocument()
})

test("le bouton 'Ajouter' est visible même si les champs sont vides", async () => {
  render(<App />)
  const boutonAjouter = screen.getByRole('button', { name: /ajouter/i })
  expect(boutonAjouter).toBeInTheDocument()
})

test("change de filtre vers 'En cours'", async () => {
  render(<App />)
  const boutonEnCours = screen.getByRole('button', { name: /en cours \(0\)/i })
  expect(boutonEnCours).toBeInTheDocument()

  await userEvent.click(boutonEnCours)

  expect(boutonEnCours.classList.contains('active')).toBe(true)
})