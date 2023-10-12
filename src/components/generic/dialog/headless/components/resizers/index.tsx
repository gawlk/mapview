/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable no-nested-ternary */
import { makeEventListener } from '@solid-primitives/event-listener'
import { useMousePosition } from '@solid-primitives/mouse'
import { useWindowSize } from '@solid-primitives/resize-observer'

import { createASS } from '/src/scripts'

import { activateUserSelectNone, deactivateUserSelectNone } from '../../scripts'
import { computeDirection, expand, resizeDialog } from './scripts'

interface Props {
  dialog: Accessor<HTMLDialogElement | undefined>
  dimensions: DialogDimensions
  position: DialogPosition
}

export const DialogResizers = (props: Props) => {
  const state = {
    resizeDirection: createASS<DialogResizeDirection | null>(null),
  }

  const mousePosition = useMousePosition()

  makeEventListener(window, 'mouseup', () => state.resizeDirection.set(null), {
    passive: true,
  })

  createEffect(
    on(
      () => state.resizeDirection(),
      (resizeDirection) => {
        if (resizeDirection) {
          activateUserSelectNone(props.dialog())

          resizeDialog(
            props.dialog(),
            mousePosition,
            resizeDirection,
            props.dimensions,
            props.position,
          )
        } else {
          deactivateUserSelectNone(props.dialog())
        }
      },
    ),
  )

  const runExpand = (resizeDirection: DialogResizeDirection) =>
    expand(props.dialog(), resizeDirection, props.dimensions, props.position)

  const Resizer = (resizerProps: {
    staticDirection: DialogResizeDirection
  }) => {
    const direction = resizerProps.staticDirection

    const {
      isAnyNorth,
      isAnySouth,
      isAnyWest,
      isAnyEast,
      isBidirectional,
      isHorizontalOnly,
      isVerticalOnly,
    } = computeDirection(direction)

    const zero = '0px'
    const marginSm = '-0.375rem'
    const marginMd = '-0.5rem'
    const full = '100%'
    const small = '0.75rem'
    const big = '1.5rem'

    const marginX = isHorizontalOnly
      ? marginSm
      : isBidirectional
      ? marginMd
      : undefined
    const marginY = isVerticalOnly
      ? marginSm
      : isBidirectional
      ? marginMd
      : undefined

    const windowSize = useWindowSize()

    return (
      <Show when={windowSize.width >= 768}>
        <div
          onMouseDown={() => state.resizeDirection.set(direction)}
          onDblClick={() => runExpand(direction)}
          style={{
            position: 'absolute',

            top: isHorizontalOnly || isAnyNorth ? zero : undefined,
            bottom: isHorizontalOnly || isAnySouth ? zero : undefined,
            left: isVerticalOnly || isAnyWest ? zero : undefined,
            right: isVerticalOnly || isAnyEast ? zero : undefined,

            'margin-top': marginY,
            'margin-bottom': marginY,
            'margin-left': marginX,
            'margin-right': marginX,

            height: isBidirectional
              ? big
              : isHorizontalOnly
              ? full
              : isVerticalOnly
              ? small
              : undefined,
            width: isBidirectional
              ? big
              : isVerticalOnly
              ? full
              : isHorizontalOnly
              ? small
              : undefined,

            cursor: isVerticalOnly
              ? 'ns-resize'
              : isHorizontalOnly
              ? 'ew-resize'
              : direction === 'nw' || direction === 'se'
              ? 'nwse-resize'
              : 'nesw-resize',
          }}
        />
      </Show>
    )
  }

  return (
    <>
      <Resizer staticDirection="n" />
      <Resizer staticDirection="s" />
      <Resizer staticDirection="e" />
      <Resizer staticDirection="w" />
      <Resizer staticDirection="nw" />
      <Resizer staticDirection="sw" />
      <Resizer staticDirection="se" />
      <Resizer staticDirection="ne" />
    </>
  )
}
