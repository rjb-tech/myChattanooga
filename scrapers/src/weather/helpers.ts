import { WindDirections } from '@prisma/client';

export function getDirection(degrees: number): WindDirections {
  const directions = Object.keys(WindDirections);
  const ix: number = Math.round(degrees / (360.0 / directions.length));
  const direction = directions[ix % directions.length];

  return direction as WindDirections;
}
