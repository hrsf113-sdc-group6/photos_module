const faker = require('faker');
const fs = require('fs');
const path = require('path');

const getRandomId = () => {
  return Math.floor(Math.random() * 1033 + 1);
}

const convertToCSV =  (data) => {
  let rows = "";
  for (let key in data) {
    rows += data[key] + ',';
  };
  rows = rows.slice(0, rows.length-1);
  rows += '\n';
  return rows
}

const createMockDataFiles = () => {
  const homeFile = fs.createWriteStream(path.join(__dirname, 'homeData.csv'));
  const photoFile = fs.createWriteStream(path.join(__dirname, 'photosData.csv'));
  (async() => {
      let counter = 0;
      for (let i = 1; i < 1e7; i++) {
        let homeData = { id: i };
        if (counter === 0) {
          homeFile.write('id\n');
          counter = 1;
        }

        let homeCSV = convertToCSV(homeData)
        if (!homeFile.write(homeCSV)) {
          await new Promise(resolve => homeFile.once('drain', resolve));
        }
      }
      counter = 0;
      for (let i = 1; i < 15e7; i++) {
        let photo = {};
        photo.id = i;
        photo.url = `https://s3.amazonaws.com/sdc-airbnb-photos/photo${getRandomId()}.jpg`;
        photo.comment = faker.lorem.words();
        photo.home_id = Math.floor(Math.random() * 1e7)
        if (counter === 0) {
          photoFile.write("id,url,comment,home_id\n");
          counter = 1;
        } else {
          let photoCSV = convertToCSV(photo);
          if (!photoFile.write(photoCSV)) {
            await new Promise(resolve => photoFile.once('drain', resolve));
          }
        }
      }
  })();
}

createMockDataFiles();
