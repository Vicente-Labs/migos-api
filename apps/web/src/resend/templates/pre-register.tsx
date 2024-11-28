import {
  Body,
  Container,
  Head,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
} from '@react-email/components'

import { env } from '@/env.mjs'
import type { Dictionary } from '@/utils/dictionaries'

interface PreRegisterTemplateProps {
  dictionary: Dictionary
  userEmail: string
}

export function PreRegisterTemplate({
  dictionary,
  userEmail,
}: PreRegisterTemplateProps) {
  const previewText = `Welcome to Migos!`

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="mx-auto my-auto bg-[#f6f9fc] font-poppins">
          <Container className="mx-auto my-[40px] max-w-[465px] rounded-lg border border-solid border-[#f0f0f0] bg-white p-[20px] shadow-lg">
            <Section className="mt-[32px]">
              <Section className="mb-6 rounded-lg bg-primary/10 p-6">
                <Text className="m-0 text-[16px] leading-[24px] text-foreground">
                  {dictionary.welcome} 👋
                </Text>
                <Text className="mt-2 text-[14px] leading-[24px] text-muted-foreground">
                  {dictionary.weAreExcitedToHaveYouJoinUs}
                  <Link
                    href={env.NEXT_PUBLIC_BASE_URL}
                    className="text-primary no-underline hover:underline"
                  >
                    Migos
                  </Link>
                </Text>
              </Section>

              <Section className="my-6 rounded-lg bg-accent p-4">
                <Text className="m-0 text-[14px] leading-[24px] text-accent-foreground">
                  {dictionary.weveReceivedYourPreRegistrationRequest}
                </Text>
              </Section>

              <Section className="my-6 rounded-lg bg-secondary/10 p-4">
                <Text className="m-0 text-[14px] leading-[24px] text-secondary-foreground">
                  {dictionary.inTheMeantimeKeepAnEyeOnYourInboxAt}
                  <span className="font-bold">{userEmail}</span>.{' '}
                  {
                    dictionary.weWillBeSendingYouImportantUpdatesAboutYourAccountStatus
                  }
                </Text>
              </Section>

              <Hr className="mx-0 my-[26px] w-full border border-solid border-[#e6e6e6]" />

              <Text className="text-center text-[12px] leading-[24px] text-muted-foreground">
                {dictionary.thisIsAnAutomatedEmailPleaseDoNotReply}
              </Text>

              <Section className="mt-6 text-center">
                <Text className="m-0 text-[12px] leading-[24px] text-muted-foreground">
                  {dictionary.bestRegardsTheMigosTeam}, <br />{' '}
                  {dictionary.theMigosTeam}
                </Text>
              </Section>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}
