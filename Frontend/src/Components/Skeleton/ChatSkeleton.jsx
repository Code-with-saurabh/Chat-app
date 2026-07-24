import Skeleton from "../Skeleton/Skeleton";
import "./ChatSkeleton.css";

export default function ChatSkeleton() {
  const fakeMessages = Array.from({ length: 9 }).map((_, i) => ({
    side: i % 2 === 0 ? "left" : "right",
    size: ["sm", "md", "lg"][Math.floor(Math.random() * 3)],
  }));

  return (
    <div className="Chat chatSkeletonWrapper">

      {/* Header */}
      <div className="ChatInfo chatHeaderSk">
        <Skeleton className="chatTitleSk" />
        <div className="iconsSk">
          <Skeleton className="iconSk" />
          <Skeleton className="iconSk" />
          <Skeleton className="iconSk" />
        </div>
      </div>

      {/* Messages */}
      <div className="messagesSk">
        {fakeMessages.map((msg, i) => (
          <div key={i} className={`msgRow ${msg.side}`}>
            {msg.side === "left" && (
              <Skeleton className="avatarMsgSk" />
            )}

            <Skeleton className={`bubbleSk ${msg.size}`} />

            {msg.side === "right" && (
              <Skeleton className="avatarMsgSk" />
            )}
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="inputWrapperSk">
        <Skeleton className="inputSk" />
      </div>

    </div>
  );
}