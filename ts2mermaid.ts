import * as ts from 'typescript'
import * as fs from 'fs'
import * as path from 'path'
import { exec } from 'child_process'

const kindEnum = ts.SyntaxKind

interface Parameters {
  pathToScan?: string
  pathToSave?: string
  configuration?: Configuration | Configuration[]
}

interface Configuration {
  name?: string
  hideTypes?: boolean
  hideInterfaces?: boolean
  include?: RegExp[]
  exclude?: RegExp[]
}

interface Type {
  name: string
  value: string
  dependencies: string[]
}

const getTypesFromFilePath = (
  filePath: string,
  configuration?: Configuration
): Type[] => {
  const sourceFile = ts.createSourceFile(
    '',
    fs.readFileSync(filePath, 'utf8'),
    ts.ScriptTarget.ESNext
  )

  const types: Type[] = []

  const getTypescriptType = (node: ts.Node) =>
    node
      .getText(sourceFile)
      .replace(/,\n/g, ', \n')
      .replace(/\n */g, '')
      .replace(/{/g, '#123; ')
      .replace(/}/g, ' #125;')

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

    return obj.kind === kindEnum.QualifiedName
      ? [dependencies.join('.')]
      : dependencies
  }

  const removeDuplicatesFromArray = (arr: any[]) => Array.from(new Set(arr))

  sourceFile.forEachChild((childNode) => {
    const kind = childNode.kind

    if (kind !== kindEnum.EndOfFileToken) {
      const name = (childNode as any).name.escapedText as string

      if (
        (!configuration?.include && !configuration?.exclude) ||
        (configuration?.include &&
          configuration?.include
            ?.map((regex) => !!name.match(regex))
            .includes(true)) ||
        (configuration?.exclude &&
          !configuration?.exclude
            ?.map((regex) => !!name.match(regex))
            .includes(true))
      ) {
        const type: any = {}

        type.name = name

        switch (kind) {
          case kindEnum.InterfaceDeclaration:
            if (!configuration?.hideInterfaces) {
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
                          .map((parameter: any) =>
                            parameter.getText(sourceFile)
                          )
                          .join(', ')}]`
                      : ''

                  type.value[childNodeName] = getTypescriptType(childNodeType)

                  type.dependencies = [
                    ...type.dependencies,
                    ...getDependencies(childNodeType),
                  ]
                }
              )

              type.dependencies = removeDuplicatesFromArray(type.dependencies)

              types.push(type)
            }

            break

          default:
            if (!configuration?.hideTypes) {
              const childNodeType = (childNode as any).type as ts.TypeNode

              type.value = getTypescriptType(childNodeType)

              type.dependencies = getDependencies(childNodeType)

              type.dependencies = removeDuplicatesFromArray(type.dependencies)

              types.push(type)
            }
        }
      }
    }
  })

  return types
}

const getTypesFromDirectoryPath = (
  pathToScan: string,
  configuration?: Configuration
): Type[] => {
  const types: Type[] = []

  if (fs.lstatSync(pathToScan).isDirectory()) {
    fs.readdirSync(pathToScan).map((fileName) => {
      const filePath = path.join(pathToScan, fileName)

      if (fs.lstatSync(filePath).isDirectory()) {
        types.push(...getTypesFromDirectoryPath(filePath, configuration))
      } else if (filePath.endsWith('types.d.ts')) {
        types.push(...getTypesFromFilePath(filePath, configuration))
      }
    })
  } else {
    types.push(...getTypesFromFilePath(pathToScan, configuration))
  }

  return types
}

const convertJSONTypesToMermaidTypes = (types: Type[]) => `classDiagram
${types
  .map((type) => {
    if (typeof type.value === 'object') {
      return `class ${type.name} {
  <<interface>>
${Object.entries(type.value)
  .map(([attribute, typescriptType]) => `  ${attribute} ${typescriptType}`)
  .join('\n')}
}
${convertDependenciesToMermaid(types, type)}
`
    } else {
      return `class ${type.name} {
  <<type>>
  ${type.value}
}
${convertDependenciesToMermaid(types, type)}
`
    }
  })
  .join('\n')}
`

const convertDependenciesToMermaid = (types: Type[], type: Type) =>
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

const execMermaid = (pathToMMD: string, pathToSvg: string) =>
  exec(
    `npx -p @mermaid-js/mermaid-cli mmdc -i ${pathToMMD} -o ${pathToSvg}`,
    (err) => err && console.error(`exec error: ${err}`)
  )

const processConfiguration = (
  pathToScan: string,
  pathToSave: string,
  fileName: string,
  configuration?: Configuration
) => {
  if (!fs.existsSync(pathToSave)) {
    fs.mkdirSync(pathToSave, { recursive: true })
  }

  const types = getTypesFromDirectoryPath(pathToScan, configuration)

  fs.writeFileSync(
    `${pathToSave}/${fileName}.json`,
    JSON.stringify(types, null, 2)
  )

  const pathToMMD = `${pathToSave}/${fileName}.mmd`

  fs.writeFileSync(pathToMMD, convertJSONTypesToMermaidTypes(types))

  execMermaid(pathToMMD, `${pathToSave}/${fileName}.svg`)

  fs.writeFileSync(
    `${pathToSave}/${fileName}.md`,
    `![diagram](./${fileName}.svg)`
  )
}

const main = async (parameters?: Parameters) => {
  const pathToScan = path.join(__dirname, parameters?.pathToScan || 'src')

  const pathToSave = path.join(__dirname, parameters?.pathToSave || 'mermaid')

  fs.rmSync(`${pathToSave}/types.md`)

  Array.isArray(parameters?.configuration)
    ? parameters?.configuration.forEach((configuration, index) => {
        processConfiguration(
          pathToScan,
          path.join(pathToSave, configuration.name || String(index + 1)),
          'types',
          configuration
        )

        fs.appendFileSync(
          `${pathToSave}/types.md`,
          `# ${configuration.name}

![${configuration.name}](./${configuration.name}/types.svg)

`
        )
      })
    : processConfiguration(
        pathToScan,
        pathToSave,
        parameters?.configuration?.name || 'types',
        parameters?.configuration
      )
}

main({
  configuration: [
    {
      name: 'all',
    },
    {
      name: 'allInterfaces',
      hideTypes: true,
    },
    {
      name: 'allTypes',
      hideInterfaces: true,
    },
    {
      name: 'onlyHeavydyn',
      include: [/[H|h]eavydyn/],
    },
    {
      name: 'onlyMaxidyn',
      include: [/[M|m]axidyn/],
    },
    {
      name: 'onlyMinidyn',
      include: [/[M|m]inidyn/],
    },
    {
      name: 'onlyMachines',
      include: [/[H|h]eavydyn/, /[M|m]axidyn/, /[M|m]inidyn/, /[M|m]achine/],
    },
    {
      name: 'exceptMachines',
      exclude: [/[H|h]eavydyn/, /[M|m]axidyn/, /[M|m]inidyn/, /[M|m]achine/],
    },
  ],
})
