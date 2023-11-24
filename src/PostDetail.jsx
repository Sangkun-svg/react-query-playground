import { useQuery, useMutation } from "@tanstack/react-query";

const BASE_URL = `https://jsonplaceholder.typicode.com`;

async function fetchComments(postId) {
  const response = await fetch(BASE_URL + `/comments?postId=${postId}`);
  return response.json();
}

async function deletePost(postId) {
  const response = await fetch(BASE_URL + `/postId/${postId}`, {
    method: "DELETE",
  });
  return response.json();
}

async function updatePost(postId) {
  const response = await fetch(BASE_URL + `/postId/${postId}`, {
    method: "PATCH",
    data: { title: "REACT QUERY FOREVER!!!!" },
  });
  return response.json();
}

export function PostDetail({ post }) {
  const {
    data: comments,
    isLoading,
    error,
    isError,
  } = useQuery({
    queryKey: ["comments", post.id],
    queryFn: () => fetchComments(post.id),
  });

  const {
    mutate,
    isError: isDeleteError,
    isLoading: isDeleteLoading,
    isSuccess: isDeleteSuccess,
  } = useMutation({
    mutationFn: (postId) => deletePost(postId),
  });
  const {
    mutate: updateMutation,
    isError: isUpdateError,
    isLoading: isUpdateLoading,
    isSuccess: isUpdateSuccess,
  } = useMutation({
    mutationFn: (postId) => updatePost(postId),
  });

  if (isLoading) return <p>Comments Loading...</p>;
  if (isError) {
    return <p>{error.toString()}</p>;
  }

  return (
    <>
      <h3 style={{ color: "blue" }}>{post.title}</h3>
      <button onClick={() => mutate(post.id)}>Delete</button>
      {isDeleteError && <p>Error Deleting the post</p>}
      {isDeleteLoading && <p>Deleting the post</p>}
      {isDeleteSuccess && <p>Post has been Deleted</p>}
      <button onClick={() => updateMutation(post.id)}>Update title</button>
      <p>{post.body}</p>
      <h4>Comments</h4>
      {comments.map((comment) => (
        <li key={comment.id}>
          {comment.email}: {comment.body}
        </li>
      ))}
    </>
  );
}
