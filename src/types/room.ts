export interface Room {
  id: string;
  title: string;
  comments: Comment[];
  child_node_ids: string[];
  created_at: string;
  updated_at: string;
}

export interface AddRoomPayload {
  title: string;
}

export interface AddCommentPayload {
  comment_view: CommentView;
  reason: string;
}

export interface Comment {
  id: string;
  comment_view: CommentView;
  reason: string;
  like_count: number;
  parent_room_id: string;
  parent_comment_ids: string[];
  comments: Comment[];
  created_at: string;
  updated_at: string;
}

export enum CommentView {
  AGREE = "เห็นด้วย",
  PARTIAL_AGREE = "เห็นด้วยบางส่วน",
  DISAGREE = "ไม่เห็นด้วย",
}
