"use client";

import { io, Socket } from "socket.io-client";
import { useState, useEffect, useRef } from "react";
import { createSocket, createSupabaseClient } from "@/app/utils/helperFuncs";
import { SupabaseClient } from "@supabase/supabase-js";
import { Smile } from "lucide-react";
import EmojiPicker from "emoji-picker-react";

interface Message {
  text: string;
  from: string;
}

export default function Page({ params }: { params: { id: number } }) {
  const [roomId, setRoomId] = useState<string | null>(null);
  const [msg, setMsg] = useState<string>("");
  const [uId2, setUId2] = useState<number>(0);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [client, setClient] = useState<SupabaseClient | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiPickerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const supabaseClient = createSupabaseClient();
    setClient(supabaseClient);

    const socketInstance = createSocket();
    setSocket(socketInstance);

    socketInstance.on("connect", () => {
      console.log("Socket connected:", socketInstance.id);
      socketInstance.emit("register", params.id);
    });

    socketInstance.on("notification", (notification) => {
      console.log("Notification received:", notification);
      alert(notification);
    });

    socketInstance.on("message", (message) => {
      console.log("Message received:", message);
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: message, from: String(uId2) },
      ]);
    });

    socketInstance.on("usersOnline", (user) => {
      console.log(user);
    });

    // socketInstance.on("msg", (message) => {
    //   console.log("Msg received:", message);
    //   setMessages((prevMessages) => [
    //     ...prevMessages,
    //     { text: message.msg, from: String(message.from || uId2) },
    //   ]);
    // });

    return () => {
      socketInstance.off("connect");
      socketInstance.off("notification");
      socketInstance.off("message");
      socketInstance.off("msg");
      socketInstance.disconnect();
      console.log("Socket disconnected");
    };
  }, [params.id]);

  const joinRoom = () => {
    if (!uId2) {
      alert("Please enter a valid second user ID.");
      return;
    }

    const uId1 = params.id;
    const rId = uId1 < uId2 ? `${uId1}_${uId2}` : `${uId2}_${uId1}`;
    setRoomId(rId);

    if (socket) {
      socket.emit("joinRoom", { rId, uId1, uId2 });
    } else {
      console.error("Socket is not initialized.");
    }
  };

  const sendMessage = async () => {
    if (!msg.trim()) return;

    if (socket && roomId) {
      // Add message to local state immediately
      const newMessage = { text: msg, from: String(params.id) };
      setMessages((prevMessages) => [...prevMessages, newMessage]);

      // Emit message to socket
      socket.emit("msg", { msg, roomId, from: params.id });

      // Save to Supabase
      try {
        await client?.from("messages").insert({
          from: String(params.id),
          text: msg,
          roomId: roomId,
        });
      } catch (error) {
        console.error("Error saving message:", error);
      }

      setMsg("");
    } else {
      console.error("Socket is not connected or Room ID is null.");
    }
  };

  const fetchMessages = async () => {
    if (!client || !roomId) {
      console.error("Supabase client is not initialized or no room ID.");
      return;
    }

    try {
      const { data, error } = await client
        .from("messages")
        .select("text,from")
        .eq("roomId", roomId)
        .order("created_at", { ascending: true });

      if (error) throw error;
      setMessages(
        data.map((msg) => ({
          ...msg,
          from: String(msg.from),
        }))
      );
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const handleEmojiSelect = (emojiData: { emoji: string }) => {
    setMsg((prevMsg) => prevMsg + emojiData.emoji);
    setShowEmojiPicker(false);
  };

  const handleOutsideClick = (event: MouseEvent) => {
    if (
      emojiPickerRef.current &&
      !emojiPickerRef.current.contains(event.target as Node)
    ) {
      setShowEmojiPicker(false);
    }
  };

  useEffect(() => {
    if (showEmojiPicker) {
      document.addEventListener("click", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [showEmojiPicker]);

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Socket.io Client {params.id}</h1>

      <div className="space-y-4 mb-8">
        <div className="flex gap-2">
          <input
            className="flex-1 px-3 py-2 border rounded text-black"
            type="number"
            placeholder="Enter second user ID"
            value={uId2 || ""}
            onChange={(e) => setUId2(Number(e.target.value))}
          />
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={joinRoom}
          >
            Join Room
          </button>
        </div>
        {roomId && <p className="text-sm">Room ID: {roomId}</p>}
      </div>

      <div className="space-y-4 mb-8">
        <div className="flex gap-2">
          <input
            className="flex-1 px-3 py-2 border rounded text-black"
            type="text"
            placeholder="Type a message..."
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && sendMessage()}
          />
          <button
            className="px-2 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          >
            <Smile size={20} />
            <div
              ref={emojiPickerRef}
              className="absolute"
              onClick={(e) => e.stopPropagation()}
            >
              {showEmojiPicker && (
                <EmojiPicker
                  onEmojiClick={handleEmojiSelect}
                  autoFocusSearch={true}
                />
              )}
            </div>
          </button>
          <button
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            onClick={sendMessage}
          >
            Send
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Messages</h2>
          <button
            className="px-3 py-1 text-sm bg-gray-500 text-white rounded hover:bg-gray-600"
            onClick={fetchMessages}
          >
            Refresh
          </button>
        </div>

        <div className="space-y-2">
          {messages.length > 0 ? (
            messages.map((m, index) => (
              <div
                key={index}
                className={`p-3 rounded ${
                  m.from === String(params.id)
                    ? "bg-blue-500 text-white ml-auto"
                    : "bg-gray-200 text-black"
                } max-w-[80%] break-words`}
              >
                <p>{m.text}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center">No messages yet</p>
          )}
        </div>
      </div>
    </div>
  );
}
