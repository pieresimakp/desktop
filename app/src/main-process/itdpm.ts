import { net } from 'electron'
import { itdpmRequestBody, IItdpmResponse } from '../lib/extensions/itdpm-api'

export async function fetchItdpmTasks(
  endpoint: string,
  cookie: string | null
): Promise<IItdpmResponse> {
  return new Promise((resolve, reject) => {
    const request = net.request({ method: 'POST', url: endpoint })

    request.setHeader('Accept', 'application/json')
    request.setHeader('Content-Type', 'application/json')

    if (cookie && cookie.trim().length > 0) {
      request.setHeader('Cookie', cookie)
    }

    request.on('response', response => {
      const statusCode = response.statusCode ?? 0
      const chunks: Array<Buffer> = []

      response.on('data', chunk => {
        chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk))
      })

      response.on('end', () => {
        const body = Buffer.concat(chunks).toString('utf8')

        if (statusCode < 200 || statusCode >= 300) {
          reject(new Error(`ITDPM request failed (${statusCode})`))
          return
        }

        try {
          const json = JSON.parse(body) as IItdpmResponse

          if (json.error) {
            const message =
              json.error.data?.message ||
              json.error.message ||
              'Session expired'
            reject(new Error(`ITDPM error: ${message}`))
            return
          }

          resolve(json)
        } catch (error) {
          reject(error)
        }
      })
    })

    request.on('error', reject)
    request.end(JSON.stringify(itdpmRequestBody))
  })
}
