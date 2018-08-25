import axios from 'axios'

const fipeClient = axios.create({
  baseURL: 'http://veiculos.fipe.org.br/api/veiculos/',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Referer': 'http://veiculos.fipe.org.br/'
  }
})

export { fipeClient }