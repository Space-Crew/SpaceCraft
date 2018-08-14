import React from 'react'
import {Link} from 'react-router-dom'
const ListPresentation = ({items, linkPath}) => {
  return (
    <ul>
      {items.map(item => {
        return (
          <Link key={item.id} to={linkPath.concat(item.id)}>
            <li>{item.name}</li>
          </Link>
        )
      })}
    </ul>
  )
}

export default ListPresentation
