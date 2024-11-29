import { child, get, push, ref, set, update } from "firebase/database";
import { AddCommentPayload, Comment } from "../types/room";
import { database } from "../lib/firebase";
import { HandleAddChildToRoom } from "./room";

export const HandleDeleteComment = async (comment: Comment) => {
  const commentIds = [comment.id, ...comment.child_node_ids];
  await removeCommentFromRoom(comment.parent_room_id, comment);
  for (const parentId of comment.parent_comment_ids) {
    await removeCommentFromParentComment(parentId, comment);
  }
  await DeleteCommentByIds(commentIds);
};

export const DeleteCommentByIds = async (commentIds: string[]) => {
  const updates = {} as any;
  for (const commentId of commentIds) {
    updates["comments/" + commentId] = null;
  }
  await update(ref(database), updates);
};

const removeCommentFromRoom = async (roomId: string, comment: Comment) => {
  const roomRef = ref(database, "rooms/" + roomId);
  const timeNow = new Date().toISOString();
  await get(roomRef).then(async (snapshot) => {
    if (snapshot.exists()) {
      const data = snapshot.val();
      const commentIds = data.comment_ids || [];
      const filteredCommentIds = commentIds.filter(
        (commentId: string) => commentId !== comment.id
      );
      const childNodeIds = data.child_node_ids || [];
      const filteredChildNodeIds = childNodeIds.filter(
        (childId: string) => !comment.child_node_ids.includes(childId)
      );
      const updates = {
        ["rooms/" + roomId + "/updated_at"]: timeNow,
      };
      if (childNodeIds.length !== filteredChildNodeIds.length) {
        updates["rooms/" + roomId + "/child_node_ids"] = filteredChildNodeIds;
      }
      if (commentIds.length !== filteredCommentIds.length) {
        updates["rooms/" + roomId + "/comment_ids"] = filteredCommentIds;
      }
      await update(ref(database), updates);
    }
  });
};

const removeCommentFromParentComment = async (
  parentCommentId: string,
  comment: Comment
) => {
  const commentRef = ref(database, "comments/" + parentCommentId);
  const timeNow = new Date().toISOString();
  await get(commentRef).then(async (snapshot) => {
    if (snapshot.exists()) {
      const data = snapshot.val();
      const commentIds = data.comment_ids || [];
      const filteredCommentIds = commentIds.filter(
        (commentId: string) => commentId !== comment.id
      );
      const childNodeIds = data.child_node_ids || [];
      const filteredChildNodeIds = childNodeIds.filter(
        (childId: string) => !comment.child_node_ids.includes(childId)
      );

      const updates = {
        ["comments/" + parentCommentId + "/updated_at"]: timeNow,
      };
      if (childNodeIds.length !== filteredChildNodeIds.length) {
        updates["comments/" + parentCommentId + "/child_node_ids"] =
          filteredChildNodeIds;
      }
      if (commentIds.length !== filteredCommentIds.length) {
        updates["comments/" + parentCommentId + "/comment_ids"] =
          filteredCommentIds;
      }
      await update(ref(database), updates);
    }
  });
};

export const HandleEditComment = async (
  commentId: string,
  payload: AddCommentPayload
) => {
  const timeNow = new Date().toISOString();
  const updates = {
    ["comments/" + commentId + "/comment_view"]: payload.comment_view,
    ["comments/" + commentId + "/reason"]: payload.reason,
    ["comments/" + commentId + "/updated_at"]: timeNow,
  };
  await update(ref(database), updates);
};

export const HandleAddCommentToComment = async (
  parentComment: Comment,
  payload: AddCommentPayload
) => {
  const timeNow = new Date().toISOString();
  const dbPayload = {
    comment_view: payload.comment_view,
    reason: payload.reason,
    parent_comment_ids: [
      ...(parentComment?.parent_comment_ids || []),
      parentComment.id,
    ],
    child_node_ids: [],
    parent_room_id: parentComment.parent_room_id,
    like_count: 0,
    created_at: timeNow,
    updated_at: timeNow,
  };
  const newCommentRef = push(ref(database, "comments/"), dbPayload);
  const newCommentId = newCommentRef.key;
  if (!newCommentId) {
    console.error("Error creating new comment");
    return;
  }
  await addCommentToParentComment(parentComment.id, newCommentId);
  await addChildNodeToComments(parentComment.child_node_ids, newCommentId);
  await HandleAddChildToRoom(parentComment.parent_room_id, newCommentId);
};

const addCommentToParentComment = async (
  parentCommentId: string,
  newCommentId: string
) => {
  const commentRef = ref(database, "comments/" + parentCommentId);
  const timeNow = new Date().toISOString();
  await get(commentRef).then(async (snapshot) => {
    if (snapshot.exists()) {
      const data = snapshot.val();
      let commentIds = data.comment_ids || [];
      commentIds = [...commentIds, newCommentId];
      let child_node_ids = data.child_node_ids || [];
      child_node_ids = [...child_node_ids, newCommentId];
      const updates = {
        ["comments/" + parentCommentId + "/comment_ids"]: commentIds,
        ["comments/" + parentCommentId + "/child_node_ids"]: child_node_ids,
        ["comments/" + parentCommentId + "/updated_at"]: timeNow,
      };
      await update(ref(database), updates);
    }
  });
};

export const addChildNodeToComments = async (
  parentCommentIds: string[],
  newCommentId: string
) => {
  for (const parentId of parentCommentIds) {
    const commentRef = ref(database, "comments/" + parentId);
    const timeNow = new Date().toISOString();
    await get(commentRef).then(async (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        let child_node_ids = data.child_node_ids || [];
        child_node_ids = [...child_node_ids, newCommentId];
        const updates = {
          ["comments/" + parentId + "/child_node_ids"]: child_node_ids,
          ["comments/" + parentId + "/updated_at"]: timeNow,
        };
        await update(ref(database), updates);
      }
    });
  }
};
