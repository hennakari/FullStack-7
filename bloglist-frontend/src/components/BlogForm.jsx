import { useState } from 'react'
import PropTypes from 'prop-types'
import { Input, Button } from '../styles'

const BlogForm = ({ createBlog }) => {
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')

  const addBlog = (event) => {
    event.preventDefault()
    createBlog({
      title: newTitle,
      author: newAuthor,
      url: newUrl,
    })
    setNewTitle('')
    setNewAuthor('')
    setNewUrl('')
  }

  return(
    <div>
      <h2>Create a new blog</h2>
      <form onSubmit={addBlog}>
        <table>
          <tbody>
            <tr>
              <td>title:</td>
              <td>
                <Input
                  value={newTitle}
                  onChange={event => setNewTitle(event.target.value)}
                  id='title-input'
                />
              </td>
            </tr>
            <tr>
              <td>author:</td>
              <td>
                <Input
                  value={newAuthor}
                  onChange={event => setNewAuthor(event.target.value)}
                  id='author-input'
                />
              </td>
            </tr>
            <tr>
              <td>url:</td>
              <td>
                <Input
                  value={newUrl}
                  onChange={event => setNewUrl(event.target.value)}
                  id='url-input'
                />
              </td>
            </tr>
          </tbody>
        </table>
        <Button type="submit">create</Button>
      </form>
    </div>
  )
}

BlogForm.propTypes = {
  createBlog: PropTypes.func.isRequired,
}

export default BlogForm