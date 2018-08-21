import {word1, word2} from './'

function capFirst(string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min
}

export function generateGuestName() {
  const name =
    capFirst(word1[getRandomInt(0, word1.length + 1)]) +
    ' ' +
    capFirst(word2[getRandomInt(0, word2.length + 1)])
  return name
}

/* random name generator credit:  
https://gist.github.com/tkon99/4c98af713acc73bed74c
*/
