"use client";

import { useLanguage } from "@/contexts/language-context";
import { LanguageSwitcher } from "@/components/language-switcher";
import { Code2 } from "lucide-react";

export function Header() {
  const { t } = useLanguage();

  return (
    <header className="py-4 px-4 sm:px-6 lg:px-8 border-b bg-card">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Code2 className="h-7 w-7 md:h-8 md:w-8 text-primary" />
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-foreground">
            {t.appName}
          </h1>
        </div>
        <LanguageSwitcher />
      </div>
    </header>
  );
}
