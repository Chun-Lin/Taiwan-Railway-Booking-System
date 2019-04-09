const getInfoElements = async page => {
  console.log('get needed elements...')
  const inputId = await page.$('#pid')
  const travelDate = await page.$('#rideDate1')
  const fromStation = await page.$('#startStation')
  const toStation = await page.$('#endStation')
  const trainNo = await page.$('#trainNoList1')
  const ticketNumber = await page.$('#normalQty')
  const startBookingButton = await page.$(
    '#queryForm > div.btn-sentgroup > input.btn.btn-3d',
  )
  const inputCaptcha = await page.$('#g-recaptcha-response')

  return {
    inputId,
    travelDate,
    fromStation,
    toStation,
    trainNo,
    ticketNumber,
    startBookingButton,
    inputCaptcha,
  }
}

module.exports = {
  getInfoElements,
}
