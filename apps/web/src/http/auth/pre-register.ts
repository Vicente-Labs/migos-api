'use server'

import { resend } from '@/resend'
import { PreRegisterTemplate } from '@/resend/templates/pre-register'
import type { Dictionary } from '@/utils/dictionaries'

import { api } from '../api-client'

interface PreRegisterRequest {
  dictionary: Dictionary
  email: string
}

interface PreRegisterResponse {
  message: 'User pre-registered successfully' | 'User already exists'
}

export async function preRegister({ dictionary, email }: PreRegisterRequest) {
  const { message } = await api
    .post('users/pre-register', { json: { email } })
    .json<PreRegisterResponse>()

  if (message === 'User already exists') throw new Error('User already exists')

  await resend.emails.send({
    from: 'Migos <onboarding@migos.me>',
    to: email,
    subject: 'Welcome to Migos',
    react: PreRegisterTemplate({ dictionary, userEmail: email }),
  })

  return { message }
}
