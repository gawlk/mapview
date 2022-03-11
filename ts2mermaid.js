"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
exports.__esModule = true;
var ts = require("typescript");
var fs = require("fs");
var path = require("path");
var child_process_1 = require("child_process");
var kindEnum = ts.SyntaxKind;
var getTypesFromFilePath = function (filePath, configuration) {
    var sourceFile = ts.createSourceFile('', fs.readFileSync(filePath, 'utf8'), ts.ScriptTarget.ESNext);
    var types = [];
    var getTypescriptType = function (node) {
        return node
            .getText(sourceFile)
            .replace(/,\n/g, ', \n')
            .replace(/\n */g, '')
            .replace(/{/g, '#123; ')
            .replace(/}/g, ' #125;');
    };
    var getDependencies = function (obj) {
        var dependencies = [];
        if (obj.kind !== kindEnum.FunctionType) {
            if (Array.isArray(obj)) {
                obj.forEach(function (childObj) {
                    return dependencies.push.apply(dependencies, getDependencies(childObj));
                });
            }
            else if (typeof obj === 'object') {
                Object.entries(obj).map(function (_a) {
                    var key = _a[0], value = _a[1];
                    if (key === 'escapedText') {
                        dependencies.push(value);
                    }
                    else if (key !== 'name' && typeof value === 'object') {
                        dependencies.push.apply(dependencies, getDependencies(value));
                    }
                });
            }
        }
        return obj.kind === kindEnum.QualifiedName
            ? [dependencies.join('.')]
            : dependencies;
    };
    var removeDuplicatesFromArray = function (arr) { return Array.from(new Set(arr)); };
    sourceFile.forEachChild(function (childNode) {
        var _a, _b;
        var kind = childNode.kind;
        if (kind !== kindEnum.EndOfFileToken) {
            var name_1 = childNode.name.escapedText;
            if ((!(configuration === null || configuration === void 0 ? void 0 : configuration.include) && !(configuration === null || configuration === void 0 ? void 0 : configuration.exclude)) ||
                ((configuration === null || configuration === void 0 ? void 0 : configuration.include) &&
                    ((_a = configuration === null || configuration === void 0 ? void 0 : configuration.include) === null || _a === void 0 ? void 0 : _a.map(function (regex) { return !!name_1.match(regex); }).includes(true))) ||
                ((configuration === null || configuration === void 0 ? void 0 : configuration.exclude) &&
                    !((_b = configuration === null || configuration === void 0 ? void 0 : configuration.exclude) === null || _b === void 0 ? void 0 : _b.map(function (regex) { return !!name_1.match(regex); }).includes(true)))) {
                var type_1 = {};
                type_1.name = name_1;
                switch (kind) {
                    case kindEnum.InterfaceDeclaration:
                        if (!(configuration === null || configuration === void 0 ? void 0 : configuration.hideInterfaces)) {
                            type_1.value = {};
                            type_1.dependencies = [];
                            childNode.members.forEach(function (childNode) {
                                var childNodeType = childNode.type;
                                var childNodeName = childNode.kind === kindEnum.PropertySignature
                                    ? "".concat(childNode.name.escapedText).concat(childNode.questionToken ? '?' : '')
                                    : kindEnum.IndexSignature
                                        ? "[".concat(childNode.parameters
                                            .map(function (parameter) {
                                            return parameter.getText(sourceFile);
                                        })
                                            .join(', '), "]")
                                        : '';
                                type_1.value[childNodeName] = getTypescriptType(childNodeType);
                                type_1.dependencies = __spreadArray(__spreadArray([], type_1.dependencies, true), getDependencies(childNodeType), true);
                            });
                            type_1.dependencies = removeDuplicatesFromArray(type_1.dependencies);
                            types.push(type_1);
                        }
                        break;
                    default:
                        if (!(configuration === null || configuration === void 0 ? void 0 : configuration.hideTypes)) {
                            var childNodeType = childNode.type;
                            type_1.value = getTypescriptType(childNodeType);
                            type_1.dependencies = getDependencies(childNodeType);
                            type_1.dependencies = removeDuplicatesFromArray(type_1.dependencies);
                            types.push(type_1);
                        }
                }
            }
        }
    });
    return types;
};
var getTypesFromDirectoryPath = function (pathToScan, configuration) {
    var types = [];
    if (fs.lstatSync(pathToScan).isDirectory()) {
        fs.readdirSync(pathToScan).map(function (fileName) {
            var filePath = path.join(pathToScan, fileName);
            if (fs.lstatSync(filePath).isDirectory()) {
                types.push.apply(types, getTypesFromDirectoryPath(filePath, configuration));
            }
            else if (filePath.endsWith('types.d.ts')) {
                types.push.apply(types, getTypesFromFilePath(filePath, configuration));
            }
        });
    }
    else {
        types.push.apply(types, getTypesFromFilePath(pathToScan, configuration));
    }
    return types;
};
var convertJSONTypesToMermaidTypes = function (types) { return "classDiagram\n".concat(types
    .map(function (type) {
    if (typeof type.value === 'object') {
        return "class ".concat(type.name, " {\n  <<interface>>\n").concat(Object.entries(type.value)
            .map(function (_a) {
            var attribute = _a[0], typescriptType = _a[1];
            return "  ".concat(attribute, " ").concat(typescriptType);
        })
            .join('\n'), "\n}\n").concat(convertDependenciesToMermaid(types, type), "\n");
    }
    else {
        return "class ".concat(type.name, " {\n  <<type>>\n  ").concat(type.value, "\n}\n").concat(convertDependenciesToMermaid(types, type), "\n");
    }
})
    .join('\n'), "\n"); };
