import { Dialog, Label, StoryDialogSelect } from '/src/components'

export default () => {
  return (
    <Label label="Dialog">
      <Dialog
        closeable
        maximizable
        button={{
          text: 'Base',
        }}
        title="Title"
      >
        <Dialog closeable title="Open moveable child dialog" moveable>
          Moveable dialog
        </Dialog>
        <p>Normal dialog</p>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Proin
          libero nunc consequat interdum varius sit amet mattis. Purus in massa
          tempor nec feugiat. Posuere urna nec tincidunt praesent semper.
          Adipiscing tristique risus nec feugiat in fermentum posuere urna. Ut
          tortor pretium viverra suspendisse potenti nullam ac tortor. Eu mi
          bibendum neque egestas congue. Ac turpis egestas integer eget. Augue
          lacus viverra vitae congue eu consequat ac felis. Nulla facilisi
          nullam vehicula ipsum a arcu cursus vitae. Aliquam vestibulum morbi
          blandit cursus risus at. Fermentum dui faucibus in ornare quam viverra
          orci. Iaculis eu non diam phasellus vestibulum lorem sed risus.
          Malesuada fames ac turpis egestas sed. Sollicitudin ac orci phasellus
          egestas tellus rutrum. Vel pharetra vel turpis nunc eget lorem. Amet
          consectetur adipiscing elit pellentesque habitant morbi tristique
          senectus et. Aliquam ultrices sagittis orci a scelerisque. Sed turpis
          tincidunt id aliquet risus. Turpis egestas maecenas pharetra convallis
          posuere morbi leo urna.
        </p>
        <p>
          Semper eget duis at tellus at urna condimentum mattis pellentesque.
          Sagittis id consectetur purus ut faucibus. Est ante in nibh mauris
          cursus mattis. Pellentesque elit eget gravida cum sociis. Dui ut
          ornare lectus sit amet. Nunc eget lorem dolor sed viverra ipsum nunc.
          At lectus urna duis convallis. Erat pellentesque adipiscing commodo
          elit at imperdiet dui accumsan. Orci ac auctor augue mauris augue.
          Eleifend donec pretium vulputate sapien nec sagittis aliquam. At
          elementum eu facilisis sed. Vestibulum sed arcu non odio euismod
          lacinia at. Id donec ultrices tincidunt arcu non sodales neque sodales
          ut.
        </p>
      </Dialog>
      <Dialog closeable title="Moveable" moveable>
        Moveable dialog
      </Dialog>
      <Dialog closeable title="Resizable" resizable>
        Resizable dialog
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Proin
          libero nunc consequat interdum varius sit amet mattis. Purus in massa
          tempor nec feugiat. Posuere urna nec tincidunt praesent semper.
          Adipiscing tristique risus nec feugiat in fermentum posuere urna. Ut
          tortor pretium viverra suspendisse potenti nullam ac tortor. Eu mi
          bibendum neque egestas congue. Ac turpis egestas integer eget. Augue
          lacus viverra vitae congue eu consequat ac felis. Nulla facilisi
          nullam vehicula ipsum a arcu cursus vitae. Aliquam vestibulum morbi
          blandit cursus risus at. Fermentum dui faucibus in ornare quam viverra
          orci. Iaculis eu non diam phasellus vestibulum lorem sed risus.
          Malesuada fames ac turpis egestas sed. Sollicitudin ac orci phasellus
          egestas tellus rutrum. Vel pharetra vel turpis nunc eget lorem. Amet
          consectetur adipiscing elit pellentesque habitant morbi tristique
          senectus et. Aliquam ultrices sagittis orci a scelerisque. Sed turpis
          tincidunt id aliquet risus. Turpis egestas maecenas pharetra convallis
          posuere morbi leo urna.
        </p>
        <p>
          Semper eget duis at tellus at urna condimentum mattis pellentesque.
          Sagittis id consectetur purus ut faucibus. Est ante in nibh mauris
          cursus mattis. Pellentesque elit eget gravida cum sociis. Dui ut
          ornare lectus sit amet. Nunc eget lorem dolor sed viverra ipsum nunc.
          At lectus urna duis convallis. Erat pellentesque adipiscing commodo
          elit at imperdiet dui accumsan. Orci ac auctor augue mauris augue.
          Eleifend donec pretium vulputate sapien nec sagittis aliquam. At
          elementum eu facilisis sed. Vestibulum sed arcu non odio euismod
          lacinia at. Id donec ultrices tincidunt arcu non sodales neque sodales
          ut.
        </p>
      </Dialog>
      <Dialog closeable title="Moveable + Resizable 1" moveable resizable>
        Moveable + Resizable dialog
        <Dialog closeable title="Moveable + Resizable 2" moveable resizable>
          Moveable + Resizable dialog
          <Dialog closeable title="Moveable + Resizable 3" moveable resizable>
            Moveable + Resizable dialog
            <Dialog closeable title="Moveable + Resizable 4" moveable resizable>
              Moveable + Resizable dialog
            </Dialog>
            <StoryDialogSelect />
          </Dialog>
          <Dialog closeable title="Moveable + Resizable 5" moveable resizable>
            Moveable + Resizable dialog
            <Dialog closeable title="Moveable + Resizable 6" moveable resizable>
              Moveable + Resizable dialog
            </Dialog>
            <StoryDialogSelect />
          </Dialog>
        </Dialog>
        <StoryDialogSelect />
      </Dialog>
    </Label>
  )
}
