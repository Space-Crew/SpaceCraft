import React from 'react'

const WorldListPresentation = ({worlds, handleClick}) => {
  return (
    <ul>
      {worlds.map(world => {
        return (
          <li key={world.key} onClick={() => handleClick(world.key)}>
            {world.name}
          </li>
        )
      })}
    </ul>
  )
}

export default WorldListPresentation
