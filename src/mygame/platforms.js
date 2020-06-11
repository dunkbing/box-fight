import Obstacle from "../entities/obstacle.js";

export default function createPlatforms(){
  const plats = []
  plats[0] = new Obstacle(0, -10, 1920, 10, null,"#00ff0000");//top
  plats[1] = new Obstacle(-10, 0, 10, 1080, null,"#00ff0000");//left
  plats[2] = new Obstacle(1920, 0, 10, 1080, null,"#00ff0000");//right
  plats[3] = new Obstacle(0, 545, 1097, 10, null,"#00ff0000");//bottom
  plats[4] = new Obstacle(82, 453, 69, 97, null,"#00ff0000");//barrel
  plats[5] = new Obstacle(610, 467, 76, 80, null,"#00ff0000");//crate
  plats[6] = new Obstacle(109, 141, 170, 30, null,"#2e3131");
  plats[7] = new Obstacle(400, 145, 150, 30, null,"#2e3131");
  plats[8] = new Obstacle(700, 145, 150, 30, null,"#2e3131");
  plats[9] = new Obstacle(220, 320, 150, 30, null,"#2e3131");
  plats[10] = new Obstacle(750, 320, 250, 30, null,"#2e3131");
  return plats;
}