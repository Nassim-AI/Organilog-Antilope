// frontend/src/App.jsx
import React from 'react'
import { useState, useEffect } from 'react'
import './App.css'

const API_URL = 'http://localhost:8080'

function App() {
  const [activeTab, setActiveTab] = useState('interventions')
  const [interventions, setInterventions] = useState([])
  const [devis, setDevis] = useState([])
  const [newIntervention, setNewIntervention] = useState({
    client_name: '',
    description: ''
  })
  const [newDevis, setNewDevis] = useState({
    client_name: '',
    description: '',
    montant: '',
    date_devis: new Date().toISOString().split('T')[0],
    date_validite: ''
  })
  const [filterIntervention, setFilterIntervention] = useState('all')
  const [filterDevis, setFilterDevis] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  // Charger les données
  useEffect(() => {
    fetchInterventions()
    fetchDevis()
  }, [])

  const fetchInterventions = async () => {
    try {
      const response = await fetch(API_URL)
      const data = await response.json()
      setInterventions(data)
    } catch (error) {
      console.error('Erreur:', error)
    }
  }

  const fetchDevis = async () => {
    try {
      const response = await fetch(`${API_URL}/api_devis.php`)
      const data = await response.json()
      console.log('Devis data:', data) // Debug
      setDevis(data)
    } catch (error) {
      console.error('Erreur:', error)
    }
  }

  // === INTERVENTIONS ===
  const addIntervention = async (e) => {
    e.preventDefault()
    if (!newIntervention.client_name || !newIntervention.description) return

    try {
      await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newIntervention)
      })
      
      setNewIntervention({ client_name: '', description: '' })
      fetchInterventions()
    } catch (error) {
      console.error('Erreur:', error)
    }
  }

  const toggleInterventionStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'en_cours' ? 'terminee' : 'en_cours'
    
    try {
      await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      })
      fetchInterventions()
    } catch (error) {
      console.error('Erreur:', error)
    }
  }

  const deleteIntervention = async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' })
      if (response.ok) {
        fetchInterventions()
      }
    } catch (error) {
      console.error('Erreur:', error)
    }
  }

  // === DEVIS ===
  const addDevis = async (e) => {
    e.preventDefault()
    if (!newDevis.client_name || !newDevis.description) return

    try {
      await fetch(`${API_URL}/api_devis.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newDevis)
      })
      
      setNewDevis({ 
        client_name: '', 
        description: '', 
        montant: '', 
        date_devis: new Date().toISOString().split('T')[0], 
        date_validite: '' 
      })
      fetchDevis()
    } catch (error) {
      console.error('Erreur:', error)
    }
  }

  const updateDevisStatus = async (id, newStatus) => {
    try {
      await fetch(`${API_URL}/api_devis.php/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      })
      fetchDevis()
    } catch (error) {
      console.error('Erreur:', error)
    }
  }

  const deleteDevis = async (id) => {
    try {
      const response = await fetch(`${API_URL}/api_devis.php/${id}`, { method: 'DELETE' })
      if (response.ok) {
        fetchDevis()
      }
    } catch (error) {
      console.error('Erreur:', error)
    }
  }

  // Filtres avec recherche
  const filteredInterventions = interventions.filter(intervention => {
    const matchesSearch = intervention.client_name.toLowerCase().includes(searchTerm.toLowerCase())
    
    if (filterIntervention === 'en_cours') return intervention.status === 'en_cours' && matchesSearch
    if (filterIntervention === 'terminee') return intervention.status === 'terminee' && matchesSearch
    return matchesSearch
  })

  const filteredDevis = devis.filter(d => {
    const matchesSearch = d.client_name.toLowerCase().includes(searchTerm.toLowerCase())
    
    if (filterDevis === 'brouillon') return d.status === 'brouillon' && matchesSearch
    if (filterDevis === 'en_cours') return d.status === 'en_cours' && matchesSearch
    if (filterDevis === 'accepte') return d.status === 'accepte' && matchesSearch
    if (filterDevis === 'refuse') return d.status === 'refuse' && matchesSearch
    if (filterDevis === 'facture') return d.status === 'facture' && matchesSearch
    return matchesSearch
  })

  const getStatusColor = (status) => {
    switch(status) {
      case 'brouillon': return '#95a5a6'
      case 'en_cours': return '#f39c12'
      case 'accepte': return '#27ae60'
      case 'refuse': return '#e74c3c'
      case 'facture': return '#3498db'
      case 'terminee': return '#27ae60'
      default: return '#f39c12'
    }
  }

  return (
    <div className="App">
      {/* Header style moderne */}
      <div className="header">
        <div className="logo">
          <span>Antilope</span>
          <span className="logo-subtitle">Gestion Pro</span>
        </div>
        <div className="search-bar">
          <input 
            type="text" 
            placeholder="Rechercher un client..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button>🔍</button>
        </div>
      </div>

      {/* Sidebar navigation */}
      <div className="main-container">
        <div className="sidebar">
          <nav>
            <button 
              className={activeTab === 'interventions' ? 'active' : ''}
              onClick={() => setActiveTab('interventions')}
            >
              Interventions
            </button>
            <button 
              className={activeTab === 'devis' ? 'active' : ''}
              onClick={() => setActiveTab('devis')}
            >
               Devis
            </button>
          </nav>
        </div>

        <div className="content">
          {activeTab === 'interventions' && (
            <div className="interventions-section">
              <div className="section-header">
                <h2>Interventions</h2>
              </div>

              {/* Formulaire ajout */}
              <form onSubmit={addIntervention} className="form-card">
                <input
                  type="text"
                  placeholder="Nom du client"
                  value={newIntervention.client_name}
                  onChange={(e) => setNewIntervention({...newIntervention, client_name: e.target.value})}
                />
                <input
                  type="text"
                  placeholder="Description"
                  value={newIntervention.description}
                  onChange={(e) => setNewIntervention({...newIntervention, description: e.target.value})}
                />
                <button type="submit">Ajouter</button>
              </form>

              {/* Filtres */}
              <div className="filters-organi">
                <button 
                  className={filterIntervention === 'all' ? 'active' : ''}
                  onClick={() => setFilterIntervention('all')}
                >
                  Tout ({interventions.length})
                </button>
                <button 
                  className={filterIntervention === 'en_cours' ? 'active' : ''}
                  onClick={() => setFilterIntervention('en_cours')}
                >
                  En cours ({interventions.filter(i => i.status === 'en_cours').length})
                </button>
                <button 
                  className={filterIntervention === 'terminee' ? 'active' : ''}
                  onClick={() => setFilterIntervention('terminee')}
                >
                  Terminées ({interventions.filter(i => i.status === 'terminee').length})
                </button>
              </div>

              {/* Table style Organilog */}
              <div className="table-container">
                <table className="organilog-table">
                  <thead>
                    <tr>
                      <th>Client</th>
                      <th>Description</th>
                      <th>Statut</th>
                      <th>Date</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredInterventions.map(intervention => (
                      <tr key={intervention.id}>
                        <td><strong>{intervention.client_name}</strong></td>
                        <td>{intervention.description}</td>
                        <td>
                          <span 
                            className="status-badge" 
                            style={{backgroundColor: getStatusColor(intervention.status)}}
                          >
                            {intervention.status === 'en_cours' ? 'En cours' : 'Terminée'}
                          </span>
                        </td>
                        <td>{new Date(intervention.created_at).toLocaleDateString()}</td>
                        <td>
                          <button 
                            className="btn-status"
                            onClick={() => toggleInterventionStatus(intervention.id, intervention.status)}
                          >
                            {intervention.status === 'en_cours' ? (
                              <svg width="16" height="16" viewBox="0 0 48 48" fill="currentColor">
                                <path d="M40,6H36V4a2,2,0,0,0-2-2H14a2,2,0,0,0-2,2V6H8A2,2,0,0,0,6,8V44a2,2,0,0,0,2,2H40a2,2,0,0,0,2-2V8A2,2,0,0,0,40,6ZM32.4,21.4l-10,10a1.9,1.9,0,0,1-2.8,0l-3.9-3.9a2.2,2.2,0,0,1-.4-2.7,2,2,0,0,1,3.1-.2L21,27.2l8.6-8.6a2,2,0,0,1,2.8,2.8Z"/>
                              </svg>
                            ) : (
                              <svg width="16" height="16" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
                                <path d="M5 18a.987.987 0 0 1-.383-.076A1 1 0 0 1 4 17V1A1 1 0 0 1 5.707.293l8 8a1 1 0 0 1 0 1.414l-8 8A1 1 0 0 1 5 18zM6 3.414v11.172L11.586 9z"/>
                              </svg>
                            )}
                          </button>
                          <button 
                            className="btn-delete"
                            onClick={() => deleteIntervention(intervention.id)}
                          >
                            <svg width="14" height="16" viewBox="0 0 109.484 122.88" fill="currentColor">
                              <path fillRule="evenodd" clipRule="evenodd" d="M2.347,9.633h38.297V3.76c0-2.068,1.689-3.76,3.76-3.76h21.144 c2.07,0,3.76,1.691,3.76,3.76v5.874h37.83c1.293,0,2.347,1.057,2.347,2.349v11.514H0V11.982C0,10.69,1.055,9.633,2.347,9.633 L2.347,9.633z M8.69,29.605h92.921c1.937,0,3.696,1.599,3.521,3.524l-7.864,86.229c-0.174,1.926-1.59,3.521-3.523,3.521h-77.3 c-1.934,0-3.352-1.592-3.524-3.521L5.166,33.129C4.994,31.197,6.751,29.605,8.69,29.605L8.69,29.605z M69.077,42.998h9.866v65.314 h-9.866V42.998L69.077,42.998z M30.072,42.998h9.867v65.314h-9.867V42.998L30.072,42.998z M49.572,42.998h9.869v65.314h-9.869 V42.998L49.572,42.998z"/>
                            </svg>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'devis' && (
            <div className="devis-section">
              <div className="section-header">
                <h2>Devis</h2>
              </div>

              {/* Formulaire ajout devis */}
              <form onSubmit={addDevis} className="form-card">
                <input
                  type="text"
                  placeholder="Nom du client"
                  value={newDevis.client_name}
                  onChange={(e) => setNewDevis({...newDevis, client_name: e.target.value})}
                />
                <input
                  type="text"
                  placeholder="Description"
                  value={newDevis.description}
                  onChange={(e) => setNewDevis({...newDevis, description: e.target.value})}
                />
                <input
                  type="number"
                  step="0.01"
                  placeholder="Montant €"
                  value={newDevis.montant}
                  onChange={(e) => setNewDevis({...newDevis, montant: e.target.value})}
                />
                <input
                  type="date"
                  value={newDevis.date_devis}
                  onChange={(e) => setNewDevis({...newDevis, date_devis: e.target.value})}
                />
                <input
                  type="date"
                  placeholder="Date limite validité"
                  value={newDevis.date_validite}
                  onChange={(e) => setNewDevis({...newDevis, date_validite: e.target.value})}
                />
                <button type="submit">Ajouter</button>
              </form>

              {/* Filtres devis */}
              <div className="filters-organi">
                <button 
                  className={filterDevis === 'all' ? 'active' : ''}
                  onClick={() => setFilterDevis('all')}
                >
                  Tout ({devis.length})
                </button>
                <button 
                  className={filterDevis === 'brouillon' ? 'active' : ''}
                  onClick={() => setFilterDevis('brouillon')}
                >
                  Brouillon ({devis.filter(d => d.status === 'brouillon').length})
                </button>
                <button 
                  className={filterDevis === 'en_cours' ? 'active' : ''}
                  onClick={() => setFilterDevis('en_cours')}
                >
                  En cours ({devis.filter(d => d.status === 'en_cours').length})
                </button>
                <button 
                  className={filterDevis === 'accepte' ? 'active' : ''}
                  onClick={() => setFilterDevis('accepte')}
                >
                  Accepté ({devis.filter(d => d.status === 'accepte').length})
                </button>
                <button 
                  className={filterDevis === 'refuse' ? 'active' : ''}
                  onClick={() => setFilterDevis('refuse')}
                >
                  Refusé ({devis.filter(d => d.status === 'refuse').length})
                </button>
              </div>

              {/* Table devis style Organilog */}
              <div className="table-container">
                <table className="organilog-table">
                  <thead>
                    <tr>
                      <th>Type</th>
                      <th>Client</th>
                      <th>Description</th>
                      <th>Montant</th>
                      <th>Statut</th>
                      <th>Date devis</th>
                      <th>Validité</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDevis.map(d => (
                      <tr key={d.id}>
                        <td> Devis</td>
                        <td><strong>{d.client_name}</strong></td>
                        <td>{d.description}</td>
                        <td><strong>{parseFloat(d.montant).toFixed(2)} €</strong></td>
                        <td>
                          <select 
                            value={d.status} 
                            onChange={(e) => updateDevisStatus(d.id, e.target.value)}
                            className="status-select"
                          >
                            <option value="brouillon">Brouillon</option>
                            <option value="en_cours">En cours</option>
                            <option value="accepte">Accepté</option>
                            <option value="refuse">Refusé</option>
                            <option value="facture">Facturé</option>
                          </select>
                        </td>
                        <td>{d.date_devis ? new Date(d.date_devis).toLocaleDateString() : '-'}</td>
                        <td>{d.date_validite ? new Date(d.date_validite).toLocaleDateString() : '-'}</td>
                        <td>
                          <button 
                            className="btn-delete"
                            onClick={() => deleteDevis(d.id)}
                          >
                            <svg width="14" height="16" viewBox="0 0 109.484 122.88" fill="currentColor">
                              <path fillRule="evenodd" clipRule="evenodd" d="M2.347,9.633h38.297V3.76c0-2.068,1.689-3.76,3.76-3.76h21.144 c2.07,0,3.76,1.691,3.76,3.76v5.874h37.83c1.293,0,2.347,1.057,2.347,2.349v11.514H0V11.982C0,10.69,1.055,9.633,2.347,9.633 L2.347,9.633z M8.69,29.605h92.921c1.937,0,3.696,1.599,3.521,3.524l-7.864,86.229c-0.174,1.926-1.59,3.521-3.523,3.521h-77.3 c-1.934,0-3.352-1.592-3.524-3.521L5.166,33.129C4.994,31.197,6.751,29.605,8.69,29.605L8.69,29.605z M69.077,42.998h9.866v65.314 h-9.866V42.998L69.077,42.998z M30.072,42.998h9.867v65.314h-9.867V42.998L30.072,42.998z M49.572,42.998h9.869v65.314h-9.869 V42.998L49.572,42.998z"/>
                            </svg>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default App