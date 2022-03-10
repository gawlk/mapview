import * as ts from 'typescript'
import * as fs from 'fs'
import * as path from 'path'

const kindEnum = ts.SyntaxKind

interface Type {
  name: string
  value: string
  dependencies: string[]
}

const getTypesFromDirectoryPath = (directoryPath: string): Type[] => {
  const types: Type[] = []
  fs.readdirSync(directoryPath).map((fileName) => {
    const filePath = path.join(directoryPath, fileName)

    if (fs.lstatSync(filePath).isDirectory()) {
      types.push(...getTypesFromDirectoryPath(filePath))
    } else if (filePath.endsWith('types.d.ts')) {
      types.push(...getTypesFromFilePath(filePath))
    }
  })

  return types
}

const getTypesFromFilePath = (filePath: string): Type[] => {
  const sourceFile = ts.createSourceFile(
    '',
    fs.readFileSync(filePath, 'utf8'),
    ts.ScriptTarget.ESNext
  )

  const types: Type[] = []

  const getRawType = (node: ts.Node) =>
    node.getText(sourceFile).replace(/,\n/g, ', \n').replace(/\n */g, '')

  const getDependencies = (obj: any) => {
    const dependencies: string[] = []

    if (obj.kind !== kindEnum.FunctionType) {
      if (Array.isArray(obj)) {
        obj.forEach((childObj) =>
          dependencies.push(...getDependencies(childObj))
        )
      } else if (typeof obj === 'object') {
        Object.entries(obj).map(([key, value]) => {
          if (key === 'escapedText') {
            dependencies.push(value as string)
          } else if (key !== 'name' && typeof value === 'object') {
            dependencies.push(...getDependencies(value))
          }
        })
      }
    }

    const uniqueDependencies = Array.from(new Set(dependencies))

    return obj.kind === kindEnum.QualifiedName
      ? [uniqueDependencies.join('.')]
      : uniqueDependencies
  }

  sourceFile.forEachChild((childNode) => {
    const kind = childNode.kind

    if (kind !== kindEnum.EndOfFileToken) {
      const type: any = {}

      const name = (childNode as any).name.escapedText as string

      type.name = name

      switch (kind) {
        case kindEnum.InterfaceDeclaration:
          type.value = {}
          type.dependencies = []
          ;(childNode as ts.InterfaceDeclaration).members.forEach(
            (childNode) => {
              const childNodeType = (childNode as any).type as ts.TypeNode

              const childNodeName =
                childNode.kind === kindEnum.PropertySignature
                  ? `${(childNode as any).name.escapedText as string}${
                      childNode.questionToken ? '?' : ''
                    }`
                  : kindEnum.IndexSignature
                  ? `[${(childNode as any).parameters
                      .map((parameter: any) => parameter.getText(sourceFile))
                      .join(', ')}]`
                  : ''

              type.value[childNodeName] = getRawType(childNodeType)

              type.dependencies = [
                ...type.dependencies,
                ...getDependencies(childNodeType),
              ]
            }
          )

          break

        default:
          const childNodeType = (childNode as any).type as ts.TypeNode

          // console.log(childNodeType)

          type.value = getRawType(childNodeType)

          type.dependencies = getDependencies(childNodeType)
      }

      types.push(type)
    }
  })

  return types
}

const baseUrl = path.join(__dirname, './src')
// const baseUrl = './src'

const convertJSONTypesToMermaid = (types: Type[]) => {
  console.log(types)
  return `
\`\`\`mermaid
classDiagram
${types
  .map((type) => {
    if (typeof type.value === 'object') {
      return `class ${type.name} {
  <<interface>>
${Object.entries(type.value)
  .map(
    ([attribute, attributeType]) =>
      `  ${attribute} ${formatTypesType(attributeType as string)}`
  )
  .join('\n')}
}
${convertDependenciesToMermaid(type)}
`
    } else {
      return `class ${type.name} {
  <<type>>
  ${formatTypesType(type.value)}
}
${convertDependenciesToMermaid(type)}
`
    }
  })
  .join('\n')}
\`\`\`
`
}

const formatTypesType = (type: string) =>
  type.replace(/{/g, '#123; ').replace(/}/g, ' #125;')

const convertDependenciesToMermaid = (type: Type) =>
  (
    type.dependencies
      .map((dependency) => types.find((type) => type.name === dependency))
      .filter((dependencyType) => dependencyType) as Type[]
  )
    .map((dependencyType) => {
      let linkStart = '-'

      if (dependencyType.dependencies.includes(type.name)) {
        linkStart = '<'

        dependencyType?.dependencies.splice(
          dependencyType?.dependencies.indexOf(type.name),
          1
        )
      }

      return `${type.name} ${linkStart}-> ${dependencyType.name}`
    })
    .join('\n')

const types = getTypesFromDirectoryPath(baseUrl)

fs.writeFileSync('./MERMAID.md', convertJSONTypesToMermaid(types))
