type PartialExtendedObject<BaseObject, MachineObject> = Required<BaseObject> &
  Partial<Omit<MachineObject, keyof BaseObject>>
