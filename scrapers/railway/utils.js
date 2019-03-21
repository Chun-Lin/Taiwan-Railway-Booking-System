const getInfoElements = async page => {
  console.log('get needed elements...')
  const inputId = await page.$('#person_id')
  const travelDate = await page.$('select#getin_date')
  const fromStation = await page.$('#from_station')
  const toStation = await page.$('#to_station')
  const trainNo = await page.$('#train_no')
  const ticketNumber = await page.$('#order_qty_str')
  const startBookingButton = await page.$(
    'body > div.container > div.row.contents > div > form > div > div.col-xs-12 > button',
  )

  return {
    inputId,
    travelDate,
    fromStation,
    toStation,
    trainNo,
    ticketNumber,
    startBookingButton,
  }
}

const getCaptchaPageElements = async page => {
  const captchaInput = await page.$('#randInput')
  const confirmBtn = await page.$('#sbutton')
  return {
    captchaInput,
    confirmBtn,
  }
}

getTravelDate = async (page, date) => {
  const travelDates = await page.evaluate(() =>
    Array.from(
      document.querySelectorAll('#getin_date > option'),
      element => element.value,
    ),
  )

  let travelDate = undefined
  travelDates.forEach(travelDateItem => {
    if (travelDateItem.includes(date)) {
      travelDate = travelDateItem
    }
  })

  return travelDate
}

const getCaptchaImgBase64 = async page => {
  const captchaImg = await page.$('#idRandomPic')
  const captchaImgBuffer = await captchaImg.screenshot()
  const captchaImgBase64 = await captchaImgBuffer.toString('base64')

  return captchaImgBase64
}

module.exports = {
  getInfoElements,
  getCaptchaPageElements,
  getTravelDate,
  getCaptchaImgBase64
}
