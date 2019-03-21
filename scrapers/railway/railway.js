const puppeteer = require('puppeteer')
const { performance } = require('perf_hooks')
const dbc = require('./deathbycaptcha')

const utils = require('./utils')

const railwayScript = async () => {
  const startTime = performance.now()
  const borwser = await puppeteer.launch({ headless: true })
  const page = await borwser.newPage()

  await page.goto('http://railway.hinet.net/Foreign/TW/etno1.html')
  const {
    inputId,
    fromStation,
    toStation,
    trainNo,
    ticketNumber,
    startBookingButton,
  } = await utils.getInfoElements(page)
  const {
    ID,
    TRAVEL_DATE,
    FROM_STATION,
    TO_STATION,
    TRAIN_NO,
    TICKET_NUMBER,
    DBC_USERNAME,
    DBC_PASSWORD,
  } = process.env

  console.log('input ID: ', ID)
  await inputId.type(ID)
  console.log('Travel Date: ', await utils.getTravelDate(page, TRAVEL_DATE))
  await page.select(
    'select#getin_date',
    await utils.getTravelDate(page, TRAVEL_DATE),
  )
  console.log('From Station: ', FROM_STATION)
  await fromStation.type(FROM_STATION)
  console.log('To Station: ', TO_STATION)
  await toStation.type(TO_STATION)
  console.log('Train NO: ', TRAIN_NO)
  await trainNo.type(TRAIN_NO)
  console.log('TICKET NUMBER: ', TICKET_NUMBER)
  await ticketNumber.type(TICKET_NUMBER)

  await startBookingButton.click()
  await page.waitForNavigation({ waitUntil: 'networkidle2' })

  const captchaImgBase64 = await utils.getCaptchaImgBase64(page)

  const client = new dbc.SocketClient(DBC_USERNAME, DBC_PASSWORD)

  await client.decode({ captcha: captchaImgBase64 }, async captcha => {
    const { captchaInput, confirmBtn } = await utils.getCaptchaPageElements(
      page,
    )
    captcha && console.log(captcha)
    await captchaInput.type(captcha.text)
    await confirmBtn.click()
  })

  await page.waitForNavigation({ waitUntil: 'networkidle2' })
  const endTime = performance.now()
  console.log(`Total Time: ${endTime - startTime} ms`)

  const orderNo = await page.$eval(
    '#spanOrderCode',
    orderNumber => orderNumber.textContent,
  )
  console.log('orderNo: ', orderNo)

  await page.screenshot({ path: 'Train-Booking-Result.png' })
}

module.exports = { railwayScript }
