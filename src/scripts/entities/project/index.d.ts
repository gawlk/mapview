/// <reference path="./base/index.d.ts" />
/// <reference path="./heavydyn/index.d.ts" />
/// <reference path="./maxidyn/index.d.ts" />
/// <reference path="./minidyn/index.d.ts" />

type MachineProject = HeavydynProject | MaxidynProject | MinidynProject

type PartialMachineProject<MachineProject> = PartialExtendedObject<
  BaseProject,
  MachineProject
>
