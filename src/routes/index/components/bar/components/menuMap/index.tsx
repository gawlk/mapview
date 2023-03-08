// import GroupImages from './components/groupImages'
import ButtonLineVisibility from './components/buttonLineVisibility'
import ButtonMarkersMoveability from './components/buttonMarkersMoveability'
import ButtonMarkersVisibility from './components/buttonMarkersVisibility'
import SelectMarkersContent from './components/selectMarkersContent'

// import ListboxMapStyles from './components/listboxMapStyles'

interface Props {
  readonly menu: MenuProps
}

export default () => {
  return (
    <>
      {/* <ListboxMapStyles /> */}
      {/* <GroupImages /> */}
      <div class="flex space-x-2">
        <SelectMarkersContent />
        <ButtonMarkersVisibility />
        <ButtonLineVisibility />
        <ButtonMarkersMoveability />
      </div>
    </>
  )
}
