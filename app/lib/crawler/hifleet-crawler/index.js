/* eslint-disable no-await-in-loop */
import cliProgress from 'cli-progress';
import getFleetKeyword from './handler/getFleetKeyword';
import loggerFactory from '../../logger-factory';
import { HIFLEET_USERNAME, HIFLEET_PASSWORD } from '../../../../config';

const logger = loggerFactory.getLogger(__filename);

const progressBar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);


export default async function crawlHiFleet(fleets, page) {
  // Check input data
  if (!fleets || fleets.length === 0) {
    logger.info({ message: 'Không có danh sách tàu để cào dữ liệu' });
    return [];
  }

  const shipInfos = [];

  await page.goto('http://www.hifleet.com/', {
    waitUntil: 'networkidle2',
  });

  // Go to english page
  await page.waitForSelector('body > div.MapServesTips > div:nth-child(1) > a.turnLanguage');
  await page.click('body > div.MapServesTips > div:nth-child(1) > a.turnLanguage');
  await page.waitForFunction('document.querySelector(".bottomNavLogin")!== null');
  await page.waitForFunction('document.querySelector(".bottomNavLogin").innerText.includes("Login")=== true').catch(() => {
    logger.warn({ message: 'Khong thay nut login :))' });
  });

  // Login
  try {
    await page.click('.userAvatarWidget');
    const frames = page.frames();
    // eslint-disable-next-line no-underscore-dangle
    const fleetAreaFrame = frames.find((f) => f._url === 'http://www.hifleet.com/IndependentLogin.html');
    await fleetAreaFrame.waitForSelector('#j_username');
    await fleetAreaFrame.type('#j_username', HIFLEET_USERNAME);
    await fleetAreaFrame.type('#j_password', HIFLEET_PASSWORD);
    await fleetAreaFrame.click('#loginbtn');
    await page.waitForNavigation();
  } catch (err) {
    logger.warn({ message: 'Khong dang nhap duoc' });
  }

  await page.goto('http://www.hifleet.com/', {
    waitUntil: 'networkidle2',
  }).catch(() => {
    throw new Error('Khong vao duoc trang http://www.hifleet.com/');
  });

  const fleetCount = fleets.length;
  progressBar.start(fleetCount, 0);

  for (let i = 0; i < fleetCount; i += 1) {
    const fleet = fleets[i];
    const searchFleet = getFleetKeyword(fleet);
    try {
      await page.evaluate((keyword) => {
        document.querySelector('input[type=text]').value = keyword;
      }, searchFleet.keyword);

      await page.click('input[type=submit]');
      await page.waitForFunction(
        (search) => !!document.querySelector(search.selectorName),
        {},
        searchFleet,
      );
      await page.waitForFunction(
        (search) => !!document.querySelector(search.selectorName)
          .innerText.includes(search.keyword),
        {},
        searchFleet,
      );


      await page.waitForFunction("document.querySelector('#stopinfo').textContent !== null");
      await page.waitForFunction("document.querySelector('#stopinfo').textContent !== ''");
      await page.waitForFunction(() => document.querySelector('#stopinfo').textContent.includes('Loading') === false, { timeout: 10000 }).catch(() => {
        logger.warn({ message: `Không lấy được tốc độ của tàu ${searchFleet.selectorName}: ${searchFleet.keyword}` });
      });
      await page.waitFor(3000);

      const shipInfo = await page.evaluate(() => {
        const ship = {};

        // Get ship info update time
        const shipInfoUpdateTimeTag = document.querySelector('#shipinfo_updatetime');
        if (shipInfoUpdateTimeTag) ship.shipUpdateTime = shipInfoUpdateTimeTag.textContent;
        else ship.shipUpdateTime = '';

        // Get ship Latitude
        const shipInfoLatitudeTag = document.querySelector('#shipinfo_lat');
        if (shipInfoLatitudeTag) ship.shipLatitude = shipInfoLatitudeTag.textContent;
        else ship.shipLatitude = '';

        // Get ship longitude
        const shipInfoLongitudeTag = document.querySelector('#shipinfo_lon');
        if (shipInfoLongitudeTag) ship.shipLongitude = shipInfoLongitudeTag.textContent;
        else ship.shipLongitude = '';

        // Get ship info heading course
        const shipInfoHeadingCourseTag = document.querySelector('#shipinfo_heading_course');
        if (shipInfoHeadingCourseTag) ship.shipHeadingCourse = shipInfoHeadingCourseTag.textContent;
        else ship.shipHeadingCourse = '';

        // Get ship speed
        const shipSpeedTag = document.querySelector('#stopinfo');
        if (shipSpeedTag) ship.shipSpeed = shipSpeedTag.textContent;
        else ship.shipSpeed = '';

        // // Get ship info MMSI
        // const shipInfoMmsiTag = document.querySelector('#shipinfo_mmsi');
        // if (shipInfoMmsiTag) ship.shipMMSI = shipInfoMmsiTag.textContent;
        // else ship.shipMMSI = '';

        return ship;
      });

      shipInfos.push({
        shipId: fleet.shipId,
        ...shipInfo,
        source: 'http://www.hifleet.com/',
      });
    } catch (err) {
      logger.error({ message: `Lỗi khi quét tàu ${fleet.name} với từ khóa ${JSON.stringify(searchFleet)} ` });
    } finally {
      progressBar.increment();
    }
  }
  progressBar.stop();
  // Log out
  try {
    const logoutButtonTag = '.logoutBtnLink';
    await page.waitForSelector(logoutButtonTag);
    await page.click(logoutButtonTag);
    await page.waitForSelector('body > div.MapServesTips > div:nth-child(2) > div.indexCountLog > a');
  } catch (err) {
    logger.error({ message: 'Khong log out duoc' });
  }

  return shipInfos;
}
