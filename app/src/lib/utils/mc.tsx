import * as minio from "minio";
const mc = new minio.Client(/*{
    endPoint: "play.min.io",
    port: 9000,
    useSSL: true,
    accessKey: "Q3AM3UQ867SPQQA43P2F",
    secretKey: "zuf+tfteSlswRu7BJ86wekitnifILbZam1KYY3TG"
}*/
  {
    endPoint: 's3.app.bhivecommunity.co.uk',
    port: 443, // Change this if you use a different port
    useSSL: true, // Change to true if your MinIO server uses SSL
    accessKey: 'HWL0Z36tnBEItLIHpK9U',
    secretKey: 'k2JLHoWAkEGBaQdQKAWAKS2A0GfdHQMX4C57yKbg'
  }
  //Assume role example::
  //https://github.com/minio/minio/blob/master/docs/sts/assume-role.md#testing-an-example-with-assume-rolego

  /*,
  {
      endPoint: "localhost",
      useSSL: false,
      port: 9000,
      accessKey: "H3ERY005GCGQ98KM0DP5",
      secretKey: "MSG+WRmt8O8nxeHinNW8v9QcLT1t7JoL14zO71OH",
      sessionToken: "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJhY2Nlc3NLZXkiOiJIM0VSWTAwNUdDR1E5OEtNMERQNSIsImV4cCI6MTY1NzYyMDA1OSwicGFyZW50IjoibWluaW8ifQ.3ZM7Tg9qMoCV6-sRbmdEc064-Fhtp0eBOBcgetUWx8GfihZZAnInspdiiNZFl_bq43UAh0VHg-etkhkzsvN0EA"

  }*/

);


export default mc