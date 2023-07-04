import { Dialog, Label, Td, Tr, classPropToString } from '/src/components'

import { SortableList } from '.'

export default () => {
  const list = createMutable([
    'a',
    'b',
    'c',
    'd',
    'e',
    'f',
    'g',
    'h',
    'i',
    'j',
    'k',
    'l',
    'm',
    'n',
    'o',
    'p',
  ])

  return (
    <Label label="Sortable list">
      {/* <Dialog title="In dialog">
        <div class="flex flex-col space-y-4">
          <SortableList
            list={list}
            itemToId={(item) => String(item)}
            onChange={(from, to) =>
              batch(() => list.splice(to, 0, list.splice(from, 1)[0]))
            }
            draggedClasses={['!bg-black text-pink-500']}
            component={(ref, dragActivators, value, index, classes) => (
              <div
                ref={ref}
                {...dragActivators}
                class={classPropToString([
                  classes(),
                  'inline-flex bg-pink-300 p-4',
                ])}
              >
                Hey {value} {index()}
              </div>
            )}
          />
        </div>
      </Dialog> */}
      <div class="flex flex-col space-y-4">
        <SortableList
          list={list}
          itemToId={(item) => String(item)}
          onChange={(from, to) =>
            batch(() => list.splice(to, 0, list.splice(from, 1)[0]))
          }
          component={(
            ref,
            dragActivators,
            transformStyle,
            value,
            index,
            classes
          ) => {
            createEffect(() => {
              console.log('drag', dragActivators)
            })

            return (
              <Tr
                ref={ref}
                {...dragActivators}
                style={transformStyle()}
                class={classPropToString([classes(), 'bg-pink-300 p-4'])}
              >
                <Td>
                  {/* <div> */}
                  Hey {value} {index()}
                  {/* </div> */}
                </Td>
                <Td>
                  Hey {value} {index()} BIS
                </Td>
              </Tr>
            )
          }}
        />
      </div>
    </Label>
  )
}
