const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine']
const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety']
const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen']

function convertTwoDigits(n: number): string {
  if (n < 10) return ones[n]
  if (n < 20) return teens[n - 10]
  return tens[Math.floor(n / 10)] + (n % 10 ? ' ' + ones[n % 10] : '')
}

function convertThreeDigits(n: number): string {
  if (n < 100) return convertTwoDigits(n)
  return ones[Math.floor(n / 100)] + ' Hundred' + (n % 100 ? ' ' + convertTwoDigits(n % 100) : '')
}

export function numberToWords(num: number): string {
  if (num === 0) return 'Zero Taka Only'
  if (num < 0) return 'Negative ' + numberToWords(-num)

  let integerPart = Math.floor(num)
  const decimalPart = Math.round((num - integerPart) * 100)

  let result = ''

  if (integerPart >= 10000000) {
    const crores = Math.floor(integerPart / 10000000)
    result += convertThreeDigits(crores) + ' Crore '
    integerPart %= 10000000
  }

  if (integerPart >= 100000) {
    const lakhs = Math.floor(integerPart / 100000)
    result += convertThreeDigits(lakhs) + ' Lakh '
    integerPart %= 100000
  }

  if (integerPart >= 1000) {
    const thousands = Math.floor(integerPart / 1000)
    result += convertThreeDigits(thousands) + ' Thousand '
    integerPart %= 1000
  }

  if (integerPart > 0) {
    result += convertThreeDigits(integerPart)
  }

  result = result.trim()

  if (decimalPart > 0) {
    result += ' and ' + convertTwoDigits(decimalPart) + ' Paisa'
  }

  return result + ' Taka Only'
}

export function numberToWordsBangla(num: number): string {
  return numberToWords(num)
}
