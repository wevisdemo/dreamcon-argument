import { get, ref, update } from "firebase/database";
import { AddCommentPayload, Comment } from "../types/room";
import { database } from "../lib/firebase";

export const HandleDeleteComment = async (comment: Comment) => {
  const commentIds = [comment.id, ...comment.child_node_ids];
  await removeCommentFromRoom(comment.parent_room_id, comment);
  await DeleteCommentByIds(commentIds);
  for (const parentId of comment.parent_comment_ids) {
    await removeCommentFromParentComment(parentId, comment);
  }
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
