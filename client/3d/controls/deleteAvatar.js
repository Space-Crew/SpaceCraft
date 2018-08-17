export const deleteAvatar = (scene, avatarGroup) => {
  for (let i = 0; i < avatarGroup.children.length; i++) {
    let bodyPart = avatarGroup.children[i]
    avatarGroup.remove(bodyPart)
    scene.remove(bodyPart)
    bodyPart.geometry.dispose()
    bodyPart.material.dispose()
    bodyPart = undefined
  }
  scene.remove(avatarGroup)
}
