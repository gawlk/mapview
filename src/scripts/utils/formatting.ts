export const LF = '\n'
export const CRLF = '\r\n'

export const replaceAllLFToCRLF = (text: string) => text.replaceAll(LF, CRLF)

export const trimAllLines = (text: string) =>
  text
    .trim()
    .split('\n')
    .map((line) => line.trim())
    .join('\n')

export const formatForExport = (input: string) => {
  const regex =
    /[^\u0000-\u007F\u20AC\u201A\u0192\u201E\u2026\u2020\u2021\u02C6\u2030\u0160\u2039\u0152\u017D\u2019\2019\201C\u201D\u2022\u2013\u2014\u02DC\u2122\u0161\u203A\u0153\u017E\u0178\u00A0-\u00FF]/gm
  return input
    .replaceAll('≠', '=/=')
    .replaceAll('∞', 'Inf')
    .replaceAll('‘', "'")
    .replaceAll('“', '"')
    .replaceAll('', ' ')
    .replaceAll('≈', '~=')
    .replaceAll('√', 'OK')
    .replaceAll(regex, ' ')
}
