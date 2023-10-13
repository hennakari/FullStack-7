import { useState } from 'react'
import { Input, Button } from '../styles'

const CommentForm = ({ createComment, selectedBlog }) => {
  const [text, setText] = useState('')

  const handleComment = (event) => {
    event.preventDefault()
    let newComment = text
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
        <table>
          <tbody>
            <tr>
              <td>comment</td>
              <td>
                <Input
                  id='comment'
                  type="text"
                  value={text}
                  name="comment"
                  onChange={({ target }) => setText(target.value)}
                />
              </td>
            </tr>
          </tbody>
        </table>
        <Button id='login-button' type="submit">add</Button>
      </form>
    </div>
  )
}

export default CommentForm