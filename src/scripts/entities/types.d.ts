interface SerializableObject<T> {
  toJSON: () => T
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
