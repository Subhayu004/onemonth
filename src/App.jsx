import { useEffect, useRef, useState } from "react";
import { story } from "./data/story";
import Frame from "./components/Frame";
import Navbar from "./components/Navbar";
import FloatingElements from "./components/FloatingElements";
import Question from "./components/Question";
import FinalScreen from "./components/FinalScreen";

function App() {
  const audioRef = useRef(null);
  const [current, setCurrent] = useState(0);
  const [showQuestion, setShowQuestion] = useState(false);
  const [showFinal, setShowFinal] = useState(false);
  const [needsUserStart, setNeedsUserStart] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const playSong = async () => {
    const audio = audioRef.current;

    if (!audio) return;

    try {
      await audio.play();
      setNeedsUserStart(false);
      setIsPlaying(true);
    } catch {
      setNeedsUserStart(true);
      setIsPlaying(false);
    }
  };

  useEffect(() => {
    playSong();

    const startOnGesture = () => {
      playSong();
    };

    window.addEventListener("pointerdown", startOnGesture, { once: true });
    window.addEventListener("touchstart", startOnGesture, { once: true });
    window.addEventListener("keydown", startOnGesture, { once: true });

    return () => {
      window.removeEventListener("pointerdown", startOnGesture);
      window.removeEventListener("touchstart", startOnGesture);
      window.removeEventListener("keydown", startOnGesture);
    };
  }, []);

  const replay = () => {
    setCurrent(0);
    setShowQuestion(false);
    setShowFinal(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-pink-200 via-purple-200 to-pink-300 relative overflow-hidden">
      {/* live background hearts/candy/teddy */}
      <FloatingElements />

      <Navbar />

      {!showQuestion && !showFinal && (
        <Frame
          image={story[current].image}
          text={story[current].text}
          onNext={() => {
            if (current === story.length - 1) {
              setShowQuestion(true);
            } else {
              setCurrent((p) => p + 1);
            }
          }}
        />
      )}

      {showQuestion && !showFinal && (
        <Question onYes={() => setShowFinal(true)} />
      )}

      {showFinal && <FinalScreen onReplay={replay} />}
      {(needsUserStart || !isPlaying) && (
        <button
          type="button"
          onClick={playSong}
          className="fixed bottom-5 right-5 z-50 rounded-full bg-rose-500 px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-rose-600 focus:outline-none focus:ring-4 focus:ring-rose-300"
        >
          Play Song
        </button>
      )}
      <audio
        ref={audioRef}
        src="/music.mp3"
        loop
        preload="auto"
        playsInline
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />
    </div>
  );
}

export default App;
