import React from "react"

import { AppContext } from "./App"
import db from "./db"
import styles from "./styles.css"

const T = styles.tags(styled => ({
  UserDatabase: styled.div(styles.userDatabase),
  UserList: styled.ul(styles.userList),
  UpdateUsersForm: styled(({ className, ...props }) => (
    <div className={className}>
      <h2>Update user list</h2>
      <form onSubmit={props.onUpdateUsers}>
        <textarea onChange={props.onUpdateUsersContent} />
        <button type="submit">Update</button>
      </form>
    </div>
  ))(styles.updateUsersForm),
}))

class UserDatabase extends React.Component {
  state = {
    updateContent: "",
  }

  onUpdateUsersContent = ev =>
    this.setState({ updateContent: ev.currentTarget.value })

  onUpdateUsers = ev => {
    const { updateContent } = this.state
    try {
      const newUsers = updateContent
        .split(/$/m) // Split lines
        .map(l => l.trim().split(",")) // Split around commas
        .slice(1) // Drop first line (field names)
        .reduce(
          (users, user) => [
            ...users,
            {
              discordName: user[0],
              igHandle: "@" + user[3].match(/instagram\.com\/([^\/]+)\/?/)[1],
            },
          ],
          [],
        )
      if (!newUsers.length) {
        if (!window.confirm("No users, are you sure you want to continue?")) {
          return
        }
      }
      db.update(newUsers)
      this.setState({ updateContent: "" })
    } catch (error) {
      console.error(error)
    }
  }

  render() {
    const { updateContent } = this.state

    return (
      <T.UserDatabase>
        <h1>Users</h1>
        <AppContext.Consumer>
          {({ users }) => (
            <T.UserList>
              <table>
                <thead>
                  <tr>
                    <th>Discord</th>
                    <th>Instagram</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr>
                      <td>{user.discordName}</td>
                      <td>
                        <a href={`https://instagram.com/${user.igHandle}`}>
                          {user.igHandle}
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </T.UserList>
          )}
        </AppContext.Consumer>
        <hr />
        <T.UpdateUsersForm
          content={updateContent}
          onUpdateUsersContent={this.onUpdateUsersContent}
          onUpdateUsers={this.onUpdateUsers}
        />
      </T.UserDatabase>
    )
  }
}

export default UserDatabase
