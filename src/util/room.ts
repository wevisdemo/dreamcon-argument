import { get, push, ref, set, update } from "firebase/database";
import { AddCommentPayload, AddRoomPayload, Room } from "../types/room";
import { database } from "../lib/firebase";

export const HandleDeleteRoom = async (room: Room) => {
  const updates = {} as any;
  const roomRef = ref(database, "rooms/" + room.id);
  set(roomRef, null);
  for (const childId of room.child_node_ids || []) {
    updates["/comments/" + childId] = null;
  }
  await update(ref(database), updates);
};

export const HandleAddCommentToRoom = async (
  roomId: string,
  payload: AddCommentPayload
) => {
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
      let commentIds = data.comment_ids || [];
      commentIds = [...commentIds, newCommentId];
      let child_node_ids = data.child_node_ids || [];
      child_node_ids = [...child_node_ids, newCommentId];
      const updates = {
        ["rooms/" + roomId + "/comment_ids"]: commentIds,
        ["rooms/" + roomId + "/child_node_ids"]: child_node_ids,
        ["rooms/" + roomId + "/updated_at"]: timeNow,
      };
      update(ref(database), updates);
    }
  });
};

export const HandleEditRoom = async (
  roomId: string,
  payload: AddRoomPayload
) => {
  const timeNow = new Date().toISOString();
  const updates = {
    ["rooms/" + roomId + "/title"]: payload.title,
    ["rooms/" + roomId + "/updated_at"]: timeNow,
  };
  await update(ref(database), updates);
};

export const HandleAddChildToRoom = async (
  roomId: string,
  commentId: string
) => {
  const roomRef = ref(database, "rooms/" + roomId);
  const timeNow = new Date().toISOString();
  await get(roomRef).then(async (snapshot) => {
    if (snapshot.exists()) {
      const data = snapshot.val();
      let child_node_ids = data.child_node_ids || [];
      child_node_ids = [...child_node_ids, commentId];
      const updates = {
        ["rooms/" + roomId + "/child_node_ids"]: child_node_ids,
        ["rooms/" + roomId + "/updated_at"]: timeNow,
      };
      await update(ref(database), updates);
    }
  });
};
