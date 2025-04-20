import { Injectable } from '@nestjs/common'
import axios, { AxiosResponse } from 'axios'

interface OllamaResponse {
  response: string
}

@Injectable()
export class JokesService {
  private readonly ollamaApiUrl = process.env.OLLAMA_API_URL || 'http://ollama:11434'

  async generateText(): Promise<string> {
    try {
      const response: AxiosResponse<OllamaResponse> = await axios.post(`${this.ollamaApiUrl}/api/generate`, {
        model: 'mistral',
        prompt: 'joke',
        stream: false
      })

      return response.data.response
    } catch (error) {
      console.error('Error calling Ollama:', error)
      throw new Error('Failed to generate text from Ollama')
    }
  }
}
