// src/pages/Dashboard/components/DropdownFilter.jsx
import { useState } from 'react'
import './DropdownFilter.scss'

function DropdownFilter({ currentFilter, onFilterChange }) {
  const [isOpen, setIsOpen] = useState(false)

  const filters = [
    { id: 'todos', label: 'Visão Geral', icon: '📊' },  // ← CORRIGI O ID
    { id: 'ambiental', label: 'Ambiental', icon: '🌿' },
    { id: 'trabalhista', label: 'Trabalhista', icon: '👷' },
    { id: 'sanitario', label: 'Sanitário', icon: '🏥' },
  ]

  const getCurrentLabel = () => {
    const found = filters.find(f => f.id === currentFilter)
    return found ? found.label : 'Visão Geral'
  }

  const getCurrentIcon = () => {
    const found = filters.find(f => f.id === currentFilter)
    return found ? found.icon : '📊'
  }

  return (
    // 👇 CONTAINER PRINCIPAL: detecta o hover
    <div 
      className="dropdown-filter"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      {/* 👇 RETÂNGULO VISÍVEL (sempre aparece) */}
      <div className="dropdown-label">Tipo de Risco:</div>
      <div className="dropdown-header">
        <span className="dropdown-selected">
          {getCurrentIcon()} {getCurrentLabel()}
        </span>
        <span className={`dropdown-arrow ${isOpen ? 'open' : ''}`}>▼</span>
      </div>

      {/* 👇 MENU (só aparece quando isOpen = true) */}
      {isOpen && (
        <div className="dropdown-menu">
          {filters.map(filter => (
            <div
              key={filter.id}
              className={`dropdown-item ${currentFilter === filter.id ? 'active' : ''}`}
              onClick={() => {
                onFilterChange(filter.id)
                setIsOpen(false)  // Fecha o menu após clicar
              }}
            >
              <span className="item-icon">{filter.icon}</span>
              <span className="item-label">{filter.label}</span>
              {currentFilter === filter.id && (
                <span className="item-check">✓</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default DropdownFilter