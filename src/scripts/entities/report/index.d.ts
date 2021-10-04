/// <reference path="./base/index.d.ts" />
/// <reference path="./heavydyn/index.d.ts" />
/// <reference path="./maxidyn/index.d.ts" />
/// <reference path="./base/index.d.ts" />
/// <reference path="./heavydyn/index.d.ts" />
/// <reference path="./maxidyn/index.d.ts" />
/// <reference path="./minidyn/index.d.ts" />

type MachineReport = HeavydynReport | MaxidynReport | MinidynReport

type PartialMachineReport<MachineReport> = PartialExtendedObject<
  BaseReport,
  MachineReport
>
