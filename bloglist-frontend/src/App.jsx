import { useState, useEffect, useRef } from 'react'
import BlogForm from './components/BlogForm'
import CommentForm from './components/CommentForm'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'
import userService from './services/users'
import {
  BrowserRouter as Router,
  Routes, Route, Link, useParams
} from 'react-router-dom'
import { Page, Navigation, Input, Button, ListItem, StyledLink, StyledLinkNav, Header, Span, MarginDiv, SuccessDiv, ErrorDiv } from './styles'

const SuccessNotification = ({ message }) => {
  if (message === null) {
    return null
  }

  return (
    <SuccessDiv>
      {message}
    </SuccessDiv>
  )
}


const ErrorNotification = ({ message }) => {
  if (message === null) {
    return null
  }

  return (
    <ErrorDiv>
      {message}
    </ErrorDiv>
  )
}


const LoggedDetails = ( { user, loginForm, handleLogout }) => {
  return(
    <span>
      {!user && loginForm()}
      {user &&
        <span>
          <Span>{user.name} logged in </Span>
          <Button onClick={handleLogout}>logout</Button>
        </span>
      }
    </span>
  )
}


const Users = ({ users, user, loginForm, handleLogout }) => {
  if (!users) {
    return null
  }

  return(
    <div>
      <Header>Blog app</Header>

      <h2>Users</h2>
      <table>
        <thead>
          <tr>
            <th></th>
            <th>blogs created</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user =>
            <tr key={user.id}>
              <td><Link to={`/users/${user.id}`}>{user.name}</Link></td>
              <td>{user.blogs.length}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}


const UserView = ({ users }) => {
  const id = useParams().id
  console.log(id)
  const selected = users.find(us => us.id === id)

  if (!selected) {
    return null
  }
  const blogs = selected.blogs

  return(
    <div>
      <Header>Blog app</Header>

      <h2>{selected.name}</h2>
      <h3>Added blogs</h3>
      <ul>
        {blogs.map(blog =>
          <li key={blog.id}>
            {blog.title}
          </li>
        )}
      </ul>
    </div>
  )
}

const BlogView = ({ user, blogs, likeBlog, commentForm }) => {
  const id = useParams().id
  if (!blogs) {
    return null
  }
  const selectedBlog = blogs.find(bl => bl.id === id)

  if (!selectedBlog) {
    return null
  }

  const handleLikeClick = (event) => {
    event.preventDefault()
    likeBlog(event.target.value,{
      title: selectedBlog.title,
      author: selectedBlog.author,
      url: selectedBlog.url,
      likes: selectedBlog.likes + 1,
      user: selectedBlog.user,
      comments: selectedBlog.comments
    })
  }



  if (!selectedBlog.comments) {
    selectedBlog.comments = []
  }


  return(
    <div>
      <Header>Blog app</Header>

      <h2>{selectedBlog.title} by {selectedBlog.author}</h2>
      <MarginDiv><a href={selectedBlog.url}>{selectedBlog.url}</a></MarginDiv>
      <MarginDiv>likes {selectedBlog.likes}<Button className="likeButton" value={selectedBlog.id} onClick={handleLikeClick}>like</Button></MarginDiv>
      <MarginDiv>added by {user.name}</MarginDiv>
      <h3>Comments</h3>
      {commentForm(selectedBlog)}
      <ul>
        {selectedBlog.comments.map((comment, pos) =>
          <li key={pos}>
            {comment}
          </li>
        )}
      </ul>
    </div>
  )
}

const Blogs = ({ successMessage, errorMessage, blogForm, blogs }) => {

  return(
    <div>

      <Header>Blog app</Header>
      <SuccessNotification message={successMessage}/>
      <ErrorNotification message={errorMessage}/>

      <div>
        {blogForm()}
        <MarginDiv>
          {blogs.map(blog =>
            <ListItem key={blog.id}>
              <StyledLink to={`/blogs/${blog.id}`}>{blog.title}</StyledLink>
            </ListItem>
          )}
        </MarginDiv>
      </div>
    </div>
  )
}




const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [users, setUsers] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  useEffect(() => {
    async function fetchData() {
      const blogs = await blogService.getAll()
      blogs.sort((a, b) => b.likes - a.likes)
      setBlogs( blogs )
    }
    fetchData()
  }, [])

  useEffect(() => {
    async function fetchData() {
      const users = await userService.getAll()
      setUsers( users )
    }
    fetchData()
  }, [])


  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])


  const handleLogin = async (event) => {
    event.preventDefault()
    console.log('logging in with', username, password)
    try {
      const user = await loginService.login({
        username, password,
      })

      window.localStorage.setItem(
        'loggedBlogAppUser', JSON.stringify(user)
      )
      console.log(user)
      blogService.setToken(user.token)
      setUser(user)
      setSuccessMessage(`Successful login for ${user.name}`)
      setTimeout(() => {
        setSuccessMessage(null)
      }, 5000)
      setUsername('')
      setPassword('')
    } catch (exception) {
      console.log(exception)
      setErrorMessage('wrong username or password')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleLogout = (event) => {
    console.log('logging out....')
    window.localStorage.removeItem('loggedBlogAppUser')
    window.location.reload()
  }

  const addBlog = async (blogObject) => {
    console.log('adding a blog....')
    blogFormRef.current.toggleVisibility()
    try {
      const returnedBlog = await blogService.create(blogObject)
      returnedBlog.user = user
      const updatedBlogList = blogs.concat(returnedBlog)
      updatedBlogList.sort((a, b) => b.likes - a.likes)
      setBlogs(updatedBlogList)
      setSuccessMessage(`a new blog ${blogObject.title} by ${blogObject.author} added`)
      setTimeout(() => {
        setSuccessMessage(null)
      }, 5000)
    } catch (exception) {
      setErrorMessage(exception.message)
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const updateBlog = async (id, updatedBlog) => {
    console.log('updating....')
    try {
      const returnedBlog = await blogService.update(id, updatedBlog)
      const blogToBeUpdated = blogs.find(blog => blog.id.toString() === id)
      const blogAdder = blogToBeUpdated.user
      returnedBlog.user = blogAdder
      const updatedBlogList = blogs.map(blog => blog.id !== id ? blog : returnedBlog)
      updatedBlogList.sort((a, b) => b.likes - a.likes)
      setBlogs(updatedBlogList)
      setSuccessMessage(`blog ${updatedBlog.title} was liked`)
      setTimeout(() => {
        setSuccessMessage(null)
      }, 5000)
    } catch (exception) {
      setErrorMessage(exception.message)
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const deleteBlog = async (id) => {
    console.log('deleting....')
    const selected = blogs.find(blog => blog.id.toString() === id)
    if (window.confirm(`Remove blog ${selected.title} ?`)) {
      try {
        await blogService.deleteBlog(id)
        setSuccessMessage(`blog ${selected.title} was removed`)
        setTimeout(() => {
          setSuccessMessage(null)
        }, 5000)
      } catch (exception) {
        setErrorMessage(exception.message)
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
      }
      const isSelected = (selected) => selected.id.toString() !== id
      const updatedBlogLIst = blogs.filter(isSelected)
      setBlogs(updatedBlogLIst)
    }
  }


  const blogFormRef = useRef()

  const blogForm = () => (
    <Togglable buttonLabel='add new blog' buttonStyle={Button} ref={blogFormRef}>
      <BlogForm createBlog={addBlog} inputStyle={Input} buttonStyle={Button} />
    </Togglable>
  )

  const commentFormRef = useRef()

  const commentForm = (selectedBlog) => (
    <Togglable buttonLabel='add comment' buttonStyle={Button} ref={commentFormRef} >
      <CommentForm createComment={addComment} selectedBlog={selectedBlog} inputStyle={Input} buttonStyle={Button} />
    </Togglable>
  )

  const addComment = async (id, newObj) => {
    console.log('adding a comment....')
    commentFormRef.current.toggleVisibility()
    try {
      const returnedBlog = await blogService.createComment(id, newObj)
      const updatedBlogList = blogs.map(blog => blog.id !== id ? blog : returnedBlog)
      updatedBlogList.sort((a, b) => b.likes - a.likes)
      setBlogs(updatedBlogList)
    } catch (exception) {
      console.log(exception)
    }
  }


  const loginForm = () => {

    return(
      <div>
        <h2>Log in to application</h2>
        <form onSubmit={handleLogin}>
          <table>
            <tbody>
              <tr>
                <td>username</td>
                <td>
                  <Input
                    id='username'
                    type="text"
                    value={username}
                    name="Username"
                    onChange={({ target }) => setUsername(target.value)}
                  />
                </td>
              </tr>
              <tr>
                <td>password</td>
                <td>
                  <Input
                    id='password'
                    type="password"
                    value={password}
                    name="Password"
                    onChange={({ target }) => setPassword(target.value)}
                  />
                </td>
              </tr>
            </tbody>
          </table>
          <Button id='login-button' type="submit">login</Button>
        </form>
      </div>
    )
  }

  return (
    <Page>
      <Router>
        <Navigation className="navbar">
          <StyledLinkNav to="/">blogs</StyledLinkNav>
          <StyledLinkNav to="/users">users</StyledLinkNav>
          <LoggedDetails user={user} loginForm={loginForm} handleLogout={handleLogout} />
        </Navigation>
        <Routes>
          <Route path="/users/:id" element={<UserView users={users} user={user} loginForm={loginForm} handleLogout={handleLogout} />} />
          <Route path="/blogs/:id" element={<BlogView user={user} loginForm={loginForm} handleLogout={handleLogout}
            likeBlog={updateBlog} blogs={blogs} setBlogs={setBlogs} commentForm={commentForm} />} />
          <Route path="/users" element={<Users users={users} user={user} loginForm={loginForm} handleLogout={handleLogout} />} />
          <Route path="/" element={<Blogs users={users} user={user} loginForm={loginForm} handleLogout={handleLogout}
            updateBlog={updateBlog} deleteBlog={deleteBlog} successMessage={successMessage} errorMessage={errorMessage}
            blogForm={blogForm} blogs={blogs} />} />
        </Routes>
      </Router>
    </Page>
  )
}

export default App