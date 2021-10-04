/// <reference path="./computedData/index.d.ts" />
/// <reference path="./drop/index.d.ts" />
/// <reference path="./field/index.d.ts" />
/// <reference path="./icon/index.d.ts" />
/// <reference path="./image/index.d.ts" />
/// <reference path="./line/index.d.ts" />
/// <reference path="./mathUnit/index.d.ts" />
/// <reference path="./mathNumber/index.d.ts" />
/// <reference path="./point/index.d.ts" />
/// <reference path="./project/index.d.ts" />
/// <reference path="./report/index.d.ts" />
/// <reference path="./threshold/index.d.ts" />
/// <reference path="./watcherHandler/index.d.ts" />

type PartialExtendedObject<BaseObject, MachineObject> = Required<BaseObject> &
  Partial<Omit<MachineObject, keyof BaseObject>>
