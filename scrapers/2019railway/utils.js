const getInfoElements = async page => {
  console.log('get needed elements...')
  const inputId = await page.$('#pid')
  const travelDate = await page.$('#rideDate1')
  const fromStation = await page.$('#startStation')
  const toStation = await page.$('#endStation')
  const trainNo1 = await page.$('#trainNoList1')
  const trainNo2 = await page.$('#trainNoList2')
  const trainNo3 = await page.$('#trainNoList3')
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
    trainNo1,
    trainNo2,
    trainNo3,
    ticketNumber,
    startBookingButton,
    inputCaptcha,
  }
}

module.exports = {
  getInfoElements,
}
