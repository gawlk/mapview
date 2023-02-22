export const LF = '\n'
export const CRLF = '\r\n'

export const replaceAllLFToCRLF = (text: string) => text.replaceAll(LF, CRLF)

export const trimAllLines = (text: string) =>
  text
    .trim()
    .split('\n')
    .map((line) => line.trim())
    .join('\n')
