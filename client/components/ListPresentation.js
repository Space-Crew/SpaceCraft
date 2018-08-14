import React from 'react'

const ListPresentation = ({items, handleClick}) => {
  return (
    <ul>
      {items.map(item => {
        return (
          <li key={item.id} onClick={() => handleClick(item.id)}>
            {item.name}
          </li>
        )
      })}
    </ul>
  )
}

export default ListPresentation
