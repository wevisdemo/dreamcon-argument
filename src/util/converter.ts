import { database, get, ref } from "../lib/firebase";
import { Comment, CommentView, Room } from "../types/room";

export const ConvertCommentView = (text: string): CommentView => {
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

export const ConvertRoom = async (id: string, data: any): Promise<Room> => {
  const comments = await Promise.all(
    (data.comment_ids || []).map(async (commentId: string) => {
      const com = await getCommentWithoutChildren(commentId);
      console.log("com => ", com);
      return com;
    })
  );
  return {
    id: id as string,
    title: data.title,
    comments: comments,
    child_node_ids: data.child_node_ids || [],
    created_at: data.created_at,
    updated_at: data.updated_at,
  };
};

export const GetCommentWitChildren = async (
  id: string
): Promise<Comment | null> => {
  const commentRef = ref(database, "comments/" + id);
  try {
    const snapshot = await get(commentRef);
    if (snapshot.exists()) {
      const data = snapshot.val();
      console.log(data);
      return ConvertCommentWithChildren(id, data);
    } else {
      console.log("No data available");
      return null;
    }
  } catch (e) {
    console.error("Error fetching data:", e);
  }
  return null;
};

export const ConvertCommentWithoutChildren = (
  id: string,
  data: any
): Comment => {
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

export const getCommentWithoutChildren = async (
  id: string
): Promise<Comment | null> => {
  const commentRef = ref(database, "comments/" + id);
  try {
    const snapshot = await get(commentRef);
    if (snapshot.exists()) {
      const data = snapshot.val();
      console.log(data);
      return ConvertCommentWithoutChildren(id, data);
    } else {
      console.log("No data available");
      return null;
    }
  } catch (e) {
    console.error("Error fetching data:", e);
  }
  return null;
};

export const ConvertCommentWithChildren = async (
  id: string,
  data: any
): Promise<Comment> => {
  if (data.comment_ids) {
    const comments = Promise.all(
      data.comment_ids.map(async (commentId: string) => {
        return await getCommentWithoutChildren(commentId);
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
    comments: data.comments || [],
    parent_comment_ids: data.parent_comment_ids || [],
    parent_room_id: data.parent_room_id,
    created_at: data.created_at,
    updated_at: data.updated_at,
  };
};
