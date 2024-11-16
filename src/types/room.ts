export interface Room {
  id: string;
  title: string;
  comments: Comment[];
  agree_count: number;
  category: string;
  disagree_count: number;
  partial_agree_count: number;
  created_at: string;
  updated_at: string;
}

export interface AddRoomPayload {
  title: string;
}

export interface Comment {
  id: string;
  comment_view: CommentView;
  reason: string;
  agree_count: number;
  disagree_count: number;
  partial_agree_count: number;
  like_count: number;
  comments: Comment[];
  created_at: string;
  updated_at: string;
}

export enum CommentView {
  AGREE = "เห็นด้วย",
  PARTIAL_AGREE = "เห็นด้วยบางส่วน",
  DISAGREE = "ไม่เห็นด้วย",
}
