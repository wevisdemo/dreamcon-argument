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
import DeleteModal from "../components/deleteModal";

export default function RoomPage(): ReactElement<any> {
  // const room = mockRoom; // TODO: change this to real data
  const { id } = useParams<{ id: string }>();

  const roomId = id as string;

  const [room, setRoom] = useState<Room | null>(null);

  useEffect(() => {
    fetchAndWatchRoom();
  }, []);

  const fetchRoom = async () => {
    try {
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
          const filteredCommentsInRoom = commentsInRoom.filter(
            (c) => c != null
          );
          convertedRoom.comments = filteredCommentsInRoom as Comment[];

          setRoom(convertedRoom);
        }
      });
    } catch (e) {
      console.error(e);
      setRoom(null);
    }
  };

  const fetchAndWatchRoom = async () => {
    const dataRef = ref(database, "rooms/" + roomId);
    onValue(dataRef, async (snapshot: any) => {
      try {
        const dbValue = snapshot.val();
        if (!dbValue) {
          return;
        }
        const convertedRoom = await ConvertRoom(roomId, dbValue);
        let commentsInRoom: (Comment | null)[] = [];
        try {
          commentsInRoom = await Promise.all(
            (convertedRoom.comments || []).map(async (comment) => {
              return await GetCommentWitChildren(comment.id);
            })
          );
        } catch (e) {
          console.error(e);
        }
        const filteredCommentsInRoom = commentsInRoom.filter((c) => c != null);
        convertedRoom.comments = filteredCommentsInRoom as Comment[];

        setRoom(convertedRoom);
      } catch (e) {
        console.error(e);
        setRoom(null);
      }
    });
  };

  const handleLikeComment = (commentId: string) => {
    try {
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
    } catch (e) {
      console.error(e);
    }
  };

  const handleEditRoom = async (payload: AddRoomPayload) => {
    if (!room) {
      return;
    }
    try {
      await HandleEditRoom(room.id, payload);
    } catch (e) {
      console.error(e);
    }
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

  const [isDeleteRoomModalOpen, setIsDeleteRoomModalOpen] = useState(false);
  const [isDeleteCommentModalOpen, setIsDeleteCommentModalOpen] =
    useState(false);
  const [roomForDelete, setRoomForDelete] = useState<Room | null>(null);
  const [commentForDelete, setCommentForDelete] = useState<Comment | null>(
    null
  );

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
    setCommentForDelete(null);
  };

  const handleDeleteRoom = async (room: Room) => {
    try {
      await HandleDeleteRoom(room);
      setRoomForDelete(null);
      window.location.href = "/";
    } catch (e) {
      console.error(e);
    }
  };

  const handleEditComment = async (
    commentId: string,
    payload: AddCommentPayload
  ) => {
    try {
      await HandleEditComment(commentId, payload);
      setIsEditCommentModalOpen(false);
      setTargetCommentId("");
      fetchRoom();
    } catch (e) {
      console.error(e);
    }
  };

  return room !== null ? (
    <div className="flex flex-col bg-[#F8F8F8]">
      {room != null && <div></div>}
      <section id="hero" className="px-[24px] bg-[#BDE6FF]">
        <div className="max-w-[960px] w-full m-auto">
          <Hero navigateLink="/" textNavigate="< ข้อถกเถียงทั้งหมด" />
        </div>
      </section>
      <section id="info" className="px-[24px] py-[24px] md:py-[48px]">
        <div className="max-w-[960px] w-full m-auto">
          <div className="relative z-10">
            <TitleCard
              room={room}
              onClickAddComment={() => {
                setAddCommentModalOpen(true);
              }}
              onClickDelete={() => {
                setRoomForDelete(room);
                setIsDeleteRoomModalOpen(true);
              }}
              onClickEdit={() => {
                setIsEditRoomModalOpen(true);
              }}
            />
          </div>
          {room.comments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 pt-[16px] gap-[16px] md:gap-[32px] overflow-hidden">
              <div className=" w-full flex flex-col gap-[16px] items-center md:items-end">
                {getCommentsByView(CommentView.AGREE).map((comment, index) => (
                  <div className="relative w-full max-w-[263px]">
                    <div className="left-[-24px] top-[-150%] absolute h-[200%] w-[50%] border-l-[2px] border-b-[2px] border-solid border-[#D4D4D4]" />
                    <div className="relative z-10">
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
                        onClickDelete={() => {
                          setCommentForDelete(comment);
                          setIsDeleteCommentModalOpen(true);
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className=" w-full flex flex-col gap-[16px] items-center md:items-end">
                {getCommentsByView(CommentView.PARTIAL_AGREE).map(
                  (comment, index) => (
                    <div className="relative w-full max-w-[263px]">
                      <div className="left-[-24px] top-[-150%] absolute h-[200%] w-[50%] border-l-[2px] border-b-[2px] border-solid border-[#D4D4D4]" />
                      <div className="relative z-10">
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
                          onClickDelete={() => {
                            setCommentForDelete(comment);
                            setIsDeleteCommentModalOpen(true);
                          }}
                        />
                      </div>
                    </div>
                  )
                )}
              </div>
              <div className="w-full flex flex-col gap-[16px] items-center md:items-end">
                {getCommentsByView(CommentView.DISAGREE).map(
                  (comment, index) => (
                    <div className="relative w-full max-w-[263px]">
                      <div className="left-[-24px] top-[-150%] absolute h-[200%] w-[50%] border-l-[2px] border-b-[2px] border-solid border-[#D4D4D4]" />
                      <div className="relative z-10">
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
                          onClickDelete={() => {
                            setCommentForDelete(comment);
                            setIsDeleteCommentModalOpen(true);
                          }}
                        />
                      </div>
                    </div>
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
        isEdit
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
        isEdit
        isOpen={isEditCommentModalOpen}
        onClose={() => {
          setIsEditCommentModalOpen(false);
          setTargetCommentId("");
        }}
        submitComment={(payload) => handleEditComment(targetCommentId, payload)}
        defaultState={getCommentById(targetCommentId)}
      ></AddCommentModal>
      {/* Delete Room */}
      <DeleteModal
        title="ลบข้อถกเถียงนี้"
        isOpen={isDeleteRoomModalOpen}
        onClose={() => {
          setIsDeleteRoomModalOpen(false);
        }}
        onConfirm={() => {
          if (roomForDelete) {
            handleDeleteRoom(roomForDelete);
          }
        }}
      />
      {/* Delete Comment */}
      <DeleteModal
        title="ลบความคิดเห็นนี้"
        isOpen={isDeleteCommentModalOpen}
        onClose={() => {
          setIsDeleteCommentModalOpen(false);
        }}
        onConfirm={() => {
          if (commentForDelete) {
            handleDeleteComment(commentForDelete);
          }
        }}
      />
    </div>
  ) : (
    <div>404</div>
  );
}
