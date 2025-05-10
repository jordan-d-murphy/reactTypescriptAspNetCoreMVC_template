import { TypingText } from "@/components/TypingText";
import bonsaiImage from "@/assets/bonsai.webp";
// import bonsaiImage from "@/assets/bonsai.png";
import { useEffect, useState } from "react";
import { Loader2, Terminal } from "lucide-react";
import { CommandPalette } from "@/components/CommandPalette";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

// export default function HomePage() {
//   const [isPageLoading, setIsPageLoading] = useState(true);

//   const words = ["amazing", "modern", "fast", "stunning", "secure", "classy", "scalable", "reliable", "fun"];

//   useEffect(() => {
//     const timeout = setTimeout(() => setIsPageLoading(false), 500); // adjust to your desired delay
//     return () => clearTimeout(timeout);
//   }, []);

//   if (isPageLoading) {
//     return (
//       <div className="flex h-screen items-center justify-center">
//         <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
//       </div>
//     );
//   }

//   return (
//     <div className="columns-2">
//       <div className="flex min-h-screen flex-col items-left justify-center text-left p-15">
//         <h1 className="text-7xl font-bold">
//           Build{" "}
//           <em>
//             <TypingText words={words} />
//           </em>
//         </h1>
//         <h1 className="text-7xl font-bold">
//           with <em>bonsai</em>
//         </h1>
//         <h2 className="text-2xl mt-2 text-muted-foreground">
//           The <em>Right</em> Template for React with C#
//         </h2>
//       </div>
//       <div className="relative h-screen">
//         <img src={bonsaiImage} alt="Positioned image" className="relative top-0 right-0 left-0 p-20" />
//       </div>
//     </div>
//   );
// }

export default function HomePage() {
  const [isPageLoading, setIsPageLoading] = useState(true);

  const words = ["amazing", "modern", "fast", "stunning", "secure", "classy", "scalable", "reliable", "fun"];

  useEffect(() => {
    const timeout = setTimeout(() => setIsPageLoading(false), 500);
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
    <div className="min-h-screen flex items-center justify-center bg-background px-4 sm:px-8">
      {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl w-full items-center"> */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl w-full items-center">
        {/* Text Block */}
        {/* <div className="text-left"> */}
        <div className="text-left md:pr-4">
          <h1 className="text-5xl sm:text-6xl font-bold leading-tight">
            Build{" "}
            <em>
              <TypingText words={words} />
            </em>
          </h1>
          <h1 className="text-5xl sm:text-6xl font-bold leading-tight mt-2">
            with <em>bonsai</em>
          </h1>
          <h2 className="text-xl sm:text-2xl mt-4 mb-4 text-muted-foreground">
            The <em>Right</em> Template for React with C#
          </h2>

          <Alert className="w-full max-w-lg glow-sweep rounded-md">
            <Terminal className="h-4 w-4" />
            <AlertTitle>Meet ⌘J</AlertTitle>
            <AlertDescription>Get started from anywhere in the app.</AlertDescription>
          </Alert>
        </div>

        <img
          src={bonsaiImage}
          alt="bonsai"
          className="max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg rounded-md shadow-lg"
        />
      </div>
    </div>
  );
}
