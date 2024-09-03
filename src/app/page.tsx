'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import axios from 'axios';
import { Check, CopyPlus } from 'lucide-react';
import { FormEvent, useState, useTransition } from 'react';

export default function Home() {
  const [language, setLanguage] = useState('Javascrip');
  const [textareaValue, setTextareaValue] = useState('');
  const [result, setResult] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (textareaValue == '') {
      return;
    }

    startTransition(async () => {
      try {
        const response = await axios.post('/api/openai', {
          language: language,
          prompt: textareaValue,
        });

        setResult(response.data.choices[0].message.content.trim());
      } catch (error) {
        console.error('Error renaming function:', error);
        setResult('Error renaming function');
      }
    });
  };

  const copyTextToClipboard = () => {
    navigator.clipboard.writeText(result);
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-2">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Rename your function with AI</CardTitle>
          <CardDescription>
            Enter your function code below and we willl suggest a more descriptive name.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            <div>
              <Label htmlFor="language">Language</Label>
              <Select
                defaultValue={language}
                onValueChange={setLanguage}
              >
                <SelectTrigger>{language}</SelectTrigger>
                <SelectContent>
                  <SelectItem value="javascript">JavaScript</SelectItem>
                  <SelectItem value="python">Python</SelectItem>
                  <SelectItem value="ruby">Ruby</SelectItem>
                  <SelectItem value="java">Java</SelectItem>
                  <SelectItem value="csharp">C#</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="function-code">Function code or function name</Label>
              <Textarea
                required
                value={textareaValue}
                onChange={(e) => setTextareaValue(e.target.value)}
                id="function-code"
                placeholder="Enter your function code here..."
                className="h-[150px] resize-none"
              />
            </div>

            <div className="relative">
              <Label htmlFor="result">Result</Label>
              <Input
                className="pr-10 "
                value={isPending ? 'Loading...' : result || 'None'}
                readOnly
              />

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      onClick={copyTextToClipboard}
                      className="absolute right-2 top-7"
                      variant={'ghost'}
                      size={'icon'}
                    >
                      {isCopied ? <Check size={20} /> : <CopyPlus size={20} />}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{isCopied ? 'Copiado' : 'Copiar'}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Button
              type="submit"
              className="w-full"
            >
              Rename Function
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
