import Matter from 'matter-js';

export const setupCollisionEvents = (engine, onFinish) => {
  Matter.Events.on(engine, 'collisionStart', (event) => {
    event.pairs.forEach(({ bodyA, bodyB }) => {
      if (bodyA.label === 'exit') {
        onFinish(bodyB.label);
      } else if (bodyB.label === 'exit') {
        onFinish(bodyA.label);
      }
    });
  });
};
