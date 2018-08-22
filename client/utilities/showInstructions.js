export const showInstructions = isPaused => {
  const blocker = document.getElementById('blocker')
  blocker.style.visibility = 'visible'
  if (isPaused) {
    blocker.style.display = 'block'
    blocker.style.zIndex = '99'
    console.log('blocker', blocker.style.display)
  } else {
    blocker.style.display = 'none'
    blocker.style.zIndex = ''
    console.log('blocker', blocker.style.display)
  }
}
