import React from 'react'
import {Message} from 'semantic-ui-react'

const Instructions = () => {
  return (
    <Message
      style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: `translate("-50%", "-50%")`
      }}
    >
      Click to play <br />W,A,S,D,Q,E: Move, MOUSE: Look around <br />SHIFT +
      CLICK: Add cube, CMD + CLICK: Remove cube, CLICK + MOVE MOUSE: Drag cube
    </Message>
  )
}

export default Instructions
