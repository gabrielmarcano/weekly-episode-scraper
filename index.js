const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()

  const links = []

  await page.goto(`https://webcache.googleusercontent.com/search?q=cache:https://www3.animeflv.net/anime/vinland-saga-season-2`)

  const linkList = await page.$$eval('a[href^="/ver/vinland-saga-season-2-"',
    (episodes => episodes.map(episode => {
      return `https://webcache.googleusercontent.com/search?q=cache:${episode.href}`
    })))

  for (const link of linkList) {
    await Promise.all([
      page.waitForNavigation(),
      page.goto(link),
      page.waitForSelector('a[href^="https://mega.nz/"'),
    ])

    const mega = await page.$eval('a[href^="https://mega.nz/"', e => e.href)

    if (!links.includes(mega)) {
      links.push(mega)
    }
  }

  console.log(links)
  fs.writeFileSync('./links.txt', links.join('\n'))

  await browser.close()
})()