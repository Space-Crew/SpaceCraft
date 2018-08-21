export function darken(color, percent) {
  let t = percent < 0 ? 0 : 255,
    p = percent < 0 ? percent * -1 : percent,
    R = color >> 16,
    G = (color >> 8) & 0x00ff,
    B = color & 0x0000ff
  return (
    0x1000000 +
    (Math.round((t - R) * p) + R) * 0x10000 +
    (Math.round((t - G) * p) + G) * 0x100 +
    (Math.round((t - B) * p) + B)
  )
}
