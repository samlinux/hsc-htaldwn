const { v4: uuidv4 } = require('uuid');
const supertest = require('supertest');
const api = supertest('localhost:3000');

describe("Hyperledger Fabric API tests", function() {
  it("checks if api is running", async function() {
    this.skip();
    let result = await api.get('/')
    console.log(result.body)
  }) 

  it("query a key", async function() {
    //this.skip();
    let key = 'msg-0a2b1dca-8727-4935-bd8f-27c07ae5af47';
    let result = await api.get('/getData/'+key)
    console.log(result.body)
  })
  
  it("send a key value paire", async function() {
    this.skip();
    let payload = {
      key:'msg-'+uuidv4(),
      value: 'value-'+new Date()
    };
    let result = await api.post('/setData').send(payload)
    console.log(result.body)
  })

})