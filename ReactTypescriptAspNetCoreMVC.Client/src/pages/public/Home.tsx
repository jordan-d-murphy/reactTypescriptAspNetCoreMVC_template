import { TypingText } from "@/components/TypingText";
import bonsaiImage from "../../assets/bonsai-main.jpg";

export default function HomePage() {
  const words = ["amazing", "modern", "fast", "stunning", "secure", "classy", "scalable", "reliable", "fun"];
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
