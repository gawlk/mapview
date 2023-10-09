export const computeDirection = (direction: DialogResizeDirection) => ({
  isAnyNorth: direction.includes('n'),
  isAnySouth: direction.includes('s'),
  isAnyWest: direction.includes('w'),
  isAnyEast: direction.includes('e'),
  isBidirectional: direction.length > 1,
  isHorizontalOnly: direction === 'w' || direction === 'e',
  isVerticalOnly: direction === 'n' || direction === 's',
})
