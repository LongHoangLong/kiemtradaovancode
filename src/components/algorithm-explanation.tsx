
"use client";

import React, { useMemo } from 'react';
import { PlagiarismDetails } from "@/types/plagiarism";
import { useLanguage } from '@/contexts/language-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { ScrollArea } from './ui/scroll-area';

interface AlgorithmExplanationProps {
  details: PlagiarismDetails;
}

const Section: React.FC<{ title: string; description: string; children: React.ReactNode }> = ({ title, description, children }) => (
  <div className="space-y-4">
    <div className="space-y-1">
      <h3 className="text-base font-semibold">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
    {children}
  </div>
);

const TokenTable: React.FC<{ tokens: string[] }> = ({ tokens }) => (
    <ScrollArea className="h-48 w-full rounded-md border">
        <Table className="text-xs">
            <TableBody>
            {tokens.map((token, index) => (
                <TableRow key={index}>
                <TableCell className="px-2 py-1 font-mono">{token}</TableCell>
                </TableRow>
            ))}
            </TableBody>
        </Table>
    </ScrollArea>
);

const FrequencyTable: React.FC<{ map: [string, number][] }> = ({ map }) => (
    <ScrollArea className="h-48 w-full rounded-md border">
      <Table className="text-xs">
        <TableHeader>
          <TableRow>
            <TableHead className="px-2 py-1">{useLanguage().t.token}</TableHead>
            <TableHead className="px-2 py-1 text-right">{useLanguage().t.frequency}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {map.map(([token, freq]) => (
            <TableRow key={token}>
              <TableCell className="px-2 py-1 font-mono">{token}</TableCell>
              <TableCell className="px-2 py-1 text-right">{freq}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </ScrollArea>
);

const IntersectionTable: React.FC<{ commonTokens: { token: string, count: number }[] }> = ({ commonTokens }) => {
    const { t } = useLanguage();
    return (
        <ScrollArea className="h-48 w-full rounded-md border">
          <Table className="text-xs">
            <TableHeader>
              <TableRow>
                <TableHead className="px-2 py-1">{t.token}</TableHead>
                <TableHead className="px-2 py-1 text-right">{t.minFrequency}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {commonTokens.map(({ token, count }) => (
                <TableRow key={token}>
                  <TableCell className="px-2 py-1 font-mono">{token}</TableCell>
                  <TableCell className="px-2 py-1 text-right">{count}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      );
}

export const AlgorithmExplanation: React.FC<AlgorithmExplanationProps> = ({ details }) => {
  const { t } = useLanguage();
  const { tokensA, tokensB, mapA, mapB } = details;

  const { commonTokens, intersectionSize } = useMemo(() => {
    const common = [];
    let intersection = 0;
    const mapAObj = new Map(mapA);
    const mapBObj = new Map(mapB);

    const allKeys = new Set([...mapAObj.keys(), ...mapBObj.keys()]);
    for (const token of allKeys) {
      if (mapAObj.has(token) && mapBObj.has(token)) {
        const count = Math.min(mapAObj.get(token)!, mapBObj.get(token)!);
        common.push({ token, count });
        intersection += count;
      }
    }
    return { commonTokens: common.sort((a,b) => b.count - a.count), intersectionSize: intersection };
  }, [mapA, mapB]);

  const totalTokens = tokensA.length + tokensB.length;
  const similarity = totalTokens > 0 ? (2 * intersectionSize / totalTokens) * 100 : 0;


  return (
    <Card className="bg-muted/30">
      <CardContent className="p-6 space-y-8">
        {/* Step 1 */}
        <Section title={t.step1Title} description={t.step1Description}>
           <div className="grid grid-cols-2 gap-4">
                <TokenTable tokens={tokensA} />
                <TokenTable tokens={tokensB} />
           </div>
        </Section>

        {/* Step 2 */}
        <Section title={t.step2Title} description={t.step2Description}>
            <div className="grid grid-cols-2 gap-4">
                <FrequencyTable map={mapA} />
                <FrequencyTable map={mapB} />
            </div>
        </Section>
        
        {/* Step 3 */}
        <Section title={t.step3Title} description={t.step3Description}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                     <p className="text-sm font-medium mb-2">{t.commonTokens}</p>
                    <IntersectionTable commonTokens={commonTokens} />
                </div>
                <div>
                    <p className="text-sm font-medium mb-2">{t.step3Formula}</p>
                    <Card>
                        <CardContent className="p-4 space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span>{t.totalCommonTokens}:</span>
                                <span className="font-mono">{intersectionSize}</span>
                            </div>
                             <div className="flex justify-between">
                                <span>{t.totalTokensFileA}:</span>
                                <span className="font-mono">{tokensA.length}</span>
                            </div>
                             <div className="flex justify-between">
                                <span>{t.totalTokensFileB}:</span>
                                <span className="font-mono">{tokensB.length}</span>
                            </div>
                            <hr className="my-2"/>
                             <div className="flex justify-between font-semibold">
                                <span>{t.calculation}:</span>
                                <span className="font-mono text-right">(2 * {intersectionSize}) / ({tokensA.length} + {tokensB.length}) = {similarity.toFixed(2)}%</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </Section>
      </CardContent>
    </Card>
  );
};

    