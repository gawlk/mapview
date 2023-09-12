import { Dialog, Label, Td, Tr } from '/src/components'

import { SortableList } from '.'

export const SortableListStory = () => {
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
      <div class="mb-10 overflow-x-auto">
        <div class="flex h-32 space-x-2 overflow-y-auto">
          <SortableList
            orientation="both"
            list={list}
            itemToId={(item) => String(item)}
            onChange={(from, to) =>
              batch(() => list.splice(to, 0, list.splice(from, 1)[0]))
            }
            draggedClasses={['!bg-black text-purple-500']}
            component={(ref, value, index) => (
              <div
                ref={ref}
                class="inline-block h-64 w-32 shrink-0 bg-purple-300 p-4"
              >
                Hey {value} {index()}
              </div>
            )}
          />
        </div>
      </div>
      <div class="mb-10 overflow-x-auto">
        <div class="flex h-32 space-x-2 overflow-y-auto">
          <SortableList
            orientation="horizontal"
            list={list}
            itemToId={(item) => String(item)}
            onChange={(from, to) =>
              batch(() => list.splice(to, 0, list.splice(from, 1)[0]))
            }
            draggedClasses={['!bg-black text-blue-500']}
            component={(ref, value, index) => (
              <div
                ref={ref}
                class="inline-block h-64 w-32 shrink-0 bg-blue-300 p-4"
              >
                Hey {value} {index()}
              </div>
            )}
          />
        </div>
      </div>
      <div class="flex flex-col space-y-4">
        <SortableList
          orientation="vertical"
          list={list}
          itemToId={(item) => String(item)}
          onChange={(from, to) =>
            batch(() => list.splice(to, 0, list.splice(from, 1)[0]))
          }
          draggedClasses={['!bg-black text-pink-500']}
          component={(ref, value, index) => (
            <div ref={ref} class="inline-flex bg-pink-300 p-4">
              Hey {value} {index()}
            </div>
          )}
        />
      </div>
      <div class="flex flex-col space-y-4">
        <SortableList
          orientation="vertical"
          list={list}
          itemToId={(item) => String(item)}
          onChange={(from, to) =>
            batch(() => list.splice(to, 0, list.splice(from, 1)[0]))
          }
          component={(ref, value, index) => (
            <Tr ref={ref} class="bg-pink-300 p-4">
              <Td>
                Hey {value} {index()}
              </Td>
              <Td>
                Hey {value} {index()} BIS
              </Td>
            </Tr>
          )}
        />
      </div>
      <Dialog closeable title="Sortable in dialog">
        <div class="flex flex-col space-y-4">
          <SortableList
            orientation="vertical"
            list={list}
            itemToId={(item) => String(item)}
            onChange={(from, to) =>
              batch(() => list.splice(to, 0, list.splice(from, 1)[0]))
            }
            component={(ref, value, index) => (
              <Tr ref={ref} class="bg-pink-300 p-4">
                <Td>
                  Hey {value} {index()}
                </Td>
                <Td>
                  Hey {value} {index()} BIS
                </Td>
              </Tr>
            )}
          />
        </div>
      </Dialog>
    </Label>
  )
}
