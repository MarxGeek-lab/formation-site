// app/[locale]/LocaleProvider.tsx
import { ReactNode } from "react";
import { NextIntlClientProvider } from "next-intl";

export default async function LocaleProvider({ 
    children, 
    locale 
}: { 
    children: ReactNode; 
    locale: string 
}) {
    const messages = (await import(`@/messages/${locale}.json`)).default;
    return <NextIntlClientProvider locale={locale} messages={messages}>{children}</NextIntlClientProvider>;
}
