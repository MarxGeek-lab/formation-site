"use client";
import { useEffect, useState } from "react";
import { translate } from "@/utils/translate";

type Props = {
  html: string;
  lang: string;
};

export function TranslateHTML({ html, lang }: Props) {
  const [translated, setTranslated] = useState(html);

  useEffect(() => {
    let mounted = true;
    if (!html) return;

    const doTranslate = async () => {
      const result = await translate(html, lang);
      if (mounted) setTranslated(result);
    };

    doTranslate();

    return () => { mounted = false };
  }, [html, lang]);

  return <div dangerouslySetInnerHTML={{ __html: translated }} />;
}
