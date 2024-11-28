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
  const previewText = `Welcome to Migos! 🎉`

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="mx-auto my-auto bg-gradient-to-br from-[#f8ffed] to-[#fff8ed] font-cooperBlack">
          <Container className="mx-auto my-[60px] max-w-[500px] rounded-2xl border-[3px] border-solid border-[#503520] bg-white p-[32px] shadow-[8px_8px_0px_0px_rgba(80,53,32,0.25)]">
            <Section className="mt-[32px]">
              <Section className="mb-8 rounded-xl bg-gradient-to-br from-[#503520]/15 to-[#503520]/5 p-8 shadow-[5px_5px_0px_0px_rgba(80,53,32,0.15)]">
                <Text className="m-0 text-[28px] font-bold leading-[32px] text-[#503520]">
                  {dictionary.welcome} ✨
                </Text>
                <Text className="mt-4 text-[18px] leading-[28px] text-[#666]">
                  {dictionary.weAreExcitedToHaveYouJoinUs}{' '}
                  <Link
                    href={env.NEXT_PUBLIC_BASE_URL}
                    className="font-bold text-[#503520] no-underline hover:underline"
                  >
                    Migos
                  </Link>
                </Text>
              </Section>

              <Section className="my-8 rounded-xl bg-[#fafafa] p-6 shadow-[5px_5px_0px_0px_rgba(80,53,32,0.15)]">
                <Text className="m-0 text-[18px] leading-[28px] text-[#503520]">
                  🎯 {dictionary.weveReceivedYourPreRegistrationRequest}
                </Text>
              </Section>

              <Section className="my-8 rounded-xl bg-gradient-to-br from-[#503520]/10 to-[#503520]/5 p-6 shadow-[5px_5px_0px_0px_rgba(80,53,32,0.15)]">
                <Text className="m-0 text-[18px] leading-[28px] text-[#503520]">
                  📧 {dictionary.inTheMeantimeKeepAnEyeOnYourInboxAt}{' '}
                  <span className="font-bold underline decoration-[#503520]/30 decoration-2">
                    {userEmail}
                  </span>
                  .{' '}
                  {
                    dictionary.weWillBeSendingYouImportantUpdatesAboutYourAccountStatus
                  }
                </Text>
              </Section>

              <Hr className="mx-0 my-[32px] w-full border-[2.5px] border-dashed border-[#503520]/20" />

              <Text className="text-center text-[16px] leading-[24px] text-[#888]">
                {dictionary.thisIsAnAutomatedEmailPleaseDoNotReply}
              </Text>

              <Section className="mt-8 text-center">
                <Text className="m-0 text-[16px] leading-[24px] text-[#666]">
                  {dictionary.bestRegardsTheMigosTeam}, <br />
                  <span className="font-bold text-[#503520]">
                    {dictionary.theMigosTeam} 🚀
                  </span>
                </Text>
              </Section>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}
