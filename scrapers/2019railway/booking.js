const puppeteer = require('puppeteer')
const { performance } = require('perf_hooks')
const dayjs = require('dayjs')
const relativeTime = require('dayjs/plugin/relativeTime')
const dbc = require('./deathbycaptcha')

const utils = require('./utils')

dayjs.extend(relativeTime)

const bookingScript = async () => {
  const borwser = await puppeteer.launch({ headless: false })
  const page = await borwser.newPage()
  
  await page.setViewport({ width: 1366, height: 768 })
  await page.goto(
    'https://tip.railway.gov.tw/tra-tip-web/tip/tip001/tip121/query',
    { waitUntil: 'load' },
  )
  await page.waitForSelector('#g-recaptcha-response')
  await page.evaluate(() => {
    document.querySelector('#g-recaptcha-response').style.display = 'block'
  })

  // get form elements
  const {
    inputId,
    fromStation,
    toStation,
    trainNo1,
    trainNo2,
    trainNo3,
    ticketNumber,
    travelDate,
    startBookingButton,
    inputCaptcha,
  } = await utils.getInfoElements(page)

  // get env data
  const {
    ID,
    TRAVEL_DATE,
    BOOK_DATE,
    FROM_STATION,
    TO_STATION,
    TRAIN_NO1,
    TRAIN_NO2,
    TRAIN_NO3,
    TICKET_NUMBER,
    DBC_USERNAME,
    DBC_PASSWORD,
  } = process.env
  
  const username = DBC_USERNAME // DBC account username
  const password = DBC_PASSWORD // DBC account password
  
  // get google site key
  const googleKey = await page.$eval('#recaptcha > div.g-recaptcha', el => el.dataset.sitekey)

  // Proxy and Recaptcha token data
  const token_params = await JSON.stringify({
    proxy: 'http://192.168.0.39:8080',
    proxytype: 'HTTP',
    googlekey: `${googleKey}`,
    pageurl: 'https://tip.railway.gov.tw/tra-tip-web/tip/tip001/tip121/query',
  }) 

  // Death By Captcha Socket Client
  // const client = new dbc.SocketClient(username, password)
  const client = new dbc.HttpClient(username, password)

  // Solve captcha with type 4 & token_params extra arguments
  await client.decode(
    { extra: { type: 4, token_params: token_params } },
    async captcha => {
      if (captcha) {
        console.log(
          'Captcha ' + captcha['captcha'] + ' solved: ' + captcha['text'],
        )

        await inputCaptcha.type(captcha['text'])
        const bookDate = dayjs(BOOK_DATE)
        const nowDate = dayjs()
        const remainingHour = bookDate.diff(nowDate, 'hour')
        const remainingMinute = bookDate.diff(nowDate, 'minute') % 60
        const remainingSecond = bookDate.diff(nowDate, 'second') % 60
        console.log(
          'Wait Time: ',
          `${remainingHour} Hours, ${remainingMinute} Minutes, ${remainingSecond} Seconds `,
        )
        // await page.waitFor(dayjs(BOOK_DATE).valueOf() - dayjs().valueOf())

        await startBookingButton.click()

        await page.waitForNavigation({ waitUntil: 'networkidle2' })
        await page.screenshot({ path: 'Train-Booking-Result.png' })

        /*
         * Report an incorrectly solved CAPTCHA.
         * Make sure the CAPTCHA was in fact incorrectly solved!
         * client.report(captcha['captcha'], (result) => {
         *   console.log('Report status: ' + result);
         * });
         */
      }
    },
  )

  console.log('input ID: ', ID)
  await inputId.type(ID)
  console.log('From Station: ', FROM_STATION)
  await fromStation.type(FROM_STATION)
  console.log('To Station: ', TO_STATION)
  await toStation.type(TO_STATION)
  console.log('Travel Date: ', TRAVEL_DATE)
  await page.evaluate(travelDate => {
    document.querySelector('#rideDate1').value = travelDate
  }, TRAVEL_DATE)
  console.log('Train No1: ', TRAIN_NO1)
  await trainNo1.type(TRAIN_NO1)
  console.log('Train No2: ', TRAIN_NO2)
  await trainNo2.type(TRAIN_NO2)
  console.log('Train No3: ', TRAIN_NO3)
  await trainNo3.type(TRAIN_NO3)
}

module.exports = { bookingScript }
