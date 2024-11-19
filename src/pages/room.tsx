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
  push,
  get,
  increment,
  update,
} from "../lib/firebase";
import { CommentView, Room, Comment, AddCommentPayload } from "../types/room";
import { useParams } from "react-router-dom";

export default function RoomPage(): ReactElement<any> {
  // const room = mockRoom; // TODO: change this to real data
  const { id } = useParams<{ id: string }>();

  const roomId = id as string;

  const [room, setRoom] = useState<Room | null>(null);

  useEffect(() => {
    const dataRef = ref(database, "rooms/" + id);
    onValue(dataRef, async (snapshot: any) => {
      const dbValue = snapshot.val();
      console.log(dbValue);
      if (!dbValue) {
        return;
      }
      const convertedRoom = await convertRoom(dbValue);
      console.log("convertedRoom", convertedRoom);
      setRoom(convertedRoom);
    });
  }, []);

  const convertRoom = async (data: any): Promise<Room> => {
    const comments = await Promise.all(
      (data.comment_ids || []).map(async (commentId: string) => {
        const com = await getComment(commentId);
        console.log("com => ", com);
        return com;
      })
    );
    return {
      id: id as string,
      title: data.title,
      comments: comments,
      created_at: data.created_at,
      updated_at: data.updated_at,
    };
  };

  const getComment = async (id: string): Promise<Comment | null> => {
    const commentRef = ref(database, "comments/" + id);
    try {
      const snapshot = await get(commentRef);
      if (snapshot.exists()) {
        const data = snapshot.val();
        console.log(data);
        return convertCommentLv1(id, data);
      } else {
        console.log("No data available");
        return null;
      }
    } catch (e) {
      console.error("Error fetching data:", e);
    }
    return null;
  };
  const getCommentLv2 = async (id: string): Promise<Comment | null> => {
    const commentRef = ref(database, "comments/" + id);
    try {
      const snapshot = await get(commentRef);
      if (snapshot.exists()) {
        const data = snapshot.val();
        console.log(data);
        return convertCommentLv2(id, data);
      } else {
        console.log("No data available");
        return null;
      }
    } catch (e) {
      console.error("Error fetching data:", e);
    }
    return null;
  };

  const convertCommentLv2 = (id: string, data: any): Comment => {
    return {
      id: id,
      comment_view: ConvertCommentView(data.comment_view),
      reason: data.reason,
      like_count: data.like_count,
      comments: [], // no need to use
      parent_comment_ids: data.parent_comment_ids || [],
      parent_room_id: data.parent_room_id,
      created_at: data.created_at,
      updated_at: data.updated_at,
    };
  };

  const convertCommentLv1 = async (id: string, data: any): Promise<Comment> => {
    if (data.comment_ids) {
      const comments = Promise.all(
        data.comment_ids.map(async (commentId: string) => {
          return await getCommentLv2(commentId);
        })
      );
      return {
        id: id,
        comment_view: ConvertCommentView(data.comment_view),
        reason: data.reason,
        like_count: data.like_count,
        comments: await comments,
        parent_comment_ids: data.parent_comment_ids || [],
        parent_room_id: data.parent_room_id,
        created_at: data.created_at,
        updated_at: data.updated_at,
      };
    }
    return {
      id: id,
      comment_view: ConvertCommentView(data.comment_view),
      reason: data.reason,
      like_count: data.like_count,
      comments: [], // no need to use
      parent_comment_ids: data.parent_comment_ids || [],
      parent_room_id: data.parent_room_id,
      created_at: data.created_at,
      updated_at: data.updated_at,
    };
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

  const handleAddCommentInComment = async (
    commentId: string,
    payload: AddCommentPayload
  ) => {
    console.log("add comment in comment", commentId, payload);
    const timeNow = new Date().toISOString();
    const dbPayload = {
      comment_view: payload.comment_view,
      reason: payload.reason,
      parent_comment_id: [commentId],
      parent_room_id: roomId,
      like_count: 0,
      created_at: timeNow,
      updated_at: timeNow,
    };

    const newCommentRef = push(ref(database, "comments/"), dbPayload);
    const newCommentId = newCommentRef.key;
    const commentRef = ref(database, "comments/" + commentId);
    try {
      await get(commentRef).then((snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          const commentIds = data.comment_ids || [];
          commentIds.push(newCommentId);
          set(
            ref(database, "comments/" + commentId + "/comment_ids"),
            commentIds
          );
          set(ref(database, "comments/" + commentId + "/updated_at"), timeNow);
        }
      });
    } catch (e) {
      console.error("Error fetching data:", e);
    }

    const roomRef = ref(database, "rooms/" + room?.id);
    await get(roomRef).then((snapshot) => {
      if (snapshot.exists()) {
        set(ref(database, "rooms/" + room?.id + "/updated_at"), timeNow);
      }
    });
  };

  const ConvertCommentView = (text: string): CommentView => {
    switch (text) {
      case "เห็นด้วย":
        return CommentView.AGREE;
      case "เห็นด้วยบางส่วน":
        return CommentView.PARTIAL_AGREE;
      case "ไม่เห็นด้วย":
        return CommentView.DISAGREE;
      default:
        return CommentView.AGREE;
    }
  };

  const [addCommentModalOpen, setAddCommentModalOpen] =
    useState<boolean>(false);
  const [addCommentInCommentModalOpen, setAddCommentInCommentModalOpen] =
    useState<boolean>(false);
  const [targetCommentId, setTargetCommentId] = useState<string>("");

  const onSubmitComment = (roomId: string, payload: AddCommentPayload) => {
    const timeNow = new Date().toISOString();
    const dbPayload = {
      comment_view: payload.comment_view,
      reason: payload.reason,
      parent_room_id: roomId,
      like_count: 0,
      created_at: timeNow,
      updated_at: timeNow,
    };

    const newCommentRef = push(ref(database, "comments/"), dbPayload);
    const newCommentId = newCommentRef.key;
    const roomRef = ref(database, "rooms/" + roomId);
    get(roomRef).then((snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const commentIds = data.comment_ids || [];
        commentIds.push(newCommentId);
        set(ref(database, "rooms/" + roomId + "/comment_ids"), commentIds);
        set(ref(database, "rooms/" + roomId + "/updated_at"), timeNow);
      }
    });
  };

  const getCommentsByView = (view: CommentView) => {
    console.log("fetch room", room);
    return (room?.comments || []).filter((c) => c.comment_view === view);
  };

  return room !== null ? (
    <div className="flex flex-col">
      {room != null && <div></div>}
      <section id="hero" className="px-[24px] md:px-[160px] bg-[#BDE6FF]">
        <Hero navigateLink="/" textNavigate="< ข้อถกเถียงทั้งหมด" />
      </section>
      <section
        id="info"
        className="px-[24px] md:px-[160px] py-[24px] md:py-[48px]"
      >
        <TitleCard
          room={room}
          onClickAddComment={() => {
            setAddCommentModalOpen(true);
          }}
        />
        {room.comments && (
          <div className="grid grid-cols-1 md:grid-cols-3 mt-[16px]">
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
                  />
                )
              )}
            </div>
            <div className="w-full flex flex-col gap-[16px] items-center">
              {getCommentsByView(CommentView.DISAGREE).map((comment, index) => (
                <CommentCard
                  onClickLike={() => handleLikeComment(comment.id)}
                  key={`disagree-comment-${index}`}
                  comment={comment}
                  onClickAddComment={() => {
                    setTargetCommentId(comment.id);
                    setAddCommentInCommentModalOpen(true);
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </section>
      <AddCommentModal
        isOpen={addCommentModalOpen}
        onClose={() => setAddCommentModalOpen(false)}
        submitComment={(payload) => onSubmitComment(room.id, payload)}
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
    </div>
  ) : (
    <div></div>
  );
}
