import {
  Button,
  Dialog,
  dialogDateBooleanPropsKeysObject,
  DialogSelect,
  removeProps,
} from '/src/components'
import {
  addLocationToID,
  createASS,
  getMonths,
  getWeekDayFromDate,
  getWeekDays,
  localStorageSetItem,
} from '/src/scripts'

export interface DialogDatePropsWithHTMLAttributes
  extends MergePropsWithHTMLProps<DialogDateProps, DialogHTMLAttributes> {}

export const DialogDate = (props: DialogDatePropsWithHTMLAttributes) => {
  const state = {
    year: createASS(0),
    month: createASS(0),
    weeks: createASS<Date[][]>([], {
      equals: false,
    }),
  }

  let id: string | undefined

  if (props.id) {
    id = addLocationToID(props.id)

    if (props.saveable) {
      const saved = localStorage.getItem(id)

      saved && props.onClose?.(saved)
    }
  }

  const weekDays = getWeekDays()
  const months = getMonths()

  const setWeeks = (year: number, month: number) => {
    const firstDate = new Date(Date.UTC(year, month))

    let date = new Date(firstDate)
    let dates: Date[] = []

    do {
      dates = [new Date(date), ...dates]
      date.setUTCDate(date.getUTCDate() - 1)
    } while (getWeekDayFromDate(date) !== weekDays.at(-1))

    dates.pop()

    date = new Date(firstDate)

    do {
      dates.push(new Date(date))
      date.setUTCDate(date.getUTCDate() + 1)
    } while (
      date.getUTCMonth() === state.month() ||
      getWeekDayFromDate(date) !== weekDays[0]
    )

    const weeks: Date[][] = []
    while (dates.length) {
      weeks.push(dates.splice(0, 7))
    }

    state.weeks.set(weeks)
  }

  const isMaxYear = createMemo(
    () => props.max && state.year() >= props.max.getUTCFullYear(),
  )

  const isMaxMonth = createMemo(
    () => isMaxYear() && props.max && state.month() >= props.max.getUTCMonth(),
  )

  const isMinYear = createMemo(
    () => props.min && state.year() <= props.min.getUTCFullYear(),
  )

  const isMinMonth = createMemo(
    () => isMinYear() && props.min && state.month() <= props.min.getUTCMonth(),
  )

  const showReset = createMemo(
    () =>
      props.reset && props.value.valueOf() !== props.reset?.default.valueOf(),
  )

  createEffect(() => {
    state.year.set(props.value.getUTCFullYear())
    state.month.set(props.value.getUTCMonth())
  })

  createEffect(() => {
    setWeeks(state.year(), state.month())
  })

  return (
    <div class="flex space-x-2">
      <Dialog
        closeable
        {...removeProps(props, dialogDateBooleanPropsKeysObject)}
        button={mergeProps(
          {
            id,
            role: 'listbox' as const,
            rightIcon: IconTablerCalendar,
            rightIconClass: '',
            text: props.value.toLocaleString(),
          } as ButtonPropsWithHTMLAttributes,
          props.button,
        )}
        onClose={(value?: string) => {
          if (props.saveable) {
            localStorageSetItem(
              id,
              value && value !== props.reset?.default.toJSON()
                ? value
                : undefined,
            )
          }

          props.onClose?.(value)
        }}
        form={
          <table class="w-full table-fixed border-separate border-spacing-0.5">
            <thead>
              <tr>
                <For each={weekDays}>
                  {(weekDay) => (
                    <th class="w-6 p-2.5 text-white/50">
                      <span class="md:hidden">{weekDay[0]}</span>
                      <span class="hidden md:inline">
                        {weekDay.slice(0, 3)}
                      </span>
                    </th>
                  )}
                </For>
              </tr>
            </thead>
            <tbody>
              <For each={state.weeks()}>
                {(week) => (
                  <tr>
                    <For each={week}>
                      {(date) => {
                        const isValue = createMemo(
                          () => props.value.valueOf() === date.valueOf(),
                        )

                        return (
                          <td>
                            <div class="flex items-center justify-center">
                              <Button
                                color={isValue() ? 'primary' : 'base'}
                                value={date.toJSON()}
                                orientation="none"
                                disabled={
                                  (props.max && date > props.max) ||
                                  (props.min && date < props.min)
                                }
                              >
                                <span
                                  class={[
                                    !isValue() &&
                                    date.getUTCMonth() !== state.month()
                                      ? 'text-white/50'
                                      : '',
                                    'w-6',
                                  ].join(' ')}
                                >
                                  {date.getUTCDate()}
                                </span>
                              </Button>
                            </div>
                          </td>
                        )
                      }}
                    </For>
                  </tr>
                )}
              </For>
            </tbody>
          </table>
        }
      >
        <div class="space-y-2 px-4 sm:flex sm:space-x-16 sm:space-y-0 sm:px-6">
          <div class="flex w-full items-center space-x-2">
            <Button
              icon={IconTablerChevronLeft}
              disabled={isMinMonth()}
              onClick={(event) => {
                event?.preventDefault()

                if (!state.month()) {
                  state.year.set((year) => year - 1)
                  state.month.set(months.length - 1)
                } else {
                  state.month.set((month) => month - 1)
                }
              }}
            />
            <DialogSelect
              button={{
                center: true,
                full: true,
              }}
              values={{
                selected: String(months[state.month()]),
                list: months,
              }}
            />
            <Button
              icon={IconTablerChevronRight}
              disabled={isMaxMonth()}
              onClick={(event) => {
                event?.preventDefault()

                if (state.month() === months.length - 1) {
                  state.year.set((year) => year + 1)
                  state.month.set(0)
                } else {
                  state.month.set((month) => month + 1)
                }
              }}
            />
          </div>

          <div class="flex w-full items-center space-x-2">
            <Button
              icon={IconTablerMinus}
              disabled={isMinYear()}
              onClick={(event) => {
                event?.preventDefault()
                state.year.set((year) => year - 1)
              }}
            />
            <DialogSelect
              button={{
                center: true,
                full: true,
              }}
              values={{
                selected: String(state.year),
                list: [],
              }}
            />
            <Button
              icon={IconTablerPlus}
              disabled={isMaxYear()}
              onClick={(event) => {
                event?.preventDefault()
                state.year.set((year) => year + 1)

                if (
                  props.max &&
                  state.year() >= props.max.getUTCFullYear() &&
                  state.month() > props.max.getUTCMonth()
                ) {
                  state.month.set(props.max.getUTCMonth())
                }
              }}
            />
          </div>
        </div>
      </Dialog>
      <Show when={showReset()}>
        <Button
          icon={IconTablerArrowBack}
          onClick={() => {
            if (props.saveable) {
              localStorageSetItem(id)
            }

            props.reset?.callback()
          }}
        />
      </Show>
    </div>
  )
}
