export const convertTableElementsToStrings = (tables: HTMLDivElement) => {
  const thead = Array.from(tables?.getElementsByTagName('thead') || []).at(0)

  const tds = Array.from(thead?.getElementsByTagName('td') || [])

  const saveables = tds.map((td) => td.getAttribute('data-saveable') === 'true')

  const reduceTds = (
    total: string[],
    td: HTMLTableCellElement,
    index: number,
  ) => {
    if (saveables.at(index)) {
      total.push(td.getAttribute('data-value') || td.textContent || '')
    }
    return total
  }

  const labels = tds.reduce(reduceTds, [] as string[])

  const tbodies = Array.from(tables?.getElementsByTagName('tbody') || [])

  const trs = Array.from(
    tbodies.flatMap((tbody) =>
      Array.from(tbody.getElementsByTagName('tr') || []),
    ) || [],
  )

  const groupedTDs = trs.map((tr) =>
    Array.from(tr.getElementsByTagName('td') || []).reduce(reduceTds, []),
  )

  return [labels, ...groupedTDs]
}
