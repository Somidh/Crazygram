import { TComment, TNewPost, TNewUser, TUpdatePost } from "@/types";
import { ID, Query } from "appwrite";
import Error from "next/error";
import { account, appwriteConfig, avatars, databases, storage } from "./config";

export async function createUserAccount(user: TNewUser) {
  try {
    const newAccount = await account.create(
      ID.unique(),
      user.email,
      user.password,
      user.name,
    );
    if (!newAccount) throw Error;

    const avatarUrl = avatars.getInitials(user.name);
    const newUser = await saveUserToDb({
      accountId: newAccount.$id,
      email: newAccount.email,
      name: newAccount.name,
      imageUrl: avatarUrl,
      username: user.username,
    });

    return newUser;
  } catch (error) {
    console.log(error);
    return error;
  }
}

export async function saveUserToDb(user: {
  accountId: string;
  email: string;
  name: string;
  imageUrl: URL;
  username?: string;
}) {
  try {
    const newUser = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      ID.unique(),
      user,
    );

    return newUser;
  } catch (error) {
    console.log(error);
  }
}

export async function signInAccount(user: { email: string; password: string }) {
  try {
    const session = await account.createEmailSession(user.email, user.password);

    if (!session) throw Error;

    return session;
  } catch (error) {
    console.log(error);
  }
}

export async function signOutAccount() {
  try {
    const session = await account.deleteSession("current");
    console.log("Signing out");
    return session;
  } catch (error) {
    console.log(error);
  }
}

export async function getCurrentUser() {
  try {
    const currentAccount = await account.get();

    if (!currentAccount) throw Error;

    const currentUser = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal("accountId", currentAccount.$id)],
    );

    if (!currentUser) throw Error;

    return currentUser?.documents[0];
  } catch (error) {
    console.log(error);
  }
}

export async function createPost(post: TNewPost) {
  try {
    // Uploading image to appwrite storage
    const uploadedFile = await uploadFile(post.file[0]);

    if (!uploadedFile) throw Error;

    const imageUrl = getImageUrl(uploadedFile?.$id);

    if (!imageUrl) {
      await deleteFile(uploadedFile?.$id);
      throw Error;
    }

    const newPost = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      ID.unique(),
      {
        creator: post.userId,
        caption: post.caption,
        imageId: uploadedFile?.$id,
        imageUrl: imageUrl,
        location: post.location,
        altText: post.altText,
      },
    );

    if (!newPost) {
      await deleteFile(uploadedFile?.$id);
    }

    return newPost;
  } catch (error) {
    console.log(error);
  }
}
export async function updatePost(post: TUpdatePost) {
  const hadFileToUpdate = post.file.length > 0;

  try {
    let image = {
      imageUrl: post.imageUrl,
      imageId: post.imageId,
    };

    if (hadFileToUpdate) {
      const uploadedFile = await uploadFile(post.file[0]);

      if (!uploadedFile) throw Error;

      const fileUrl = getImageUrl(uploadedFile.$id);

      if (!fileUrl) {
        await deleteFile(uploadedFile?.$id);
        throw Error;
      }

      image = { ...image, imageUrl: fileUrl, imageId: uploadedFile.$id };
    }

    const updatedPost = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      post.postId,
      {
        caption: post.caption,
        imageId: image.imageId,
        imageUrl: image.imageUrl,
        location: post.location,
        altText: post.altText,
      },
    );

    if (!updatedPost) {
      await deleteFile(post.imageId);
      throw Error;
    }

    return updatedPost;
  } catch (error) {
    console.log(error);
  }
}

export async function deletePost(postId: string, imageId: string) {
  if (!postId || !imageId) throw Error;

  try {
    await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      postId,
    );

    return { status: "OK" };
  } catch (error) {
    console.log(error);
  }
}

export async function uploadFile(file: File) {
  try {
    const uploadedFile = await storage.createFile(
      appwriteConfig.storageId,
      ID.unique(),
      file,
    );

    if (!uploadedFile) throw Error;

    return uploadedFile;
  } catch (error) {
    console.log(error);
  }
}

export function getImageUrl(fileId: string) {
  try {
    const imageUrl = storage.getFilePreview(
      appwriteConfig.storageId,
      fileId,
      2000,
      2000,
      "top",
    );
    if (!imageUrl) throw Error;

    return imageUrl;
  } catch (error) {
    console.log(error);
  }
}

export async function deleteFile(fileId: string) {
  try {
    await storage.deleteFile(appwriteConfig.storageId, fileId);

    return { status: "OK" };
  } catch (error) {
    console.log(error);
  }
}

export async function getAllPosts() {
  try {
    const post = databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      [Query.orderDesc("$createdAt"), Query.limit(20)],
    );

    if (!post) throw Error;

    return post;
  } catch (error) {
    console.log(error);
  }
}

