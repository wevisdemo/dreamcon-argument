import { ReactElement, useEffect, useState } from "react";
import AddCommentModal from "../components/addCommentModal";
import CommentCard from "../components/commentCard";
import Hero from "../components/hero";
import TitleCard from "../components/rooms/titleCard";
import {
  database,
  ref,
  onValue,
  set,
  get,
  increment,
  update,
} from "../lib/firebase";
import {
  CommentView,
  Room,
  Comment,
  AddCommentPayload,
  AddRoomPayload,
} from "../types/room";
import { useParams } from "react-router-dom";
import {
  HandleAddCommentToRoom,
  HandleDeleteRoom,
  HandleEditRoom,
} from "../util/room";
import AddRoomModal from "../components/addRoomModal";
import {
  HandleAddCommentToComment,
  HandleDeleteComment,
  HandleEditComment,
} from "../util/comment";
import { ConvertRoom, GetCommentWitChildren } from "../util/converter";

export default function RoomPage(): ReactElement<any> {
  // const room = mockRoom; // TODO: change this to real data
  const { id } = useParams<{ id: string }>();

  const roomId = id as string;

  const [room, setRoom] = useState<Room | null>(null);

  useEffect(() => {
    fetchAndWatchRoom();
  }, []);

  const fetchRoom = async () => {
    const roomRef = ref(database, "rooms/" + roomId);
    await get(roomRef).then(async (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const convertedRoom = await ConvertRoom(roomId, data);

        const commentsInRoom = await Promise.all(
          (convertedRoom.comments || []).map(async (comment) => {
            return await GetCommentWitChildren(comment.id);
          })
        );
        const filteredCommentsInRoom = commentsInRoom.filter((c) => c != null);
        convertedRoom.comments = filteredCommentsInRoom as Comment[];

        setRoom(convertedRoom);
      }
    });
  };

  const fetchAndWatchRoom = async () => {
    const dataRef = ref(database, "rooms/" + roomId);
    onValue(dataRef, async (snapshot: any) => {
      const dbValue = snapshot.val();
      if (!dbValue) {
        return;
      }
      const convertedRoom = await ConvertRoom(roomId, dbValue);

      const commentsInRoom = await Promise.all(
        (convertedRoom.comments || []).map(async (comment) => {
          return await GetCommentWitChildren(comment.id);
        })
      );
      const filteredCommentsInRoom = commentsInRoom.filter((c) => c != null);
      convertedRoom.comments = filteredCommentsInRoom as Comment[];

      setRoom(convertedRoom);
    });
  };

  const handleLikeComment = (commentId: string) => {
    const dbRef = ref(database);
    const updates = {
      [`comments/${commentId}/like_count`]: increment(1),
    };
    const timeNow = new Date().toISOString();

    update(dbRef, updates);

    const roomRef = ref(database, "rooms/" + room?.id);
    get(roomRef).then((snapshot) => {
      if (snapshot.exists()) {
        set(ref(database, "rooms/" + room?.id + "/updated_at"), timeNow);
      }
    });
  };

  const handleEditRoom = async (payload: AddRoomPayload) => {
    if (!room) {
      return;
    }
    await HandleEditRoom(room.id, payload);
  };

  const handleAddCommentInComment = async (
    commentId: string,
    payload: AddCommentPayload
  ) => {
    const targetComment = room?.comments.find((c) => c.id === commentId);
    if (!targetComment) {
      return;
    }
    await HandleAddCommentToComment(targetComment, payload);
    fetchRoom();
  };

  const [addCommentModalOpen, setAddCommentModalOpen] =
    useState<boolean>(false);
  const [addCommentInCommentModalOpen, setAddCommentInCommentModalOpen] =
    useState<boolean>(false);
  const [isEditRoomModalOpen, setIsEditRoomModalOpen] = useState(false);
  const [isEditCommentModalOpen, setIsEditCommentModalOpen] = useState(false);

  const [targetCommentId, setTargetCommentId] = useState<string>("");

  const handleAddCommentToRoom = async (
    roomId: string,
    payload: AddCommentPayload
  ) => {
    await HandleAddCommentToRoom(roomId, payload);
  };

  const getCommentsByView = (view: CommentView) => {
    return (room?.comments || []).filter((c) => c.comment_view === view);
  };

  const getCommentById = (id: string) => {
    return room?.comments.find((c) => c.id === id);
  };

  const handleDeleteComment = async (comment: Comment) => {
    await HandleDeleteComment(comment);
  };

  const handleDeleteRoom = async (room: Room) => {
    await HandleDeleteRoom(room);
    window.location.href = "/";
  };

  const handleEditComment = async (
    commentId: string,
    payload: AddCommentPayload
  ) => {
    await HandleEditComment(commentId, payload);
    setIsEditCommentModalOpen(false);
    setTargetCommentId("");
    fetchRoom();
  };

  return room !== null ? (
    <div className="flex flex-col bg-[#F8F8F8]">
      {room != null && <div></div>}
      <section id="hero" className="px-[24px] md:px-[0px] bg-[#BDE6FF]">
        <div className="max-w-[960px] w-full m-auto">
          <Hero navigateLink="/" textNavigate="< ข้อถกเถียงทั้งหมด" />
        </div>
      </section>
      <section
        id="info"
        className="px-[24px] md:px-[0px] py-[24px] md:py-[48px]"
      >
        <div className="max-w-[960px] w-full m-auto">
          <TitleCard
            room={room}
            onClickAddComment={() => {
              setAddCommentModalOpen(true);
            }}
            onClickDelete={() => {
              handleDeleteRoom(room);
            }}
            onClickEdit={() => {
              setIsEditRoomModalOpen(true);
            }}
          />
          {room.comments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 mt-[16px] gap-[16px]">
              <div className=" w-full flex flex-col gap-[16px] items-center">
                {getCommentsByView(CommentView.AGREE).map((comment, index) => (
                  <CommentCard
                    onClickLike={() => handleLikeComment(comment.id)}
                    key={`agree-comment-${index}`}
                    comment={comment}
                    onClickAddComment={() => {
                      setTargetCommentId(comment.id);
                      setAddCommentInCommentModalOpen(true);
                    }}
                    onClickEdit={() => {
                      setTargetCommentId(comment.id);
                      setIsEditCommentModalOpen(true);
                    }}
                    onClickDelete={() => handleDeleteComment(comment)}
                  />
                ))}
              </div>
              <div className="w-full flex flex-col gap-[16px] items-center">
                {getCommentsByView(CommentView.PARTIAL_AGREE).map(
                  (comment, index) => (
                    <CommentCard
                      onClickLike={() => handleLikeComment(comment.id)}
                      key={`partial-agree-comment-${index}`}
                      comment={comment}
                      onClickAddComment={() => {
                        setTargetCommentId(comment.id);
                        setAddCommentInCommentModalOpen(true);
                      }}
                      onClickEdit={() => {
                        setTargetCommentId(comment.id);
                        setIsEditCommentModalOpen(true);
                      }}
                      onClickDelete={() => handleDeleteComment(comment)}
                    />
                  )
                )}
              </div>
              <div className="w-full flex flex-col gap-[16px] items-center">
                {getCommentsByView(CommentView.DISAGREE).map(
                  (comment, index) => (
                    <CommentCard
                      onClickLike={() => handleLikeComment(comment.id)}
                      key={`disagree-comment-${index}`}
                      comment={comment}
                      onClickAddComment={() => {
                        setTargetCommentId(comment.id);
                        setAddCommentInCommentModalOpen(true);
                      }}
                      onClickEdit={() => {
                        setTargetCommentId(comment.id);
                        setIsEditCommentModalOpen(true);
                      }}
                      onClickDelete={() => handleDeleteComment(comment)}
                    />
                  )
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center w-full h-[200px]">
              <span className="wv-ibmplex wv-bold text-[16px] leading-[20px] mt-[16px]">
                ไม่มีความคิดเห็น
              </span>
            </div>
          )}
        </div>
      </section>
      {/* for edit */}
      <AddRoomModal
        isOpen={isEditRoomModalOpen}
        onClose={() => {
          setIsEditRoomModalOpen(false);
        }}
        onAddRoom={(payload) => {
          handleEditRoom(payload);
        }}
        defaultState={room}
      />
      <AddCommentModal
        isOpen={addCommentModalOpen}
        onClose={() => setAddCommentModalOpen(false)}
        submitComment={(payload) => handleAddCommentToRoom(room.id, payload)}
      ></AddCommentModal>
      <AddCommentModal
        isOpen={addCommentInCommentModalOpen}
        onClose={() => {
          setAddCommentInCommentModalOpen(false);
          setTargetCommentId("");
        }}
        submitComment={(payload) =>
          handleAddCommentInComment(targetCommentId, payload)
        }
      ></AddCommentModal>
      {/* for edit comment */}
      <AddCommentModal
        isOpen={isEditCommentModalOpen}
        onClose={() => {
          setIsEditCommentModalOpen(false);
          setTargetCommentId("");
        }}
        submitComment={(payload) => handleEditComment(targetCommentId, payload)}
        defaultState={getCommentById(targetCommentId)}
      ></AddCommentModal>
    </div>
  ) : (
    <div>404</div>
  );
}
