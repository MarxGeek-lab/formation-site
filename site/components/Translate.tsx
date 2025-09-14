"use client";

import { useEffect, useState } from "react";
import { translate } from "@/utils/translate";

type TranslateProps = {
  text: string;
  lang: string; // ex: "EN", "FR"
};

export function Translate({ text, lang }: TranslateProps) {
  const [translated, setTranslated] = useState<string>(text);

  useEffect(() => {
    let mounted = true;

    const doTranslate = async () => {
      const result = await translate(text, lang);
      if (mounted) {
        setTranslated(result);
      }
    };

    doTranslate();

    return () => {
      mounted = false;
    };
  }, [text, lang]);

  return <>{translated}</>;
}
