import { useState } from 'react'

const CommentForm = ({ createComment, selectedBlog }) => {
  const [text, setText] = useState('')

  const handleComment = (event) => {
    event.preventDefault()
    let newComment = text
    console.log(event.target)
    console.log(event.target.value)
    console.log(selectedBlog.id)
    createComment(selectedBlog.id,{
      title: selectedBlog.title,
      author: selectedBlog.author,
      url: selectedBlog.url,
      likes: selectedBlog.likes,
      user: selectedBlog.user,
      comments: selectedBlog.comments.concat(newComment)
    })
    setText('')
  }

  return(
    <div>
      <h2>add a comment</h2>
      <form onSubmit={handleComment}>
        <div>
          comment
          <input
            id='comment'
            type="text"
            value={text}
            name="comment"
            onChange={({ target }) => setText(target.value)}
          />
        </div>
        <button id='login-button' type="submit">add</button>
      </form>
    </div>
  )
}

export default CommentForm