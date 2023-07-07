import { CollisionDetector, Droppable } from '@thisbeyond/solid-dnd'

import { distanceBetweenPoints } from './distance'

export const createColliderCenter =
  (scrolledX: number, scrolledY: number): CollisionDetector =>
  (draggable, droppables, context) => {
    const draggableCenter = draggable.transformed.center

    const collision = {
      distance: Infinity,
      droppable: null as Droppable | null,
    }

    droppables.forEach((droppable) => {
      const distance = distanceBetweenPoints(draggableCenter, {
        x: droppable.layout.center.x - scrolledX,
        y: droppable.layout.center.y - scrolledY,
      })

      if (distance < collision.distance) {
        collision.distance = distance
        collision.droppable = droppable
      } else if (
        distance === collision.distance &&
        droppable.id === context.activeDroppableId
      ) {
        collision.droppable = droppable
      }
    })

    return collision.droppable
  }
