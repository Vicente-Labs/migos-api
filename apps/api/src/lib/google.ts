import { google } from 'googleapis'

import { env } from '@/env'

export const googleClient = new google.auth.OAuth2(
  env.GOOGLE_CLIENT_ID,
  env.GOOGLE_CLIENT_SECRET,
  env.GOOGLE_REDIRECT_URI,
)

export const oauth2 = google.oauth2('v2')
