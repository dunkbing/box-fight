function distance(vect1, vect2){
  return Math.sqrt((vect1.x-vect2.x)**2+(vect1.y-vect2.y)**2)
}

function normalizeVect(vect, distance){
  return {x: vect.x/distance, y: vect.y/distance}
}

export {distance, normalizeVect}