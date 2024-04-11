import Vault from './vault'

const vault = new Vault({
  name: 'Sakana',
  defaults: {
    name: 'Sakana',
    temp: {
      name: 'Kotori',
      age: 20,
      un: '1'
    }
  }
})

console.log(vault.has('temp.age'))
