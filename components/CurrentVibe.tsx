import { useCallback, useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type Params = {
  contentedness: number;
  anxiousness: number;
  tiredness: number;
  thoughts: string;
};

export default function CurrentVibe() {
  const contentRef = useRef<HTMLInputElement>(null);
  const anxiousRef = useRef<HTMLInputElement>(null);
  const tiredRef = useRef<HTMLInputElement>(null);
  const thoughtsRef = useRef<HTMLTextAreaElement>(null);

  const queryClient = useQueryClient();
  const postVibe = useMutation<Response, unknown, Params>((vibe) => {
    return fetch("/api/vibes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(vibe),
    });
  });

  const handlePostVibe = useCallback(() => {
    const contentedness = parseInt(contentRef.current?.value ?? "0");
    const anxiousness = parseInt(anxiousRef.current?.value ?? "0");
    const tiredness = parseInt(tiredRef.current?.value ?? "0");
    const thoughts = thoughtsRef.current?.value ?? "";

    postVibe.mutate(
      { contentedness, anxiousness, tiredness, thoughts },
      {
        onSuccess: () => {
          if (contentRef.current) contentRef.current.value = "50";
          if (anxiousRef.current) anxiousRef.current.value = "50";
          if (tiredRef.current) tiredRef.current.value = "50";
          if (thoughtsRef.current) thoughtsRef.current.value = "";

          queryClient.invalidateQueries(["vibes"]);
        },
      }
    );
  }, [postVibe, queryClient]);

  return (
    <div className="card glass shadow-xl">
      <div className="card-body not-prose">
        <h1 className="card-title text-2xl">Current Vibe</h1>
        <div className="flex flex-col gap-2 py-2 pb-4">
          <div className="flex items-center">
            <label className="pr-2">😊</label>
            <input
              ref={contentRef}
              type="range"
              min="0"
              max="100"
              defaultValue="50"
              className="range range-primary"
            />
          </div>
          <div className="flex items-center">
            <label className="pr-2">😳</label>
            <input
              ref={anxiousRef}
              type="range"
              min="0"
              max="100"
              defaultValue="50"
              className="range range-secondary"
            />
          </div>
          <div className="flex items-center">
            <label className="pr-2">😴</label>
            <input
              ref={tiredRef}
              type="range"
              min="0"
              max="100"
              defaultValue="50"
              className="range range-accent"
            />
          </div>
          <div className="flex pt-2">
            <textarea
              ref={thoughtsRef}
              className="w-full textarea textarea-bordered"
              placeholder="I feel..."
            ></textarea>
          </div>
        </div>
        <div className="card-actions justify-end">
          <button
            className={`btn btn-info ${
              postVibe.isLoading ? "btn-disabled" : ""
            }`}
            onClick={handlePostVibe}
          >
            Post Vibe
          </button>
        </div>
      </div>
    </div>
  );
}
