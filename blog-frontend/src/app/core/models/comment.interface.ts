export interface Comment {
  id: number;
  content: string;
  createdAt: string;
  updatedAt?: string;
  user: {
    id: number;
    username: string;
    fullName: string;
    avatar?: string;
  };
  postId: number;
  parentId?: number | null;
  replies?: Comment[];
  repliesCount: number;
  isLiked?: boolean;
  likesCount: number;
  depth?: number;
}

export interface CreateCommentRequest {
  content: string;
  postId: number;
  parentId?: number;
}