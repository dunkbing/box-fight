import Obstacle from "../entities/obstacle.js";

export default function createPlatforms(){
  const plats = []
  plats[0] = new Obstacle(0, 400, 300, 20);
  plats[1] = new Obstacle(100, 300, 150, 10);
  plats[2] = new Obstacle(120, 50, 20, 10);
  plats[3] = new Obstacle(140, 30, 20, 10);
  plats[4] = new Obstacle(150, 100, 100, 20);
  plats[5] = new Obstacle(100, 80, 100, 20);
  plats[6] = new Obstacle(200, 60, 100, 20);
  plats[7] = new Obstacle(0, -10, 1920, 10);//top
  plats[8] = new Obstacle(-10, 0, 10, 1080);//left
  plats[9] = new Obstacle(1920, 0, 10, 1080);//right
  plats[10] = new Obstacle(0, 1080, 1920, 10);//bottom
  return plats;
}