"use strict";
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
var kindEnum = ts.SyntaxKind;
var getTypesFromDirectoryPath = function (directoryPath) {
    var types = [];
    fs.readdirSync(directoryPath).map(function (fileName) {
        var filePath = path.join(directoryPath, fileName);
        if (fs.lstatSync(filePath).isDirectory()) {
            types.push.apply(types, getTypesFromDirectoryPath(filePath));
        }
        else if (filePath.endsWith('types.d.ts')) {
            types.push.apply(types, getTypesFromFilePath(filePath));
        }
    });
    return types;
};
var getTypesFromFilePath = function (filePath) {
    var sourceFile = ts.createSourceFile('', fs.readFileSync(filePath, 'utf8'), ts.ScriptTarget.ESNext);
    var types = [];
    var getRawType = function (node) {
        return node.getText(sourceFile).replace(/,\n/g, ', \n').replace(/\n */g, '');
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
        var uniqueDependencies = Array.from(new Set(dependencies));
        return obj.kind === kindEnum.QualifiedName
            ? [uniqueDependencies.join('.')]
            : uniqueDependencies;
    };
    sourceFile.forEachChild(function (childNode) {
        var kind = childNode.kind;
        if (kind !== kindEnum.EndOfFileToken) {
            var type_1 = {};
            var name_1 = childNode.name.escapedText;
            type_1.name = name_1;
            switch (kind) {
                case kindEnum.InterfaceDeclaration:
                    type_1.value = {};
                    type_1.dependencies = [];
                    childNode.members.forEach(function (childNode) {
                        var childNodeType = childNode.type;
                        var childNodeName = childNode.kind === kindEnum.PropertySignature
                            ? "".concat(childNode.name.escapedText).concat(childNode.questionToken ? '?' : '')
                            : kindEnum.IndexSignature
                                ? "[".concat(childNode.parameters
                                    .map(function (parameter) { return parameter.getText(sourceFile); })
                                    .join(', '), "]")
                                : '';
                        type_1.value[childNodeName] = getRawType(childNodeType);
                        type_1.dependencies = __spreadArray(__spreadArray([], type_1.dependencies, true), getDependencies(childNodeType), true);
                    });
                    break;
                default:
                    var childNodeType = childNode.type;
                    // console.log(childNodeType)
                    type_1.value = getRawType(childNodeType);
                    type_1.dependencies = getDependencies(childNodeType);
            }
            types.push(type_1);
        }
    });
    return types;
};
var baseUrl = path.join(__dirname, './src');
// const baseUrl = './src'
var convertJSONTypesToMermaid = function (types) {
    console.log(types);
    return "\n```mermaid\nclassDiagram\n".concat(types
        .map(function (type) {
        if (typeof type.value === 'object') {
            return "class ".concat(type.name, " {\n  <<interface>>\n").concat(Object.entries(type.value)
                .map(function (_a) {
                var attribute = _a[0], attributeType = _a[1];
                return "  ".concat(attribute, " ").concat(formatTypesType(attributeType));
            })
                .join('\n'), "\n}\n").concat(convertDependenciesToMermaid(type), "\n");
        }
        else {
            return "class ".concat(type.name, " {\n  <<type>>\n  ").concat(formatTypesType(type.value), "\n}\n").concat(convertDependenciesToMermaid(type), "\n");
        }
    })
        .join('\n'), "\n```\n");
};
var formatTypesType = function (type) {
    return type.replace(/{/g, '#123; ').replace(/}/g, ' #125;');
};
var convertDependenciesToMermaid = function (type) {
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
var types = getTypesFromDirectoryPath(baseUrl);
fs.writeFileSync('./MERMAID.md', convertJSONTypesToMermaid(types));