export async function likePost(postId: string, likesArray: string[]) {
  try {
    const updateLike = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      postId,
      {
        likes: likesArray,
      },
    );

    if (!updateLike) throw Error;

    return updateLike;
  } catch (error) {
    console.log(error);
  }
}

export async function savePost(postId: string, userId: string) {
  try {
    const updateSave = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.savesCollectionId,
      ID.unique(),
      {
        user: userId,
        post: postId,
      },
    );

    if (!updateSave) throw Error;

    return updateSave;
  } catch (error) {
    console.log(error);
  }
}
export async function deleteSavedPost(savedId: string) {
  try {
    const status = await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.savesCollectionId,
      savedId,
    );

    if (!status) throw Error;

    return { status: "OK" };
  } catch (error) {
    console.log(error);
  }
}

export async function followUser(
  userId: string,
  followerId: string,
  followingArray: string[],
  followersArray: string[],
) {
  try {
    const updateFollowing = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      userId,
      { following: followingArray },
    );
    if (!updateFollowing) throw Error;

    const updateFollowers = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      followerId,
      { followers: followersArray },
    );

    if (!updateFollowers) throw Error;

    return { updateFollowing, updateFollowers };
  } catch (error) {
    console.log(error);
  }
}

export async function getUserById(userId: string) {
  try {
    const user = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      userId,
    );
    if (!user) throw Error;

    return user;
  } catch (error) {
    console.log(error);
  }
}

export async function getPostById(postId: string) {
  try {
    const post = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      postId,
    );

    if (!post) throw Error;

    return post;
  } catch (error) {
    console.log(error);
  }
}

export async function createComment(postId: string, comments: string[]) {
  try {
    const newComment = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      postId,
      {
        com: comments,
      },
    );

    if (!newComment) throw Error;

    return newComment;
  } catch (error) {
    console.log(error);
  }
}

export async function updateComment(
  postId: string,
  commentId: string,
  updatedText: string,
) {
  try {
    const post = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      postId,
    );
    if (!post) throw Error;

    const updatedComments = post.com.map((comment: string) => {
      const parsedComment = JSON.parse(comment);
      if (parsedComment.id === commentId) {
        // Update the comment text
        parsedComment.commentText = updatedText;
      }

      return JSON.stringify(parsedComment);
    });

    const newComment = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      postId,
      {
        com: updatedComments,
      },
    );

    if (!newComment) throw Error;
    return newComment;
  } catch (error) {
    console.log(error);
  }
}

export async function deleteComment(postId: string, commentId: string) {
  try {
    const post = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      postId,
    );

    if (!post) throw Error;

    const parsedComment = post.com.map((comment: string) =>
      JSON.parse(comment),
    );

    const updatedComments = parsedComment.filter(
      (comment: TComment) => comment.id !== commentId,
    );
    const stringifiedComments = updatedComments.map((comment: TComment) =>
      JSON.stringify(comment),
    );

    const newComment = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      postId,
      {
        com: stringifiedComments,
      },
    );

    if (!newComment) throw Error;

    return newComment;
  } catch (error) {
    console.log(error);
  }
}

export async function toggleLikeComment(
  postId: string,
  commentId: string,
  commentLikesArray: string[],
  userId: string,
) {
  try {
    const post = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      postId,
    );
    if (!post) throw Error;

    const commentIndex = post.com.findIndex((comment: string) => {
      const parsedComment = JSON.parse(comment);
      return parsedComment.id === commentId;
    });

    if (commentIndex === -1) throw Error;

    const parsedComment = JSON.parse(post.com[commentIndex]);

    const userLikedIndex = parsedComment.likes.indexOf(userId);

    if (userLikedIndex === -1) {
      // If the user hasn't liked the comment, add the userId to likes array
      parsedComment.likes.push(userId);
    } else {
      // If the user has already liked the comment, remove the userId from likes array
      parsedComment.likes.splice(userLikedIndex, 1);
    }

    // Update the modified comment back to the comments array
    post.com[commentIndex] = JSON.stringify(parsedComment);

    // Update the post with the modified comments array
    await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      postId,
      {
        com: post.com,
      },
    );
    return "Like toggled successfully";
  } catch (error) {
    console.log(error);
  }
}

export async function getInfinitePosts({ pageParam }: { pageParam: number }) {
  const queries: any[] = [Query.orderDesc("$updatedAt"), Query.limit(10)];

  if (pageParam) {
    queries.push(Query.cursorAfter(pageParam.toString()));
  }

  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      queries,
    );

    if (!posts) throw Error;

    return posts;
  } catch (error) {
    console.log(error);
  }
}
export async function searchPosts(searchValue: string) {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      [Query.search("caption", searchValue)],
    );

    if (!posts) throw Error;

    return posts;
  } catch (error) {
    console.log(error);
  }
}
