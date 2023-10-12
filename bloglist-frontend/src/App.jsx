import { useState, useEffect, useRef } from 'react'
import BlogForm from './components/BlogForm'
import CommentForm from './components/CommentForm'
// import LoginForm from './components/LoginForm'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'
import userService from './services/users'
import {
  BrowserRouter as Router,
  Routes, Route, Link, useParams
} from 'react-router-dom'

const SuccessNotification = ({ message }) => {
  if (message === null) {
    return null
  }

  return (
    <div className="success">
      {message}
    </div>
  )
}


const ErrorNotification = ({ message }) => {
  if (message === null) {
    return null
  }

  return (
    <div className="error">
      {message}
    </div>
  )
}

const LoggedDetails = ( { user, loginForm, handleLogout }) => {
  return(
    <span>
      {!user && loginForm()}
      {user &&
        <span>
          <span>{user.name} logged in </span>
          <button onClick={handleLogout}>logout</button>
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
      <h2>blogs</h2>
      {/* <LoggedDetails user={user} loginForm={loginForm} handleLogout={handleLogout} /> */}
      {/*{!user && loginForm()}
      {user &&
        <div>
          <p>{user.name} logged in</p>
          <button onClick={handleLogout}>logout</button>
        </div>
      } */}

      <h2>users</h2>
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


const UserView = ({ users, user, loginForm, handleLogout }) => {
  const id = useParams().id
  console.log(id)
  const selected = users.find(us => us.id === id)

  if (!selected) {
    return null
  }
  const blogs = selected.blogs

  return(
    <div>
      <h2>blogs</h2>
      {/* <LoggedDetails user={user} loginForm={loginForm} handleLogout={handleLogout} /> */}
      {/*{!user && loginForm()}
      {user &&
        <div>
          <p>{user.name} logged in</p>
          <button onClick={handleLogout}>logout</button>
        </div>
      } */}

      <h2>{selected.name}</h2>
      <h3>added blogs</h3>
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

const BlogView = ({ user, loginForm, handleLogout, blogs, likeBlog, setBlogs, commentForm }) => {
  const id = useParams().id
  console.log(id)
  console.log(blogs)
  if (!blogs) {
    return null
  }
  const selectedBlog = blogs.find(bl => bl.id === id)
  console.log(selectedBlog)
  //console.log(selectedBlog.comments)

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
      <h2>blog app</h2>
      {/* <LoggedDetails user={user} loginForm={loginForm} handleLogout={handleLogout} /> */}
      {/*{!user && loginForm()}
      {user &&
        <div>
          <p>{user.name} logged in</p>
          <button onClick={handleLogout}>logout</button>
        </div>
      } */}

      <h2>{selectedBlog.title} {selectedBlog.author}</h2>
      <div><a href={selectedBlog.url}>{selectedBlog.url}</a></div>
      <div>likes {selectedBlog.likes}<button className="likeButton" value={selectedBlog.id} onClick={handleLikeClick}>like</button></div>
      <div>added by {user.name}</div>
      <h3>comments</h3>
      {commentForm(selectedBlog)}
      {/* <button className="noCommentButton" value={selectedBlog.id} onClick={handleNoCommentClick}>haven't read this yet..</button> */}
      {/* <button className="commentButton" value={selectedBlog.id} onClick={handleCommentClick}>add comment</button> */}
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

const Blogs = ({ users, user, loginForm, handleLogout, updateBlog, deleteBlog, successMessage, errorMessage, blogForm, blogs }) => {

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  return(
    <div>

      <h2>blog app</h2>
      <SuccessNotification message={successMessage}/>
      <ErrorNotification message={errorMessage}/>

      {/* <LoggedDetails user={user} loginForm={loginForm} handleLogout={handleLogout} /> */}
      {/*{!user && loginForm()}
      {user &&
               <div>
          <p>{user.name} logged in
            <button onClick={handleLogout}>logout</button>
          </p>
        </div> */}
      <div>
        {blogForm()}
        {blogs.map(blog =>
        // <Blog key={blog.id} blog={blog} user={user} likeBlog={updateBlog} removeBlog={deleteBlog} />
          <div className='blog' key={blog.id} style={blogStyle}>
            <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
          </div>
        )}
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
      console.log(blogs)
    }
    fetchData()
  }, [])

  useEffect(() => {
    async function fetchData() {
      const users = await userService.getAll()
      setUsers( users )
      console.log(users)
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
    <Togglable buttonLabel='add new blog' ref={blogFormRef}>
      <BlogForm createBlog={addBlog} />
    </Togglable>
  )

  const commentFormRef = useRef()

  const commentForm = (selectedBlog) => (
    <Togglable buttonLabel='add comment' ref={commentFormRef} >
      <CommentForm createComment={addComment} selectedBlog={selectedBlog} />
    </Togglable>
  )

  const addComment = async (id, newObj) => {
    console.log('adding a comment....')
    commentFormRef.current.toggleVisibility()
    console.log(id)
    console.log(newObj)
    try {
      const returnedBlog = await blogService.createComment(id, newObj)
      /*const blogToBeUpdated = blogs.find(blog => blog.id.toString() === id)
      const blogAdder = blogToBeUpdated.user
      returnedBlog.user = blogAdder */
      console.log('tällainen blogi tuli takaisin')
      console.log(returnedBlog)
      const updatedBlogList = blogs.map(blog => blog.id !== id ? blog : returnedBlog)
      updatedBlogList.sort((a, b) => b.likes - a.likes)
      setBlogs(updatedBlogList)
    } catch (exception) {
      console.log('ei vitsi, pieleen meni')
      console.log(exception)
    }
  }


  const loginForm = () => {

    return(
      <div>
        <h2>Log in to application</h2>
        <form onSubmit={handleLogin}>
          <div>
            username
            <input
              id='username'
              type="text"
              value={username}
              name="Username"
              onChange={({ target }) => setUsername(target.value)}
            />
          </div>
          <div>
            password
            <input
              id='password'
              type="password"
              value={password}
              name="Password"
              onChange={({ target }) => setPassword(target.value)}
            />
          </div>
          <button id='login-button' type="submit">login</button>
        </form>
      </div>
    )
  }

  const linkStyle = {
    padding: 5
  }


  return (
    <Router>
      <div className="navbar">
        <Link style={linkStyle} to="/">blogs</Link>
        <Link style={linkStyle} to="/users">users</Link>
        <LoggedDetails user={user} loginForm={loginForm} handleLogout={handleLogout} />
      </div>
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
  )
}

export default App