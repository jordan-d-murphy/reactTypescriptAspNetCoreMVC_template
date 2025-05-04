import { TypingText } from "@/components/TypingText";
import bonsaiImage from "@/assets/bonsai.webp";
// import bonsaiImage from "@/assets/bonsai.png";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

export default function HomePage() {
  const [isPageLoading, setIsPageLoading] = useState(true);

  const words = ["amazing", "modern", "fast", "stunning", "secure", "classy", "scalable", "reliable", "fun"];

  useEffect(() => {
    const timeout = setTimeout(() => setIsPageLoading(false), 500); // adjust to your desired delay
    return () => clearTimeout(timeout);
  }, []);

  if (isPageLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="columns-2">
      <div className="flex min-h-screen flex-col items-left justify-center text-left p-15">
        <h1 className="text-7xl font-bold">
          Build{" "}
          <em>
            <TypingText words={words} />
          </em>
        </h1>
        <h1 className="text-7xl font-bold">
          with <em>bonsai</em>
        </h1>
        <h2 className="text-2xl mt-2 text-muted-foreground">
          The <em>Right</em> Template for React with C#
        </h2>
      </div>
      <div className="relative h-screen">
        <img src={bonsaiImage} alt="Positioned image" className="relative top-0 right-0 left-0 p-20" />
      </div>
    </div>
  );
}
