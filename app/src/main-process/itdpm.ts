import { net } from 'electron'
import {
  myTaskEndpoint,
  myTaskRequestBody,
  IMyTaskApiResponse,
} from '../lib/itdpm'

export async function fetchItdpmTasks(
  cookie: string | null
): Promise<IMyTaskApiResponse> {
  return new Promise((resolve, reject) => {
    const request = net.request({ method: 'POST', url: myTaskEndpoint })

    request.setHeader('Accept', 'application/json')
    request.setHeader('Content-Type', 'application/json')
    request.setHeader('Origin', 'https://itdpm.rpx.co.id')
    request.setHeader('Referer', 'https://itdpm.rpx.co.id/web')

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
          const json = JSON.parse(body) as IMyTaskApiResponse

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
    request.end(JSON.stringify(myTaskRequestBody))
  })
}
