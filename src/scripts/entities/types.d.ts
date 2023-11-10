interface SerializableObject<T> {
  readonly toJSON: () => T
}

interface MachineObject<M extends MachineName, T>
  extends SerializableObject<T> {
  readonly machine: M
}

interface HeavydynObject<T> extends MachineObject<'Heavydyn', T> {}

interface MaxidynObject<T> extends MachineObject<'Maxidyn', T> {}

interface MinidynObject<T> extends MachineObject<'Minidyn', T> {}

interface BaseObject<T> {
  readonly toBaseJSON: () => T
}

type EntityName = 'Project' | 'Report'

interface Entity<T extends EntityName> {
  readonly kind: T
}

interface DisposableObject {
  owner: Owner | null
  dispose: VoidFunction
}

interface OnMapObject {
  addToMap: VoidFunction
  removeFromMap: VoidFunction
}
