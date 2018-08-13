import React from 'react'

const ListPresentation = ({items, handleClick}) => {
  return (
    <ul>
      {items.map(item => {
        return (
          <li key={item.key} onClick={() => handleClick(item.key)}>
            {item.name}
          </li>
        )
      })}
    </ul>
  )
}

export default ListPresentation
