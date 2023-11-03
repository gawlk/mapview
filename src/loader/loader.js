import { readFile } from 'fs/promises'
import { URL } from 'url'

function isAllowedURL(url) {
  return [
    '.html',
    '.htm',
    '.md',
    '.css',
    '.svg',
    '.svg?raw',
    '.json',
    '.js',
  ].some((x) => {
    return url.endsWith(x)
  })
}

export async function load(url, context, defaultLoad) {
  if (!isAllowedURL(url)) {
    return defaultLoad(url, context, defaultLoad)
  }

  const content = (await readFile(new URL(url))).toString()
  const json = url.endsWith('.json') ? content : JSON.stringify(content)

  return {
    format: 'module',
    source: `export default ${json};`,
    shortCircuit: true,
  }
}
