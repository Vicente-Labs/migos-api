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
  message: 'User pre-registered successfully'
}

export async function preRegister({ dictionary, email }: PreRegisterRequest) {
  const { message } = await api
    .post('users/pre-register', { json: { email } })
    .json<PreRegisterResponse>()

  await resend.emails.send({
    from: 'Migos <onboarding@migos.me>',
    to: email,
    subject: 'Welcome to Migos',
    react: PreRegisterTemplate({ dictionary, userEmail: email }),
  })

  return { message }
}