var convertDependenciesToMermaid = function (types, type) {
    return type.dependencies
        .map(function (dependency) { return types.find(function (type) { return type.name === dependency; }); })
        .filter(function (dependencyType) { return dependencyType; })
        .map(function (dependencyType) {
        var linkStart = '-';
        if (dependencyType.dependencies.includes(type.name)) {
            linkStart = '<';
            dependencyType === null || dependencyType === void 0 ? void 0 : dependencyType.dependencies.splice(dependencyType === null || dependencyType === void 0 ? void 0 : dependencyType.dependencies.indexOf(type.name), 1);
        }
        return "".concat(type.name, " ").concat(linkStart, "-> ").concat(dependencyType.name);
    })
        .join('\n');
};
var execMermaid = function (pathToMMD, pathToSvg) {
    return (0, child_process_1.exec)("npx -p @mermaid-js/mermaid-cli mmdc -i ".concat(pathToMMD, " -o ").concat(pathToSvg), function (err) { return err && console.error("exec error: ".concat(err)); });
};
var processConfiguration = function (pathToScan, pathToSave, fileName, configuration) {
    if (!fs.existsSync(pathToSave)) {
        fs.mkdirSync(pathToSave, { recursive: true });
    }
    var types = getTypesFromDirectoryPath(pathToScan, configuration);
    fs.writeFileSync("".concat(pathToSave, "/").concat(fileName, ".json"), JSON.stringify(types, null, 2));
    var pathToMMD = "".concat(pathToSave, "/").concat(fileName, ".mmd");
    fs.writeFileSync(pathToMMD, convertJSONTypesToMermaidTypes(types));
    execMermaid(pathToMMD, "".concat(pathToSave, "/").concat(fileName, ".svg"));
    fs.writeFileSync("".concat(pathToSave, "/").concat(fileName, ".md"), "![diagram](./".concat(fileName, ".svg)"));
};
var main = function (parameters) { return __awaiter(void 0, void 0, void 0, function () {
    var pathToScan, pathToSave;
    var _a;
    return __generator(this, function (_b) {
        pathToScan = path.join(__dirname, (parameters === null || parameters === void 0 ? void 0 : parameters.pathToScan) || 'src');
        pathToSave = path.join(__dirname, (parameters === null || parameters === void 0 ? void 0 : parameters.pathToSave) || 'mermaid');
        fs.rmSync("".concat(pathToSave, "/types.md"));
        Array.isArray(parameters === null || parameters === void 0 ? void 0 : parameters.configuration)
            ? parameters === null || parameters === void 0 ? void 0 : parameters.configuration.forEach(function (configuration, index) {
                processConfiguration(pathToScan, path.join(pathToSave, configuration.name || String(index + 1)), 'types', configuration);
                fs.appendFileSync("".concat(pathToSave, "/types.md"), "# ".concat(configuration.name, "\n\n![").concat(configuration.name, "](./").concat(configuration.name, "/types.svg)\n\n"));
            })
            : processConfiguration(pathToScan, pathToSave, ((_a = parameters === null || parameters === void 0 ? void 0 : parameters.configuration) === null || _a === void 0 ? void 0 : _a.name) || 'types', parameters === null || parameters === void 0 ? void 0 : parameters.configuration);
        return [2 /*return*/];
    });
}); };
main({
    configuration: [
        {
            name: 'all'
        },
        {
            name: 'allInterfaces',
            hideTypes: true
        },
        {
            name: 'allTypes',
            hideInterfaces: true
        },
        {
            name: 'onlyHeavydyn',
            include: [/[H|h]eavydyn/]
        },
        {
            name: 'onlyMaxidyn',
            include: [/[M|m]axidyn/]
        },
        {
            name: 'onlyMinidyn',
            include: [/[M|m]inidyn/]
        },
        {
            name: 'onlyMachines',
            include: [/[H|h]eavydyn/, /[M|m]axidyn/, /[M|m]inidyn/, /[M|m]achine/]
        },
        {
            name: 'exceptMachines',
            exclude: [/[H|h]eavydyn/, /[M|m]axidyn/, /[M|m]inidyn/, /[M|m]achine/]
        },
    ]
});
