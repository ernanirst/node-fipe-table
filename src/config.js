import axios from 'axios'

const deafultFipeClient = axios.create({
  baseURL: 'http://veiculos.fipe.org.br/api/veiculos/',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Referer': 'http://veiculos.fipe.org.br/'
  }
})

export { deafultFipeClient }