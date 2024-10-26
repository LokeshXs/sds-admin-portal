export default function Loading() {
  return (
    <div className="w-full flex justify-center pt-32">
      <div className="flex flex-row gap-2">
        <div className="w-4 h-4 max-sm:w-2 max-sm:h-2 rounded-full bg-primary animate-bounce"></div>
        <div className="w-4 h-4  max-sm:w-2 max-sm:h-2 rounded-full bg-primary animate-bounce [animation-delay:-.3s]"></div>
        <div className="w-4 h-4  max-sm:w-2 max-sm:h-2 rounded-full bg-primary animate-bounce [animation-delay:-.5s]"></div>
      </div>
    </div>
  );
}
