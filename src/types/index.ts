export type TNewUser = {
  name: string;
  username: string;
  email: string;
  password: string;
};

export type TUser = {
  id: string;
  name: string;
  username: string;
  email: string;
  imageUrl: string;
  bio: string;
  following: string[];
  followers: string[];
};

export type TContext = {
  user: TUser;
  isLoading: boolean;
  isAuthenticated: boolean;
  setUser: React.Dispatch<React.SetStateAction<TUser>>;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  checkAuthUser: () => Promise<boolean>;
};

export type TNewPost = {
  userId: string;
  caption: string;
  file: File[];
  location: string;
  altText: string;
};

export type TComment = {
  comment: string;
  postId: string;
  parentId?: string;
};
