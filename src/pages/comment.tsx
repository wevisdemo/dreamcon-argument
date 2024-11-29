import CommentCard from "../components/commentCard";
import { CommentView, Comment, Room, AddCommentPayload } from "../types/room";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  database,
  get,
  increment,
  onValue,
  push,
  ref,
  set,
  update,
} from "../lib/firebase";
import { ConvertRoom, GetCommentWitChildren } from "../util/converter";
import AddCommentModal from "../components/addCommentModal";
import {
  HandleAddCommentToComment,
  HandleDeleteComment,
  HandleEditComment,
} from "../util/comment";
import DeleteModal from "../components/deleteModal";

interface MapComment {
  [id: string]: Comment;
}

export default function CommentPage() {
  const { id } = useParams<{ id: string }>();
  const [mapParentComment, setMapParentComment] = useState<MapComment>({});
  const [room, setRoom] = useState<Room | null>(null);
  const [comment, setComment] = useState<Comment | null>(null);
  const [addCommentModalOpen, setAddCommentModalOpen] =
    useState<boolean>(false);
  const [addCommentInCommentModalOpen, setAddCommentInCommentModalOpen] =
    useState<boolean>(false);
  const [addCommentInParentModalOpen, setAddCommentInParentModalOpen] =
    useState<boolean>(false);
  const [targetAddCommentId, setTargetAddCommentId] = useState<string>("");
  const [editCommentModalOpen, setEditCommentModalOpen] =
    useState<boolean>(false);
  const [targetEditComment, setTargetEditComment] = useState<Comment | null>(
    null
  );
  const [isDeleteCommentModalOpen, setIsDeleteCommentModalOpen] =
    useState(false);
  const [commentForDelete, setCommentForDelete] = useState<Comment | null>(
    null
  );

  const commentId = id as string;

  const x = new Date("2323");

  const parentComments = () => {
    const result = Object.values(mapParentComment);
    result.sort((a, b) => {
      return new Date(a.created_at) < new Date(b.created_at) ? -1 : 1;
    });
    return result;
  };

  useEffect(() => {
    fetchAndWatchComment();
  }, []);

  useEffect(() => {
    if (comment) {
      fetchAndWatchRoom();
      fetchAndWatchParentComments();
    }
  }, [comment]);

  const fetchComment = async () => {
    try {
      const commentRef = ref(database, "comments/" + commentId);
      await get(commentRef).then(async (snapshot) => {
        if (snapshot.exists()) {
          const convertedComment = await GetCommentWitChildren(commentId);
          if (convertedComment == null) {
            return;
          }
          const commentsInComment = await Promise.all(
            (convertedComment.comments || []).map(async (comment) => {
              return await GetCommentWitChildren(comment.id);
            })
          );
          const filteredCommentsInComment = commentsInComment.filter(
            (c) => c != null
          );
          convertedComment.comments = filteredCommentsInComment as Comment[];
          setComment(convertedComment);
        }
      });
    } catch (e) {
      console.error("Error fetching data:", e);
    }
  };

  const fetchAndWatchComment = async () => {
    try {
      const commentRef = ref(database, "comments/" + commentId);
      onValue(commentRef, async (snapshot: any) => {
        const commentData = snapshot.val();
        if (commentData) {
          const convertedComment = await GetCommentWitChildren(commentId);
          if (convertedComment == null) {
            return;
          }
          const commentsInComment = await Promise.all(
            (convertedComment.comments || []).map(async (comment) => {
              return await GetCommentWitChildren(comment.id);
            })
          );
          const filteredCommentsInComment = commentsInComment.filter(
            (c) => c != null
          );
          convertedComment.comments = filteredCommentsInComment as Comment[];

          setComment(convertedComment);
        }
      });
    } catch (e) {
      console.error("Error fetching data:", e);
    }
  };

  const fetchAndWatchRoom = async () => {
    if (!comment) {
      return;
    }
    try {
      const roomRef = ref(database, "rooms/" + comment.parent_room_id);
      onValue(roomRef, async (snapshot: any) => {
        const roomData = snapshot.val();

        if (roomData) {
          const convertedRoom = await ConvertRoom(
            comment.parent_room_id,
            roomData
          );
          setRoom(convertedRoom);
        }
      });
    } catch (e) {
      console.error("Error fetching data:", e);
    }
  };

  const fetchAndWatchParentComments = async () => {
    if (!comment) {
      return;
    }
    try {
      for (const id of comment.parent_comment_ids) {
        const commentRef = ref(database, "comments/" + id);
        onValue(commentRef, async (snapshot: any) => {
          const comment = snapshot.val();
          if (comment) {
            const convertedComment = await GetCommentWitChildren(id);
            if (convertedComment != null) {
              setMapParentComment((prev) => ({
                ...prev,
                [id]: convertedComment,
              }));
            }
          }
        });
      }
    } catch (e) {
      console.error("Error fetching data:", e);
    }
  };

  const getCommentsByView = (view: CommentView) => {
    return (comment?.comments || []).filter((c) => c.comment_view === view);
  };

  const handleLikeChildComment = (targetCommentId: string) => {
    try {
      const dbRef = ref(database);
      const updates = {
        [`comments/${targetCommentId}/like_count`]: increment(1),
      };
      update(dbRef, updates);
    } catch (e) {
      console.error("Error updating data:", e);
    }

    fetchComment();
  };

  const handleLikeComment = () => {
    if (!comment) {
      return;
    }
    try {
      const dbRef = ref(database);
      const updates = {
        [`comments/${commentId}/like_count`]: increment(1),
      };
      update(dbRef, updates);
    } catch (e) {
      console.error("Error updating data:", e);
    }
  };

  const handleAddCommentToCurrentComment = async (
    payload: AddCommentPayload
  ) => {
    if (!comment) {
      return;
    }
    try {
      await HandleAddCommentToComment(comment, payload);
    } catch (e) {
      console.error("Error updating data:", e);
    }
  };

  const handleAddCommentToParentComment = async (
    targetCommentId: string,
    payload: AddCommentPayload
  ) => {
    const targetComment = mapParentComment[targetCommentId];
    if (targetComment) {
      try {
        await HandleAddCommentToComment(targetComment, payload);
      } catch (e) {
        console.error("Error updating data:", e);
      }
    }
  };

  const getChildCommentById = (id: string): Comment | undefined => {
    if (!comment) {
      return undefined;
    }

    return comment?.comments.find((c) => c.id === id);
  };

  const handleCommentInChildComment = async (
    targetCommentId: string,
    payload: AddCommentPayload
  ) => {
    const targetComment = getChildCommentById(targetCommentId);
    if (targetComment) {
      try {
        await HandleAddCommentToComment(targetComment, payload);
      } catch (e) {
        console.error("Error updating data:", e);
      }

      fetchComment();
    }
  };

  const handleDeleteComment = async (targetComment: Comment) => {
    const redirect =
      targetComment.id === commentId ||
      comment?.parent_comment_ids.includes(targetComment.id);

    try {
      await HandleDeleteComment(targetComment);
      setCommentForDelete(null);
      if (redirect) {
        window.location.href = "/";
      }
    } catch (e) {
      console.error("Error updating data:", e);
    }
  };

  const handleEditComment = async (
    commentId: string,
    payload: AddCommentPayload
  ) => {
    try {
      await HandleEditComment(commentId, payload);
      setTargetEditComment(null);
      setEditCommentModalOpen(false);
    } catch (e) {
      console.error("Error updating data:", e);
    }

    fetchComment();
  };

  return (
    <div>
      {comment != null && room != null ? (
        <div className="flex flex-col bg-[#F8F8F8]">
          {comment != null && room != null ? <div /> : <div>Loading...</div>}
          <section
            id="header"
            className="px-[16px] py-[8px] md:py-[16px] bg-[#BDE6FF]"
          >
            <div className="max-w-[960px] w-full m-auto">
              <a
                href={`/rooms/${room?.id}`}
                className="wv-ibmplex wv-semibold text-[#1C4CD3] underline "
              >
                {"< ข้อถกเถียง"}
              </a>
            </div>
          </section>
          <section className="px-[16px]">
            <div className="max-w-[960px] w-full m-auto">
              <h4 className="wv-ibmplex wv-bold text-[16px] md:text-[25px] bg-[#FFFFFF] rounded-b-[8px] drop-shadow-md p-[16px] md:p-[24px]">
                {room?.title}
              </h4>
            </div>
          </section>
          <section className="p-[24px] pt-0">
            <div className="max-w-[960px] w-full m-auto">
              {parentComments().map((parentComment) => (
                <div
                  className="mt-[40px] w-full"
                  key={`parent-comment-${parentComment.id}`}
                >
                  <CommentCard
                    comment={parentComment}
                    fullWidth
                    onClickLike={() => handleLikeChildComment(parentComment.id)}
                    onClickAddComment={() => {
                      setTargetAddCommentId(parentComment.id);
                      setAddCommentInParentModalOpen(true);
                    }}
                    onClickEdit={() => {
                      setTargetEditComment(parentComment);
                      setEditCommentModalOpen(true);
                    }}
                    onClickDelete={() => {
                      setCommentForDelete(parentComment);
                      setIsDeleteCommentModalOpen(true);
                    }}
                  />
                </div>
              ))}
              <div className="mt-[40px] w-full">
                <CommentCard
                  comment={comment}
                  fullWidth
                  onClickLike={() => handleLikeComment()}
                  onClickAddComment={() => {
                    setAddCommentModalOpen(true);
                  }}
                  onClickEdit={() => {
                    setTargetEditComment(comment);
                    setEditCommentModalOpen(true);
                  }}
                  onClickDelete={() => {
                    setCommentForDelete(comment);
                    setIsDeleteCommentModalOpen(true);
                  }}
                />
              </div>
              {comment.comments.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 pt-[32px] md:pt-[16px] pl-[32px] gap-[16px] md:gap-[32px] overflow-hidden">
                  <div className=" w-full flex flex-col gap-[16px] items-center md:items-end">
                    {getCommentsByView(CommentView.AGREE).map(
                      (targetComment, index) => (
                        <div className="relative w-full max-w-[263px]">
                          <div className="left-[-24px] top-[-150%] absolute h-[200%] w-[50%] border-l-[2px] border-b-[2px] border-solid border-[#D4D4D4]" />
                          <div className="relative z-10">
                            <CommentCard
                              onClickLike={() =>
                                handleLikeChildComment(targetComment.id)
                              }
                              key={`agree-comment-${index}`}
                              comment={targetComment}
                              onClickAddComment={() => {
                                setTargetAddCommentId(targetComment.id);
                                setAddCommentInCommentModalOpen(true);
                              }}
                              onClickEdit={() => {
                                setTargetEditComment(targetComment);
                                setEditCommentModalOpen(true);
                              }}
                              onClickDelete={() => {
                                setCommentForDelete(targetComment);
                                setIsDeleteCommentModalOpen(true);
                              }}
                            />
                          </div>
                        </div>
                      )
                    )}
                  </div>
                  <div className="w-full flex flex-col gap-[16px] items-center md:items-end">
                    {getCommentsByView(CommentView.PARTIAL_AGREE).map(
                      (targetComment, index) => (
                        <div className="relative w-full max-w-[263px]">
                          <div className="left-[-24px] top-[-150%] absolute h-[200%] w-[50%] border-l-[2px] border-b-[2px] border-solid border-[#D4D4D4]" />
                          <div className="relative z-10">
                            <CommentCard
                              onClickLike={() =>
                                handleLikeChildComment(targetComment.id)
                              }
                              key={`partial-agree-comment-${index}`}
                              comment={targetComment}
                              onClickAddComment={() => {
                                setTargetAddCommentId(targetComment.id);
                                setAddCommentInCommentModalOpen(true);
                              }}
                              onClickEdit={() => {
                                setTargetEditComment(targetComment);
                                setEditCommentModalOpen(true);
                              }}
                              onClickDelete={() => {
                                setCommentForDelete(targetComment);
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
                      (targetComment, index) => (
                        <div className="relative w-full max-w-[263px]">
                          <div className="left-[-24px] top-[-150%] absolute h-[200%] w-[50%] border-l-[2px] border-b-[2px] border-solid border-[#D4D4D4]" />
                          <div className="relative z-10">
                            <CommentCard
                              onClickLike={() =>
                                handleLikeChildComment(targetComment.id)
                              }
                              key={`disagree-comment-${index}`}
                              comment={targetComment}
                              onClickAddComment={() => {
                                setTargetAddCommentId(targetComment.id);
                                setAddCommentInCommentModalOpen(true);
                              }}
                              onClickEdit={() => {
                                setTargetEditComment(targetComment);
                                setEditCommentModalOpen(true);
                              }}
                              onClickDelete={() => {
                                setCommentForDelete(targetComment);
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
          <AddCommentModal
            isOpen={addCommentModalOpen}
            onClose={() => setAddCommentModalOpen(false)}
            submitComment={(payload) =>
              handleAddCommentToCurrentComment(payload)
            }
          ></AddCommentModal>
          <AddCommentModal
            isOpen={addCommentInCommentModalOpen}
            onClose={() => {
              setAddCommentInCommentModalOpen(false);
              setTargetAddCommentId("");
            }}
            submitComment={(payload) =>
              handleCommentInChildComment(targetAddCommentId, payload)
            }
          ></AddCommentModal>
          <AddCommentModal
            isOpen={addCommentInParentModalOpen}
            onClose={() => {
              setAddCommentInParentModalOpen(false);
              setTargetAddCommentId("");
            }}
            submitComment={(payload) =>
              handleAddCommentToParentComment(targetAddCommentId, payload)
            }
          ></AddCommentModal>
          <AddCommentModal
            isEdit
            isOpen={editCommentModalOpen}
            onClose={() => {
              setTargetEditComment(null);
              setEditCommentModalOpen(false);
            }}
            submitComment={(payload) =>
              handleEditComment(targetEditComment?.id || "", payload)
            }
            defaultState={targetEditComment || undefined}
          ></AddCommentModal>
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
      )}
    </div>
  );
}
