import { useState } from 'react'
import type { Recipe } from '../types/types'

interface RecipeCardProps {
  recipe: Recipe
}

export function RecipeCard({ recipe }: RecipeCardProps) {
  const [expanded, setExpanded] = useState(false)
  return (
    <article className="recipe-card">
      <div className="recipe-image-wrap">
        <img className="recipe-image" src={recipe.imageUrl} alt={recipe.name} loading="lazy" />
        <span className="recipe-category">{recipe.category}</span>
      </div>
      <div className="recipe-content">
        <p className="recipe-area">{recipe.area} cuisine</p>
        <h3>{recipe.name}</h3>
        {expanded && (
          <p className="recipe-instructions">
            {recipe.instructions || 'No instructions are available for this recipe.'}
          </p>
        )}
        <div className="recipe-actions">
          <button type="button" className="details-button" onClick={() => setExpanded(!expanded)}>
            {expanded ? 'Hide details' : 'View recipe'}
            <span aria-hidden="true">{expanded ? '−' : '↗'}</span>
          </button>
          {recipe.sourceUrl && (
            <a className="source-link" href={recipe.sourceUrl} target="_blank" rel="noreferrer">
              Full recipe
            </a>
          )}
        </div>
      </div>
    </article>
  )
}
