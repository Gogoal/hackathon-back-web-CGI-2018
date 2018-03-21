/* All constant useful beetween environnement - prod vs local */
export const config = {
  secret: 'secretwesport2017',
  db: 'mongodb://gogoal:gogoal12@ds219879.mlab.com:19879/hackathon-cgi-back-web', // test
  dbDev: 'mongodb://localhost:27017/socleMongo',
  dbTest: 'mongodb://localhost:27017/testSocleMongo',
  apiLocal: 'http://localhost:3000',
  apiProd: ' https://hackathon-cgi-back-web.herokuapp.com',
};

// Mail Wesport
export const mailConfig = {
  mail: 'mettreUneAdresseMail.com', /* Test hackathon */
  password: 'mdr',
};

